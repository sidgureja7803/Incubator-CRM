import axios from 'axios';
import config from '../config';

let refreshPromise = null;

export const refreshTokens = async () => {
  try {
    // If there's already a refresh in progress, return that promise
    if (refreshPromise) {
      return refreshPromise;
    }

    const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Create new promise for this refresh attempt
    refreshPromise = axios.post(
      `${config.api_base_url}/v1/auth/refresh/`,
      { refresh: refreshToken }
    );

    const response = await refreshPromise;
    
    if (response.status === 200 && response.data.access) {
      const { access } = response.data;
      
      // Store the new access token in the same storage as the refresh token
      if (localStorage.getItem('refresh_token')) {
        localStorage.setItem('access_token', access);
      }
      if (sessionStorage.getItem('refresh_token')) {
        sessionStorage.setItem('access_token', access);
      }
      
      return access;
    }
    
    throw new Error('Invalid refresh response');
  } catch (error) {
    // If refresh fails, clear tokens and user will need to login again
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    throw error;
  } finally {
    refreshPromise = null;
  }
};

// Create an axios instance with interceptors
export const authAxios = axios.create();

authAxios.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshTokens();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return authAxios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
); 