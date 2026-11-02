// ============================================================
//  PLOTORA — Property Service (Firestore CRUD + Storage Upload)
// ============================================================

import {
  collection, addDoc, getDocs, getDoc, doc,
  deleteDoc, updateDoc, query, where, orderBy,
  serverTimestamp, onSnapshot,
} from 'firebase/firestore';
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject,
} from 'firebase/storage';
import { db, storage } from './config';

const COLLECTION = 'properties';

// ─── Upload images to Firebase Storage ──────────────────────
export async function uploadImages(files, onProgress) {
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const storageRef = ref(storage, `properties/${Date.now()}_${file.name}`);
    await new Promise((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, file);
      task.on(
        'state_changed',
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          onProgress && onProgress(i, pct);
        },
        reject,
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          urls.push(url);
          resolve();
        }
      );
    });
  }
  return urls;
}

// ─── Add a new property ─────────────────────────────────────
export async function addProperty(data) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    verified: false,          // Admin must verify
    featured: false,
    status: 'pending',        // pending | approved | rejected
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// ─── Get ALL properties (real-time listener) ─────────────────
export function subscribeProperties(callback, filters = {}) {
  let q = collection(db, COLLECTION);

  const constraints = [where('status', '==', 'approved')];

  if (filters.category && filters.category !== 'all') {
    constraints.push(where('category', '==', filters.category));
  }
  if (filters.type && filters.type !== 'All Types') {
    constraints.push(where('type', '==', filters.type));
  }

  constraints.push(orderBy('createdAt', 'desc'));
  q = query(q, ...constraints);

  return onSnapshot(q, (snapshot) => {
    const props = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(props);
  });
}

// ─── Get ALL properties once (no real-time) ─────────────────
export async function getAllProperties(statusFilter = 'approved') {
  const q = query(
    collection(db, COLLECTION),
    where('status', '==', statusFilter),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Get pending properties (Admin panel) ───────────────────
export async function getPendingProperties() {
  const q = query(
    collection(db, COLLECTION),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Get single property by ID ───────────────────────────────
export async function getPropertyById(id) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
  return null;
}

// ─── Featured properties ─────────────────────────────────────
export async function getFeaturedProperties() {
  const q = query(
    collection(db, COLLECTION),
    where('status', '==', 'approved'),
    where('featured', '==', true),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Update property (Admin) ─────────────────────────────────
export async function updateProperty(id, data) {
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

// ─── Approve property (Admin) ────────────────────────────────
export async function approveProperty(id, featured = false) {
  await updateProperty(id, { status: 'approved', verified: true, featured });
}

// ─── Reject property (Admin) ─────────────────────────────────
export async function rejectProperty(id) {
  await updateProperty(id, { status: 'rejected' });
}

// ─── Delete property (Admin) ─────────────────────────────────
export async function deleteProperty(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}

// ─── Format price helper ─────────────────────────────────────
export function formatPrice(price, category) {
  if (!price) return 'Price on Request';
  const num = Number(price);
  if (category === 'rent') return `₹${num.toLocaleString()}/mo`;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000)   return `₹${(num / 100000).toFixed(0)} L`;
  return `₹${num.toLocaleString()}`;
}

