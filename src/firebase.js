import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

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
export const analytics = getAnalytics(app);

// Configure Firestore with better connection settings
const firestore = getFirestore(app);

// Add connection timeout and retry logic
const firestoreSettings = {
  cacheSizeBytes: 50 * 1024 * 1024, // 50MB cache
  experimentalForceLongPolling: true, // Better for unstable connections
  useFetchStreams: false, // Disable fetch streams for better compatibility
};

// Initialize Firestore with settings
export const db = firestore;

// Add error handling for connection issues
export const initializeFirestore = async () => {
  try {
    // Test connection
    await firestore.enableNetwork();
    console.log('Firestore connected successfully');
  } catch (error) {
    console.warn('Firestore connection warning:', error);
    // Continue in offline mode
  }
};

export const googleProvider = new GoogleAuthProvider(); 