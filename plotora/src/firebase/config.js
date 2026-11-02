import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            "AIzaSyCzwewFjJQgqN5EpCheZr-bHjaEPYxWo5c",
  authDomain:        "plotora-61b18.firebaseapp.com",
  projectId:         "plotora-61b18",
  storageBucket:     "plotora-61b18.firebasestorage.app",
  messagingSenderId: "661371788891",
  appId:             "1:661371788891:web:80ef8f6a0c5e34e791697e",
  measurementId:     "G-M6JCFHXR4Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const db   = getFirestore(app);  // Firestore database
export const auth = getAuth(app);       // Authentication

export default app;
