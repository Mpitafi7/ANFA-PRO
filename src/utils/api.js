import axios from 'axios';

// Use environment variable for API base URL, fallback to Vercel deployment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://anfa-pd0kyf1t4-mpitafi7s-projects.vercel.app';

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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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

// URL API functions
export const urlAPI = {
  // Create short URL
  createUrl: async (urlData) => {
    const response = await api.post('/urls', urlData);
    return response.data;
  },

  // Get user's URLs
  getUrls: async (params = {}) => {
    const response = await api.get('/urls', { params });
    return response.data;
  },

  // Get URL analytics
  getAnalytics: async (urlId, period = '7d') => {
    const response = await api.get(`/urls/${urlId}/analytics`, {
      params: { period }
    });
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
};

// User API functions
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user plan
  updatePlan: async (plan) => {
    const response = await api.put('/users/plan', { plan });
    return response.data;
  },

  // Delete account
  deleteAccount: async () => {
    const response = await api.delete('/users/profile');
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
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

export default api; 