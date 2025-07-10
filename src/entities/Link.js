import { db } from '../firebase.js';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  increment
} from 'firebase/firestore';

class Link {
  constructor(data = {}) {
    this.id = data.id || null;
    this.original_url = data.original_url || '';
    this.short_code = data.short_code || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.user_id = data.user_id || '';
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.expires_at = data.expires_at ? new Date(data.expires_at) : null;
    this.click_count = data.click_count || 0;
    this.created_at = data.created_at ? new Date(data.created_at) : new Date();
    this.updated_at = data.updated_at ? new Date(data.updated_at) : new Date();
    this.utm_source = data.utm_source || '';
    this.utm_medium = data.utm_medium || '';
    this.utm_campaign = data.utm_campaign || '';
    this.utm_term = data.utm_term || '';
    this.utm_content = data.utm_content || '';
  }

  // Generate a unique short code
  static generateShortCode() {
    // Use a mix of letters and numbers for better readability
    const vowels = 'aeiou';
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const numbers = '0123456789';
    
    // Generate a 4-5 character code that's more memorable
    let result = '';
    
    // First character: consonant
    result += consonants.charAt(Math.floor(Math.random() * consonants.length));
    
    // Second character: vowel
    result += vowels.charAt(Math.floor(Math.random() * vowels.length));
    
    // Third character: consonant or number
    const thirdChar = Math.random() > 0.5 ? consonants : numbers;
    result += thirdChar.charAt(Math.floor(Math.random() * thirdChar.length));
    
    // Fourth character: vowel or number
    const fourthChar = Math.random() > 0.5 ? vowels : numbers;
    result += fourthChar.charAt(Math.floor(Math.random() * fourthChar.length));
    
    // Optional fifth character for variety
    if (Math.random() > 0.3) {
      const fifthChar = consonants + numbers;
      result += fifthChar.charAt(Math.floor(Math.random() * fifthChar.length));
    }
    
    return result.toLowerCase();
  }

  // Generate a unique short code with collision detection
  static async generateUniqueShortCode() {
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      const shortCode = this.generateShortCode();
      
      // Check if this code already exists
      const existingLink = await this.getByShortCode(shortCode);
      if (!existingLink) {
        return shortCode;
      }
      
      attempts++;
    }
    
