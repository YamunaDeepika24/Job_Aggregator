// src/api.js
import axios from "axios";

export const API_BASE = "http://localhost:8000";

// --------------------------------------------
// Create axios instance with auth token support
// --------------------------------------------
export const authFetch = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token automatically
authFetch.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --------------------------------------------
// AUTH FUNCTIONS
// --------------------------------------------

// Register new user
export const register = async (email, password) => {
  const response = await axios.post(`${API_BASE}/api/auth/register`, {
    email,
    password,
  });
  return response.data;
};

// Login user & receive token
export const login = async (email, password) => {
  const response = await axios.post(`${API_BASE}/api/auth/login`, {
    email,
    password,
  });
  return response.data;
};
