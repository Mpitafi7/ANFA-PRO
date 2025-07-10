import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

class User {
  static async me() {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        if (user) {
          resolve({
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            total_links: 0 // TODO: Get from Firestore
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  static async login(credentials) {
    // This is handled by AuthModal now
    return null;
  }

  static async register(userData) {
    // This is handled by AuthModal now
    return null;
  }

  static async logout() {
    try {
      await signOut(auth);
      localStorage.removeItem('user');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  static async updateMyUserData(data) {
    // TODO: Update user data in Firestore
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...currentUser, ...data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }

  static async list() {
    // This would be admin-only in real app
    return [];
  }
}

export { User }; 