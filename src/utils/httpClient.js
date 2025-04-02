// import axios from 'utils/httpClient';
// import config from 'config';

// // Helper function to get CSRF token from meta tags or cookies
// const getCSRFToken = () => {
//     const csrfMetaTag = document.querySelector('meta[name="csrf-token"]');
//     return csrfMetaTag ? csrfMetaTag.content : '';
// };

// // Axios Configuration
// // axios.defaults.baseURL = config.api_base_url; // Set your API base URL here
// axios.defaults.headers['Content-Type'] = 'application/json';
// axios.defaults.headers['X-CSRFToken'] = getCSRFToken();

// // Add request interceptor to dynamically add CSRF token for each request
// axios.interceptors.request.use((config) => {
//     config.headers['X-CSRFToken'] = getCSRFToken();
//     return config;
// });

// export default axios; // Export axios as the default

// // Override the global fetch function
// const originalFetch = window.fetch; // Keep a reference to the original fetch function

// window.fetch = async (url, options = {}) => {
//     const csrfToken = getCSRFToken();
//     const defaultHeaders = {
//         'Content-Type': 'application/json',
//         'X-CSRFToken': csrfToken,
//     };

//     // Merge default headers with any headers passed in options
//     const headers = {
//         ...defaultHeaders,
//         ...(options.headers || {}),
//     };

//     // Call the original fetch with updated headers
//     const response = await originalFetch(url, { ...options, headers });

//     // Check if the response is okay
//     if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     // Return the original response object
//     return response;
// };




// ====================================
import axios from 'axios';
import config from '../config';

// Helper function to get CSRF token from meta tags or cookies
const getCSRFToken = () => {
  const csrfMetaTag = document.querySelector('meta[name="csrf-token"]');
  return csrfMetaTag ? csrfMetaTag.content : '';
};

// Axios Configuration
axios.defaults.headers['Content-Type'] = 'application/json';
axios.defaults.headers['X-CSRFToken'] = getCSRFToken();

// Add request interceptor to dynamically add CSRF token for each request
axios.interceptors.request.use((config) => {
  const excludedEndpoints = ['v1/auth/login', '/v1/auth/refresh/']; // Add the endpoints you want to exclude

  if (!excludedEndpoints.some((endpoint) => config.url.includes(endpoint))) {
    // Add CSRF Token for non-excluded endpoints
    config.headers['X-CSRFToken'] = getCSRFToken();

    // Add Authorization header with the access token
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});


// Add response interceptor for handling token expiration and refreshing tokens
axios.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 (Unauthorized) and it's not a retried request
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried

      const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          // Attempt to refresh the access token
          const response = await axios.post(`${config.api_base_url}/v1/auth/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;

          // Store the new access token
          localStorage.setItem('access_token', access);
          sessionStorage.setItem('access_token', access);

          // Update the Authorization header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axios(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError.response?.data || refreshError.message);

          // Optional: Redirect to login or clear tokens
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('refresh_token');
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axios; // Export axios as the default

// Override the global fetch function
const originalFetch = window.fetch; // Keep a reference to the original fetch function

window.fetch = async (url, options = {}) => {
  const csrfToken = getCSRFToken();
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken,
  };

  // Merge default headers with any headers passed in options
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {}),
  };

  // Call the original fetch with updated headers
  const response = await originalFetch(url, { ...options, headers });

  // Check if the response is okay
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  // Return the original response object
  return response;
};
