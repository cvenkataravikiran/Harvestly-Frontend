import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Check if user is already authenticated on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Token exists but no user data, try to get profile
            const response = await authService.getProfile();
            if (response.success) {
              setUser(response.data.user);
            } else {
              // Invalid token, clear storage
              authService.logout();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      
      if (response.success) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      } else {
        setError(response.error || 'Login failed');
        return { success: false, error: response.error };
      }
    } catch (error) {
      // Use the improved error message from API interceptor
      const errorMessage = error.userMessage || error.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      
      if (response.success) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      } else {
        setError(response.error || 'Registration failed');
        return { success: false, error: response.error };
      }
    } catch (error) {
      // Use the improved error message from API interceptor
      const errorMessage = error.userMessage || error.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.updateProfile(profileData);
      
      if (response.success) {
        setUser(response.data.user);
        return { success: true, user: response.data.user };
      } else {
        setError(response.error || 'Profile update failed');
        return { success: false, error: response.error };
      }
    } catch (error) {
      // Handle validation errors from backend
      let errorMessage = 'Profile update failed';
      if (error.response?.data) {
        const { data } = error.response;
        if (data.errors && Array.isArray(data.errors)) {
          // Validation errors from express-validator
          errorMessage = data.errors.map(err => err.message).join(', ');
        } else if (data.message) {
          // General error message
          errorMessage = data.message;
        } else if (data.error) {
          // Legacy error format
          errorMessage = data.error;
        }
      } else {
        errorMessage = error.message || 'Profile update failed';
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.changePassword(passwordData);
      
      if (response.success) {
        return { success: true };
      } else {
        setError(response.error || 'Password change failed');
        return { success: false, error: response.error };
      }
    } catch (error) {
      // Handle validation errors from backend
      let errorMessage = 'Password change failed';
      if (error.response?.data) {
        const { data } = error.response;
        if (data.errors && Array.isArray(data.errors)) {
          // Validation errors from express-validator
          errorMessage = data.errors.map(err => err.message).join(', ');
        } else if (data.message) {
          // General error message
          errorMessage = data.message;
        } else if (data.error) {
          // Legacy error format
          errorMessage = data.error;
        }
      } else {
        errorMessage = error.message || 'Password change failed';
      }
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setUser(response.data.user);
        return response.data.user;
      }
    } catch (error) {
      console.error('Profile refresh error:', error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    showProfileModal,
    setShowProfileModal,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshProfile,
    clearError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isFarmer: user?.role === 'farmer',
    isBuyer: user?.role === 'buyer',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 