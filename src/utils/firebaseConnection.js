import { db } from '../firebase.js';
import { enableNetwork, disableNetwork } from 'firebase/firestore';

// Connection retry utility
export const retryFirestoreConnection = async (maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempting Firestore connection (${attempt}/${maxRetries})...`);
      await enableNetwork();
      console.log('Firestore connected successfully');
      return true;
    } catch (error) {
      console.warn(`Connection attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        console.error('All connection attempts failed, switching to offline mode');
        await disableNetwork();
        return false;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
};

// Check if we're online
export const isOnline = () => {
  return navigator.onLine;
};

// Handle connection state changes
export const setupConnectionHandlers = () => {
  window.addEventListener('online', async () => {
    console.log('Internet connection restored');
    await retryFirestoreConnection();
  });

  window.addEventListener('offline', () => {
    console.log('Internet connection lost, switching to offline mode');
  });
};

// Initialize connection monitoring
export const initializeConnectionMonitoring = () => {
  setupConnectionHandlers();
  
  // Initial connection check
  if (isOnline()) {
    retryFirestoreConnection();
  } else {
    console.log('Starting in offline mode');
  }
}; 