import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')).access_token
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If we're in development mode and there's a connection error,
    // we don't want to show the connection error to the user
    if (process.env.NODE_ENV === 'development' && !error.response) {
      return Promise.resolve({ data: [] }); // Return empty data instead of error
    }

    if (error.response) {
      // Handle different error status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized - redirect to login
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // Handle forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Handle not found
          console.error('Resource not found');
          break;
        case 500:
          // Handle server error
          console.error('Server error');
          break;
        default:
          console.error('An error occurred');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api; 