import axios from "axios";

/**
 * Axios instance with base URL and auth interceptor.
 * All API calls go through this instance.
 */
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  timeout: 15000,
});

// Attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiry globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear storage and redirect
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Auth Endpoints ────────────────────────────────────────────────
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const fetchMe = () => API.get("/auth/me");

// ─── Post Endpoints ───────────────────────────────────────────────
export const fetchPosts = (page = 1, limit = 10) =>
  API.get(`/posts?page=${page}&limit=${limit}`);

export const createPost = (formData) =>
  API.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deletePost = (postId) => API.delete(`/posts/${postId}`);

export const toggleLike = (postId) => API.put(`/posts/${postId}/like`);

export const addComment = (postId, text) =>
  API.post(`/posts/${postId}/comment`, { text });

export const deleteComment = (postId, commentId) =>
  API.delete(`/posts/${postId}/comment/${commentId}`);

export default API;
