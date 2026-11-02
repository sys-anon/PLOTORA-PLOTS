// ============================================================
//  PLOTORA — Property Service (Firestore CRUD)
//  NOTE: Firebase Storage NOT used (requires Blaze/paid plan)
//        Images are stored as URLs pasted by the user.
// ============================================================

import {
  collection, addDoc, getDocs, getDoc, doc,
  deleteDoc, updateDoc, query, where, orderBy,
  serverTimestamp, onSnapshot, limit,
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION = 'properties';

// ─── Add a new property ─────────────────────────────────────
export async function addProperty(data) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    verified: false,
    featured: false,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// ─── Get ALL properties once (Admin panel) ───────────────────
// Falls back to no-orderBy if composite index doesn't exist yet
export async function getAllProperties(statusFilter = 'approved') {
  try {
    // Try with orderBy first (needs composite index in Firestore)
    const q = query(
      collection(db, COLLECTION),
      where('status', '==', statusFilter),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    // Index not ready yet — fall back to simple query (no ordering)
    console.warn('Falling back to simple query (index not ready):', err.message);
    const q2 = query(
      collection(db, COLLECTION),
      where('status', '==', statusFilter)
    );
    const snapshot2 = await getDocs(q2);
    return snapshot2.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
}

// ─── Real-time listener for public listings ──────────────────
export function subscribeProperties(callback, filters = {}) {
  try {
    const constraints = [where('status', '==', 'approved')];

    if (filters.category && filters.category !== 'all') {
      constraints.push(where('category', '==', filters.category));
    }
    if (filters.type && filters.type !== 'All Types') {
      constraints.push(where('type', '==', filters.type));
    }

    constraints.push(orderBy('createdAt', 'desc'));
    const q = query(collection(db, COLLECTION), ...constraints);

    return onSnapshot(q, (snapshot) => {
      const props = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(props);
    }, (err) => {
      // If index missing, fall back to simple query
      console.warn('Snapshot fallback:', err.message);
      const q2 = query(collection(db, COLLECTION), where('status', '==', 'approved'));
      onSnapshot(q2, (snap) => {
        callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
    });
  } catch (err) {
    console.error('subscribeProperties error:', err);
    return () => {};
  }
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
  try {
    const q = query(
      collection(db, COLLECTION),
      where('status', '==', 'approved'),
      where('featured', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    // Fallback
    const q2 = query(
      collection(db, COLLECTION),
      where('status', '==', 'approved'),
      where('featured', '==', true)
    );
    const snapshot2 = await getDocs(q2);
    return snapshot2.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
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
