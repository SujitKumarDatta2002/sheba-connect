/**
 * config/axiosInstance.js
 *
 * A pre-configured axios instance that automatically attaches
 * the JWT from localStorage as a Bearer token on every request.
 *
 * Usage:
 *   import axiosAuth from '../config/axiosInstance';
 *   const res = await axiosAuth.get('/api/documents');
 */

import axios from 'axios';
import API from './api';

const axiosAuth = axios.create({
  baseURL: API,
});

// Attach token before every request
axiosAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// On 401, redirect to login and clear stale credentials
axiosAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosAuth;
