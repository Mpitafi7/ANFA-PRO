import { authAPI } from '../utils/api.js';

class User {
  static async me() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const response = await authAPI.getCurrentUser();
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  static async login(credentials) {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
    return null;
  }

  static async register(userData) {
    try {
      const response = await authAPI.register(userData);
      
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async logout() {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  }

  static async updateMyUserData(data) {
    try {
      const response = await authAPI.updateProfile(data);
      if (response.success) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  static async list() {
    // This would be admin-only in real app
    return [];
  }
}

export { User }; 