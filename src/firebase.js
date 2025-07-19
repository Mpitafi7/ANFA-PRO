import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJBsyBmbOxj90GrZvyFy0Umk0tais2SC8",
  authDomain: "anfa-pro.firebaseapp.com",
  projectId: "anfa-pro",
  storageBucket: "anfa-pro.firebasestorage.app",
  messagingSenderId: "752063631350",
  appId: "1:752063631350:web:22d3baca318c86505141d7",
  measurementId: "G-9D2Q58Q05P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize analytics only in browser
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}
export { analytics };

// Initialize Firestore
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider(); 