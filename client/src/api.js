import axios from 'axios';

// API Base URL - Update this for deployment
<<<<<<< HEAD
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mini-linkedin-backend-7jhs.onrender.com';
=======
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5175/';
>>>>>>> a2eb312 (recent)

const API = axios.create({ baseURL: API_BASE_URL });

// Add authentication token to requests
API.interceptors.request.use(
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

// Handle response errors (like expired tokens)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// Posts
export const createPost = (data) => API.post('/posts', data);
export const fetchAllPosts = () => API.get('/posts');
export const fetchUserPosts = (userId) => API.get(`/posts/user/${userId}`);
export const likePost = (postId) => API.post(`/posts/${postId}/like`);
export const addCommentToPost = (postId, data) => API.post(`/posts/${postId}/comment`, data);

// User
export const fetchUser = (userId) => API.get(`/auth/user/${userId}`);
export const getCurrentUser = () => API.get('/auth/me');
export const fetchAllUsers = (page = 1, limit = 20) => API.get(`/auth/users?page=${page}&limit=${limit}`);
export const fetchUserProfile = (userId) => API.get(`/auth/user/${userId}/profile`);
export const likeUserProfile = (userId) => API.post(`/auth/user/${userId}/like`);
export const commentOnUserProfile = (userId, data) => API.post(`/auth/user/${userId}/comment`, data);
export const updateUserProfile = (data) => API.put('/auth/profile', data);
