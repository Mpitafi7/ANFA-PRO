import axios from 'axios';

// Use environment variable for API base URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};

// Public Profile API functions
export const publicProfileAPI = {
  // Get public profile by publicId
  getPublicProfile: async (publicId) => {
    const response = await api.get(`/users/${publicId}/public`);
    return response.data;
  },

  // Update public profile (admin only)
  updatePublicProfile: async (publicId, profileData) => {
    const response = await api.put(`/users/${publicId}/public`, profileData);
    return response.data;
  },

  // Ban/hide profile (admin only)
  banProfile: async (publicId, reason) => {
    const response = await api.post(`/users/${publicId}/ban`, { reason });
    return response.data;
  },

  // Unban profile (admin only)
  unbanProfile: async (publicId) => {
    const response = await api.post(`/users/${publicId}/unban`);
    return response.data;
  },
};

// URLs API functions
export const urlsAPI = {
  // Create short URL
  createUrl: async (urlData) => {
    const response = await api.post('/urls', urlData);
    return response.data;
  },

  // Get user URLs
  getUserUrls: async (params = {}) => {
    const response = await api.get('/urls', { params });
    return response.data;
  },

  // Get URL analytics
  getUrlAnalytics: async (urlId) => {
    const response = await api.get(`/urls/${urlId}/analytics`);
    return response.data;
  },

  // Update URL
  updateUrl: async (urlId, urlData) => {
    const response = await api.put(`/urls/${urlId}`, urlData);
    return response.data;
  },

  // Delete URL
  deleteUrl: async (urlId) => {
    const response = await api.delete(`/urls/${urlId}`);
    return response.data;
  },

  // Get URL by short code
  getUrlByCode: async (shortCode) => {
    const response = await api.get(`/urls/redirect/${shortCode}`);
    return response.data;
  },
};

// Analytics API functions
export const analyticsAPI = {
  // Get user analytics
  getUserAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/user', { params });
    return response.data;
  },

  // Get global analytics (admin only)
  getGlobalAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/global', { params });
    return response.data;
  },

  // Get link analytics
  getLinkAnalytics: async (linkId, params = {}) => {
    const response = await api.get(`/analytics/links/${linkId}`, { params });
    return response.data;
  },
};

// Users API functions
export const usersAPI = {
  // Get user profile
  getUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user plan
  updateUserPlan: async (planData) => {
    const response = await api.put('/users/plan', planData);
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    const response = await api.delete('/users/profile');
    return response.data;
  },

  // Get all users (admin only)
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Update user (admin only)
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

// Blog API functions
export const blogAPI = {
  // Get all published blog posts
  getPosts: async (params = {}) => {
    const response = await api.get('/blog', { params });
    return response.data;
  },

  // Get single blog post
  getPost: async (slug) => {
    const response = await api.get(`/blog/${slug}`);
    return response.data;
  },

  // Create blog post (Admin only)
  createPost: async (postData) => {
    const response = await api.post('/blog', postData);
    return response.data;
  },

  // Update blog post (Admin only)
  updatePost: async (id, postData) => {
    const response = await api.put(`/blog/${id}`, postData);
    return response.data;
  },

  // Delete blog post (Admin only)
  deletePost: async (id) => {
    const response = await api.delete(`/blog/${id}`);
    return response.data;
  },

  // Add comment to blog post
  addComment: async (postId, commentData) => {
    const response = await api.post(`/blog/${postId}/comments`, commentData);
    return response.data;
  },

  // Approve comment (Admin only)
  approveComment: async (commentId) => {
    const response = await api.put(`/blog/comments/${commentId}/approve`);
    return response.data;
  }
};

// Health check API
export const healthAPI = {
  // Get API health status
  getHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api; 