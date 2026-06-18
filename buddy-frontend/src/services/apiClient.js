/**
 * API Service Layer
 * Handles all HTTP requests to the backend
 * Provides consistent error handling and response formatting
 */

const getDefaultApiUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:8000/api';
  }

  return 'https://buddy-script-api.onrender.com/api';
};

const API_BASE_URL = (process.env.REACT_APP_API_URL || getDefaultApiUrl()).replace(/\/+$/, '');

class APIClient {
  /**
   * Make a request to the API
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new APIError(
          data.message || 'An error occurred',
          response.status,
          data.error
        );
      }

      return data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Network error', 0, error.message);
    }
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
}

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
  }

  isNetworkError() {
    return this.status === 0;
  }

  isUnauthorized() {
    return this.status === 401;
  }

  isForbidden() {
    return this.status === 403;
  }

  isNotFound() {
    return this.status === 404;
  }

  isServerError() {
    return this.status >= 500;
  }
}

// Create singleton instance
const apiClient = new APIClient();

/**
 * Authentication API endpoints
 */
export const authAPI = {
  register: (email, username, password, passwordConfirm) =>
    apiClient.post('/auth/register/', {
      email,
      username,
      password,
      password_confirm: passwordConfirm,
    }),

  login: (email, password) =>
    apiClient.post('/auth/login/', { email, password }),

  logout: () =>
    apiClient.post('/auth/logout/', {}),

  getProfile: () =>
    apiClient.get('/users/profile/'),
};

/**
 * User API endpoints
 */
export const userAPI = {
  getAll: (page = 1) =>
    apiClient.get(`/users/?page=${page}`),

  getById: (id) =>
    apiClient.get(`/users/${id}/`),

  search: (query, limit = 10) =>
    apiClient.get(`/users/search/?q=${encodeURIComponent(query)}&limit=${limit}`),

  update: (id, data) =>
    apiClient.patch(`/users/${id}/`, data),
};

/**
 * Feed API endpoints
 */
export const feedAPI = {
  getPosts: (page = 1, authorId = null) => {
    let endpoint = `/feed/posts/?page=${page}`;
    if (authorId) endpoint += `&author=${authorId}`;
    return apiClient.get(endpoint);
  },

  getPostDetail: (id) =>
    apiClient.get(`/feed/posts/${id}/`),

  createPost: (content, image = null) =>
    apiClient.post('/feed/posts/', { content, image }),

  updatePost: (id, content) =>
    apiClient.patch(`/feed/posts/${id}/`, { content }),

  deletePost: (id) =>
    apiClient.delete(`/feed/posts/${id}/`),

  likePost: (id) =>
    apiClient.post(`/feed/posts/${id}/like/`, {}),

  unlikePost: (id) =>
    apiClient.post(`/feed/posts/${id}/unlike/`, {}),
};

/**
 * Comments API endpoints
 */
export const commentsAPI = {
  getComments: (postId) =>
    apiClient.get(`/feed/comments/?post=${postId}`),

  createComment: (postId, content) =>
    apiClient.post('/feed/comments/', { post: postId, content }),

  deleteComment: (id) =>
    apiClient.delete(`/feed/comments/${id}/`),
};

/**
 * Friends API endpoints
 */
export const friendsAPI = {
  getList: () =>
    apiClient.get('/friends/list/'),

  getRequests: () =>
    apiClient.get('/friends/requests/'),

  sendRequest: (receiverId) =>
    apiClient.post('/friends/request/', { receiver_id: receiverId }),

  acceptRequest: (requestId) =>
    apiClient.post(`/friends/requests/${requestId}/accept/`, {}),

  rejectRequest: (requestId) =>
    apiClient.post(`/friends/requests/${requestId}/reject/`, {}),

  removeFriend: (friendId) =>
    apiClient.post(`/friends/${friendId}/remove/`, {}),
};

export default apiClient;
