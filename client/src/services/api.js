// Create src/services/api.js: This file will 
// create an axios instance that automatically adds your auth token to every request.
import axios from 'axios';

// Ensure this points to your backend (include /api if your backend routes are /api/...)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

console.log('API Base URL:', API_BASE);

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
}, (err) => Promise.reject(err));

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('API Error:', err.response?.status, err.response?.data);
    return Promise.reject(err);
  }
);

export default api


