import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          // Bad request - handle validation errors
          if (data.errors && Array.isArray(data.errors)) {
            // Validation errors from express-validator
            const errorMessages = data.errors.map(err => err.message).join(', ');
            console.error('Validation errors:', errorMessages);
            // Create a more user-friendly error
            error.userMessage = errorMessages;
          } else if (data.message) {
            // General error message
            console.error('Bad request:', data.message);
            error.userMessage = data.message;
          } else if (data.error) {
            // Legacy error format
            console.error('Bad request:', data.error);
            error.userMessage = data.error;
          } else {
            console.error('Bad request:', data);
            error.userMessage = 'Invalid request data';
          }
          break;
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/auth/signin';
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access denied:', data.message || data.error);
          error.userMessage = data.message || data.error || 'Access denied';
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data.message || data.error);
          error.userMessage = data.message || data.error || 'Resource not found';
          break;
        case 422:
          // Validation error
          console.error('Validation error:', data.message || data.error);
          error.userMessage = data.message || data.error || 'Validation failed';
          break;
        case 500:
          // Server error
          console.error('Server error:', data.message || data.error);
          error.userMessage = data.message || data.error || 'Internal server error';
          break;
        default:
          console.error('API error:', data.message || data.error || data);
          error.userMessage = data.message || data.error || 'An error occurred';
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      error.userMessage = 'Network error. Please check your connection.';
    } else {
      // Other error
      console.error('Error:', error.message);
      error.userMessage = error.message || 'An error occurred';
    }
    
    return Promise.reject(error);
  }
);

// API helper functions
export const apiHelper = {
  // GET request
  get: async (url, config = {}) => {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api; 