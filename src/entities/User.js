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

  static async login() {
    try {
      // For now, redirect to a simple login form
      // In real app, this would open a login modal or redirect to login page
      const email = prompt('Enter your email:');
      const password = prompt('Enter your password:');
      
      if (!email || !password) return null;
      
      const response = await authAPI.login({ email, password });
      
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
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