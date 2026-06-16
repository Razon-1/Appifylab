import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default api;

// Auth endpoints
export const authAPI = {
  login: (email, password) => api.post('/auth/login/', { email, password }),
  register: (email, firstName, lastName, password, password_confirm) => api.post('/auth/register/', { email, first_name: firstName, last_name: lastName, password, password_confirm }),
  logout: () => api.post('/auth/logout/'),
};

// Feed endpoints
export const feedAPI = {
  getPosts: () => api.get('/feed/posts/'),
  createPost: (formData) => api.post('/feed/posts/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  updatePost: (postId, formData) => api.patch(`/feed/posts/${postId}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deletePost: (postId) => api.delete(`/feed/posts/${postId}/`),
  likePost: (postId) => api.post(`/feed/posts/${postId}/like/`),
  getPostLikes: (postId) => api.get(`/feed/posts/${postId}/liked_by/`),
  getComments: (postId) => api.get(`/feed/comments/?post=${postId}`),
  createComment: (postId, content) => api.post('/feed/comments/', { post: postId, content }),
  createReply: (postId, parentCommentId, content) =>
    api.post('/feed/comments/', { post: postId, parent: parentCommentId, content }),
  likeComment: (commentId) => api.post(`/feed/comments/${commentId}/like/`),
  getCommentLikes: (commentId) => api.get(`/feed/comments/${commentId}/liked_by/`),
};

// User endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.put('/users/profile/', data),
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
