import { auth } from '../firebase';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { generatePublicId } from '../utils/publicIdGenerator.js';
import AnalyticsService from '../utils/analytics.js';

class User {
  // Generate unique 8-character ID
  static generateUniqueId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static async me() {
    return new Promise((resolve) => {
      try {
        // Clear demo data on app start
        User.clearDemoData();
        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          if (user) {
            // Get or generate custom ID
            let customId = localStorage.getItem(`customId_${user.uid}`);
            if (!customId) {
              customId = User.generateUniqueId();
              localStorage.setItem(`customId_${user.uid}`, customId);
            }

            // Get or generate public ID
            let publicId = localStorage.getItem(`publicId_${user.uid}`);
            if (!publicId) {
              publicId = generatePublicId();
              localStorage.setItem(`publicId_${user.uid}`, publicId);
            }

            const userData = {
              id: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              emailVerified: user.emailVerified,
              customId: customId,
              publicId: publicId,
              plan: localStorage.getItem(`plan_${user.uid}`) || 'basic',
              total_links: parseInt(localStorage.getItem(`total_links_${user.uid}`) || '0'),
              total_clicks: parseInt(localStorage.getItem(`total_clicks_${user.uid}`) || '0'),
              joined: localStorage.getItem(`joined_${user.uid}`) || new Date().toISOString()
            };

            // Track user registration in analytics
            AnalyticsService.trackUserRegistration(user.uid, userData);

            // Create public profile if it doesn't exist
            User.updatePublicProfile(user.uid, userData);

            resolve(userData);
          } else {
            resolve(null);
          }
        });
      } catch (error) {
        console.error('Error in User.me():', error);
        resolve(null);
      }
    });
  }

  // Get public profile data (read-only, secure)
  static async getPublicProfile(publicId) {
    try {
      // In a real app, this would fetch from database
      // For now, we'll check localStorage data
      const allUsers = JSON.parse(localStorage.getItem('publicProfiles') || '{}');
      const userData = allUsers[publicId];
      
      if (!userData) {
        return null; // Return null if no profile exists
      }

      // Return only public data (no email, password, etc.)
      return {
        publicId: userData.publicId,
        name: userData.displayName || 'Anonymous User',
        plan: userData.plan || 'basic',
        verified: userData.plan === 'pro' || userData.plan === 'team',
        linksCreated: userData.total_links || 0,
        totalViews: userData.total_clicks || 0,
        joined: userData.joined || new Date().toISOString(),
        profileImage: userData.photoURL || null
      };
    } catch (error) {
      console.error('Error fetching public profile:', error);
      return null;
    }
  }

  // Update public profile data
  static async updatePublicProfile(userId, profileData) {
    try {
      const allUsers = JSON.parse(localStorage.getItem('publicProfiles') || '{}');
      const user = await User.me();
      
      if (user && user.publicId) {
        allUsers[user.publicId] = {
          publicId: user.publicId,
          displayName: profileData.name || user.displayName,
          plan: profileData.plan || user.plan,
          total_links: profileData.linksCreated || user.total_links || 0,
          total_clicks: profileData.totalViews || user.total_clicks || 0,
          joined: user.joined,
          photoURL: profileData.profileImage || user.photoURL
        };
        
        localStorage.setItem('publicProfiles', JSON.stringify(allUsers));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating public profile:', error);
      return false;
    }
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
    const currentUser = auth.currentUser;
    if (!currentUser) return null;

    // Update custom ID if provided
    if (data.customId) {
      localStorage.setItem(`customId_${currentUser.uid}`, data.customId);
    }

    // Update public ID if provided
    if (data.publicId) {
      localStorage.setItem(`publicId_${currentUser.uid}`, data.publicId);
    }

    // Update plan if provided
    if (data.plan) {
      localStorage.setItem(`plan_${currentUser.uid}`, data.plan);
    }

    // Update stats
    if (data.total_links !== undefined) {
      localStorage.setItem(`total_links_${currentUser.uid}`, data.total_links.toString());
    }

    if (data.total_clicks !== undefined) {
      localStorage.setItem(`total_clicks_${currentUser.uid}`, data.total_clicks.toString());
    }

    // Update display name in Firebase Auth
    if (data.displayName) {
      try {
        await updateProfile(currentUser, {
          displayName: data.displayName
        });
      } catch (error) {
        console.error('Error updating display name:', error);
      }
    }

    // Update public profile
    await User.updatePublicProfile(currentUser.uid, data);

    return await User.me();
  }

  static async list() {
    // This would be admin-only in real app
    return [];
  }

  // Clear demo data from localStorage
  static clearDemoData() {
    try {
      const allUsers = JSON.parse(localStorage.getItem('publicProfiles') || '{}');
      const cleanedUsers = {};
      
      // Only remove obvious demo data, keep real user data
      Object.keys(allUsers).forEach(key => {
        const userData = allUsers[key];
        // Only remove if it's clearly demo data
        if (userData.displayName === 'Demo User' || 
            userData.displayName === 'UU' ||
            (userData.total_links > 1000 && userData.total_clicks > 10000)) {
          // Skip this demo data
        } else {
          cleanedUsers[key] = userData;
        }
      });
      
      localStorage.setItem('publicProfiles', JSON.stringify(cleanedUsers));
      console.log('Demo data cleared from localStorage');
    } catch (error) {
      console.error('Error clearing demo data:', error);
    }
  }
}

export { User }; 