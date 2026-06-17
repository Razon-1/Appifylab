/**
 * API CLIENT & ENDPOINTS
 * ======================
 * Central API configuration and endpoint definitions
 * 
 * FEATURES:
 * 1. Axios instance with base URL and interceptors
 * 2. Automatic token injection for authenticated requests
 * 3. Centralized API endpoints for all modules
 * 
 * MODULES:
 * - authAPI: User authentication endpoints
 * - feedAPI: Posts and comments endpoints
 * - userAPI: User profile and search endpoints
 */

import axios from 'axios';

// Use deployed Render backend for all environments
// Frontend deployed on Vercel connects to backend on Render
export const API_BASE_URL = 'https://buddy-script-api.onrender.com/api';

/**
 * Axios instance with default configuration
 * - Base URL pointing to Django backend
 * - Content-Type for JSON requests
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * - Automatically adds authentication token to all requests
 * - Token retrieved from localStorage after login
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;

/**
 * AUTHENTICATION ENDPOINTS
 * - login: User login (email + password)
 * - register: User registration (email + password)
 * - logout: User logout
 */
export const authAPI = {
  /**
   * User Login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Response with user data and token
   */
  login: (email, password) => api.post('/auth/login/', { email, password }),

  /**
   * User Registration
   * @param {string} email - User email
   * @param {string} firstName - User first name
   * @param {string} lastName - User last name
   * @param {string} password - User password
   * @param {string} password_confirm - Password confirmation
   * @returns {Promise} - Response with user data and token
   */
  register: (email, firstName, lastName, password, password_confirm) => 
    api.post('/auth/register/', { 
      email, 
      first_name: firstName, 
      last_name: lastName, 
      password, 
      password_confirm 
    }),

  /**
   * User Logout
   * @returns {Promise} - Logout confirmation
   */
  logout: () => api.post('/auth/logout/'),
};

/**
 * FEED ENDPOINTS
 * - Posts: Create, read, update, delete, like
 * - Comments: Create, read, like with nested replies
 */
export const feedAPI = {
  /**
   * Get all posts in user's feed
   * - Public posts + user's own posts
   * - Ordered by newest first
   */
  getPosts: () => api.get('/feed/posts/'),

  /**
   * Create new post
   * @param {FormData} formData - Contains content, image, privacy
   */
  createPost: (formData) => api.post('/feed/posts/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  /**
   * Update existing post
   * @param {number} postId - Post ID
   * @param {FormData} formData - Updated post data
   */
  updatePost: (postId, formData) => api.patch(`/feed/posts/${postId}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  /**
   * Delete post (author only)
   * @param {number} postId - Post ID
   */
  deletePost: (postId) => api.delete(`/feed/posts/${postId}/`),

  /**
   * Like or unlike a post
   * @param {number} postId - Post ID
   */
  likePost: (postId) => api.post(`/feed/posts/${postId}/like/`),

  /**
   * Get users who liked a post
   * @param {number} postId - Post ID
   */
  getPostLikes: (postId) => api.get(`/feed/posts/${postId}/liked_by/`),

  /**
   * Get all comments for a post
   * @param {number} postId - Post ID
   */
  getComments: (postId) => api.get(`/feed/comments/?post=${postId}`),

  /**
   * Create comment on a post
   * @param {number} postId - Post ID
   * @param {string} content - Comment text
   */
  createComment: (postId, content) => api.post('/feed/comments/', { post: postId, content }),

  /**
   * Create reply to a comment (nested)
   * @param {number} postId - Post ID
   * @param {number} parentCommentId - Parent comment ID
   * @param {string} content - Reply text
   */
  createReply: (postId, parentCommentId, content) =>
    api.post('/feed/comments/', { post: postId, parent: parentCommentId, content }),

  /**
   * Like or unlike a comment
   * @param {number} commentId - Comment ID
   */
  likeComment: (commentId) => api.post(`/feed/comments/${commentId}/like/`),

  /**
   * Get users who liked a comment
   * @param {number} commentId - Comment ID
   */
  getCommentLikes: (commentId) => api.get(`/feed/comments/${commentId}/liked_by/`),
};

/**
 * USER ENDPOINTS
 * - Profile: Get and update user profile
 * - Search: Search for users
 */
export const userAPI = {
  /**
   * Get current user's profile
   */
  getProfile: () => api.get('/users/profile/'),

  /**
   * Update current user's profile
   * @param {object} data - Profile data to update
   */
  updateProfile: (data) => api.put('/users/profile/', data),

  /**
   * Search for users by username or name
   * @param {string} query - Search query
   */
  searchUsers: (query) => api.get(`/users/search/?q=${query}`),
};

// Friends endpoints
export const friendsAPI = {
  getFriendRequests: () => api.get('/friends/requests/'),
  sendFriendRequest: (userId) => api.post(`/friends/requests/`, { receiver_id: userId }),
  acceptFriendRequest: (requestId) => api.post(`/friends/requests/${requestId}/accept/`),
  rejectFriendRequest: (requestId) => api.post(`/friends/requests/${requestId}/reject/`),
  getFriendsList: () => api.get('/friends/list/'),
};
