// ============================================================
//  PLOTORA — Firebase Configuration
//  Replace the values below with your Firebase project config
//  Get it from: Firebase Console → Project Settings → Your Apps
// ============================================================

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db      = getFirestore(app);   // Firestore database
export const storage = getStorage(app);     // File / image storage
export const auth    = getAuth(app);        // Authentication

export default app;

