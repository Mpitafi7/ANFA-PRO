import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';

class AnalyticsService {
  // Track user registration
  static async trackUserRegistration(userId, userData) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...userData,
        registered_at: serverTimestamp(),
        last_active: serverTimestamp(),
        total_links: 0,
        total_clicks: 0,
        is_active: true
      });

      // Update global stats
      await this.updateGlobalStats('users', 1);
    } catch (error) {
      console.error('Error tracking user registration:', error);
    }
  }

  // Track link creation
  static async trackLinkCreation(userId, linkData) {
    try {
      const linkRef = doc(db, 'links', linkData.id);
      await setDoc(linkRef, {
        ...linkData,
        created_at: serverTimestamp(),
        last_click: null,
        click_count: 0,
        is_active: true
      });

      // Update user stats
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        total_links: increment(1),
        last_active: serverTimestamp()
      });

      // Update global stats
      await this.updateGlobalStats('links', 1);
    } catch (error) {
      console.error('Error tracking link creation:', error);
    }
  }

  // Track link click
  static async trackLinkClick(linkId, clickData = {}) {
    try {
      const linkRef = doc(db, 'links', linkId);
      
      // Update link stats
      await updateDoc(linkRef, {
        click_count: increment(1),
        last_click: serverTimestamp()
      });

      // Get link data to update user stats
      const linkDoc = await getDoc(linkRef);
      if (linkDoc.exists()) {
        const linkData = linkDoc.data();
        const userRef = doc(db, 'users', linkData.user_id);
        
        // Update user stats
        await updateDoc(userRef, {
          total_clicks: increment(1),
          last_active: serverTimestamp()
        });
      }

      // Update global stats
      await this.updateGlobalStats('clicks', 1);

      // Store click analytics
      const clickRef = doc(collection(db, 'clicks'));
      await setDoc(clickRef, {
        link_id: linkId,
        timestamp: serverTimestamp(),
        user_agent: clickData.userAgent || navigator.userAgent,
        ip_address: clickData.ipAddress || 'unknown',
        country: clickData.country || 'unknown',
        device: clickData.device || 'unknown',
        referrer: clickData.referrer || document.referrer
      });

    } catch (error) {
      console.error('Error tracking link click:', error);
    }
  }

  // Update global statistics
  static async updateGlobalStats(type, increment = 1) {
    try {
      const statsRef = doc(db, 'global_stats', 'main');
      const statsDoc = await getDoc(statsRef);
      
      if (statsDoc.exists()) {
        await updateDoc(statsRef, {
          [type]: increment,
          last_updated: serverTimestamp()
        });
      } else {
        await setDoc(statsRef, {
          users: type === 'users' ? increment : 0,
          links: type === 'links' ? increment : 0,
          clicks: type === 'clicks' ? increment : 0,
          created_at: serverTimestamp(),
          last_updated: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating global stats:', error);
    }
  }

  // Get real-time global statistics
  static getGlobalStats(callback) {
    const statsRef = doc(db, 'global_stats', 'main');
    
    return onSnapshot(statsRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        callback({
          totalUsers: data.users || 0,
          totalLinks: data.links || 0,
          totalClicks: data.clicks || 0,
          lastUpdated: data.last_updated
        });
      } else {
        callback({
          totalUsers: 0,
          totalLinks: 0,
          totalClicks: 0,
          lastUpdated: null
        });
      }
    });
  }

  // Get user statistics
  static async getUserStats(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          totalLinks: userData.total_links || 0,
          totalClicks: userData.total_clicks || 0,
          registeredAt: userData.registered_at,
          lastActive: userData.last_active
        };
      }
      
      return {
        totalLinks: 0,
        totalClicks: 0,
        registeredAt: null,
        lastActive: null
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalLinks: 0,
        totalClicks: 0,
        registeredAt: null,
        lastActive: null
      };
    }
  }

  // Get link analytics
  static async getLinkAnalytics(linkId) {
    try {
      const linkRef = doc(db, 'links', linkId);
      const linkDoc = await getDoc(linkRef);
      
      if (linkDoc.exists()) {
        const linkData = linkDoc.data();
        
        // Get click history
        const clicksRef = collection(db, 'clicks');
        const clicksQuery = query(
          clicksRef,
          where('link_id', '==', linkId),
          orderBy('timestamp', 'desc'),
          limit(100)
        );
        
        const clicksSnapshot = await getDocs(clicksQuery);
        const clicks = clicksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        return {
          clickCount: linkData.click_count || 0,
          createdAt: linkData.created_at,
          lastClick: linkData.last_click,
          clicks: clicks
        };
      }
      
      return {
        clickCount: 0,
        createdAt: null,
        lastClick: null,
        clicks: []
      };
    } catch (error) {
      console.error('Error getting link analytics:', error);
      return {
        clickCount: 0,
        createdAt: null,
        lastClick: null,
        clicks: []
      };
    }
  }

  // Get real-time user count
  static getActiveUsersCount(callback) {
    const usersRef = collection(db, 'users');
    const activeQuery = query(usersRef, where('is_active', '==', true));
    
    return onSnapshot(activeQuery, (snapshot) => {
      callback(snapshot.size);
    });
  }

  // Get trending links
  static async getTrendingLinks(limit = 10) {
    try {
      const linksRef = collection(db, 'links');
      const trendingQuery = query(
        linksRef,
        where('is_active', '==', true),
        orderBy('click_count', 'desc'),
        limit(limit)
      );
      
      const snapshot = await getDocs(trendingQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting trending links:', error);
      return [];
    }
  }

  // Get recent activity
  static async getRecentActivity(limit = 20) {
    try {
      const clicksRef = collection(db, 'clicks');
      const recentQuery = query(
        clicksRef,
        orderBy('timestamp', 'desc'),
        limit(limit)
      );
      
      const snapshot = await getDocs(recentQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }
}

export default AnalyticsService; 