    // If we can't find a unique code, fall back to timestamp-based
    return Date.now().toString(36).substring(2, 6);
  }

  // Get link by short code with caching
  static async getByShortCode(shortCode) {
    try {
      // Check cache first
      const cacheKey = `link_${shortCode}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        return new Link(JSON.parse(cached));
      }

      const linksRef = collection(db, 'links');
      const q = query(linksRef, where('short_code', '==', shortCode), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }

      const doc = querySnapshot.docs[0];
      const linkData = { id: doc.id, ...doc.data() };
      
      // Cache the result
      sessionStorage.setItem(cacheKey, JSON.stringify(linkData));
      
      return new Link(linkData);
    } catch (error) {
      console.error('Error getting link by short code:', error);
      throw error;
    }
  }

  // Get links by user ID
  static async getByUserId(userId) {
    try {
      const linksRef = collection(db, 'links');
      const q = query(
        linksRef, 
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = { id: doc.id, ...doc.data() };
        return new Link(data);
      });
    } catch (error) {
      console.error('Error getting links by user ID:', error);
      throw error;
    }
  }

  // Get all links (for analytics)
  static async list() {
    try {
      const linksRef = collection(db, 'links');
      const q = query(linksRef, orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = { id: doc.id, ...doc.data() };
        return new Link(data);
      });
    } catch (error) {
      console.error('Error getting all links:', error);
      throw error;
    }
  }

  // Create new link
  static async create(linkData) {
    try {
      const link = new Link(linkData);
      return await link.save();
    } catch (error) {
      console.error('Error creating link:', error);
      throw error;
    }
  }

  // Save link to Firestore
  async save() {
    try {
      // Auto-generate short code if not provided
      if (!this.short_code) {
        this.short_code = await Link.generateUniqueShortCode();
      }

      const linkData = {
        original_url: this.original_url,
        short_code: this.short_code,
        title: this.title,
        description: this.description,
        user_id: this.user_id,
        is_active: this.is_active,
        expires_at: this.expires_at,
        click_count: this.click_count,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        utm_source: this.utm_source,
        utm_medium: this.utm_medium,
        utm_campaign: this.utm_campaign,
        utm_term: this.utm_term,
        utm_content: this.utm_content
      };

      if (this.id) {
        // Update existing link
        const linkRef = doc(db, 'links', this.id);
        await updateDoc(linkRef, {
          ...linkData,
          updated_at: serverTimestamp()
        });
        
        // Clear cache
        sessionStorage.removeItem(`link_${this.short_code}`);
      } else {
        // Create new link
        const linksRef = collection(db, 'links');
        const docRef = await addDoc(linksRef, linkData);
        this.id = docRef.id;
        
        // Clear cache
        sessionStorage.removeItem(`link_${this.short_code}`);
      }

      return this;
    } catch (error) {
      console.error('Error saving link:', error);
      throw error;
    }
  }

  // Delete link
  async delete() {
    try {
      if (this.id) {
        const linkRef = doc(db, 'links', this.id);
        await deleteDoc(linkRef);
        
        // Clear cache
        sessionStorage.removeItem(`link_${this.short_code}`);
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      throw error;
    }
  }

  // Static method to delete link by ID
  static async deleteById(linkId) {
    try {
      const linkRef = doc(db, 'links', linkId);
      await deleteDoc(linkRef);
      
      // Clear all related caches
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('link_') || key.startsWith('redirect_')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error deleting link by ID:', error);
      throw error;
    }
  }

  // Increment click count (optimized for speed)
  static async incrementClickCount(linkId) {
    try {
      const linkRef = doc(db, 'links', linkId);
      await updateDoc(linkRef, {
        click_count: increment(1),
        updated_at: serverTimestamp()
      });
    } catch (error) {
      console.error('Error incrementing click count:', error);
      // Don't throw error to avoid blocking redirect
    }
  }

  // Create redirect entry
  static async createRedirectEntry(linkId, shortCode) {
    try {
      const redirectsRef = collection(db, 'redirects');
      await addDoc(redirectsRef, {
        link_id: linkId,
        short_code: shortCode,
        timestamp: serverTimestamp(),
        user_agent: navigator.userAgent,
        referrer: document.referrer || '',
        ip_address: 'unknown' // Would need server-side implementation for real IP
      });
    } catch (error) {
      console.error('Error creating redirect entry:', error);
      // Don't throw error to avoid blocking redirect
    }
  }

  // Get analytics data
  static async getAnalytics(userId) {
    try {
      const linksRef = collection(db, 'links');
      const q = query(
        linksRef, 
        where('user_id', '==', userId),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const links = querySnapshot.docs.map(doc => {
        const data = { id: doc.id, ...doc.data() };
        return new Link(data);
      });

      const totalClicks = links.reduce((sum, link) => sum + (link.click_count || 0), 0);
      const activeLinks = links.filter(link => link.is_active).length;
      const expiredLinks = links.filter(link => 
        link.expires_at && new Date() > link.expires_at
      ).length;

      return {
        totalLinks: links.length,
        totalClicks,
        activeLinks,
        expiredLinks,
        links
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }

  // Validate URL
  static isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Build URL with UTM parameters
  buildUrlWithUTM() {
    if (!this.original_url) return this.original_url;
    
    const url = new URL(this.original_url);
    if (this.utm_source) url.searchParams.set('utm_source', this.utm_source);
    if (this.utm_medium) url.searchParams.set('utm_medium', this.utm_medium);
    if (this.utm_campaign) url.searchParams.set('utm_campaign', this.utm_campaign);
    if (this.utm_term) url.searchParams.set('utm_term', this.utm_term);
    if (this.utm_content) url.searchParams.set('utm_content', this.utm_content);
    
    return url.toString();
  }

  // Get short URL
  getShortUrl() {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${this.short_code}`;
  }

  // Check if link is expired
  isExpired() {
    return this.expires_at && new Date() > this.expires_at;
  }

  // Get formatted creation date
  getFormattedCreatedAt() {
    return this.created_at.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Get formatted expiry date
  getFormattedExpiresAt() {
    if (!this.expires_at) return 'Never';
    return this.expires_at.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export default Link; 