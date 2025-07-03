import { urlAPI } from '../utils/api.js';

class Link {
  static async create(linkData) {
    try {
      const response = await urlAPI.createUrl(linkData);
      return response.data;
    } catch (error) {
      console.error('Error creating link:', error);
      throw error;
    }
  }

  static async list() {
    try {
      const response = await urlAPI.getUrls();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching links:', error);
      return [];
    }
  }

  static async filter(query, sort = '-createdAt') {
    try {
      const response = await urlAPI.getUrls({ 
        search: query,
        sort: sort
      });
      return response.data || [];
    } catch (error) {
      console.error('Error filtering links:', error);
      return [];
    }
  }

  static async getById(id) {
    try {
      const response = await urlAPI.getUrl(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching link:', error);
      return null;
    }
  }

  static async update(id, data) {
    try {
      const response = await urlAPI.updateUrl(id, data);
      return response.data;
    } catch (error) {
      console.error('Error updating link:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      await urlAPI.deleteUrl(id);
      return true;
    } catch (error) {
      console.error('Error deleting link:', error);
      throw error;
    }
  }

  static async getAnalytics(id, period = '7d') {
    try {
      const response = await urlAPI.getAnalytics(id, period);
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  }
}

export { Link }; 