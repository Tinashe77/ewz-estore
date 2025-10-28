// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { login as loginService, getProfile } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          const response = await getProfile(storedToken);
          if (response.success) {
            setUser(response.data);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginService(credentials);

      console.log('Login response:', response); // Debug log

      if (response.success && response.token && response.user) {
        // Store token first
        localStorage.setItem('token', response.token);

        // Update state
        setToken(response.token);
        setUser(response.user);

        return {
          success: true,
          token: response.token,
          user: response.user
        };
      } else {
        // Clear any existing auth data on failed login
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);

        return {
          success: false,
          message: response.message || 'Login failed. Please check your credentials.'
        };
      }
    } catch (error) {
      console.error('Login error in AuthContext:', error);

      // Clear auth data on error
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);

      return {
        success: false,
        message: error.message || 'An unexpected error occurred. Please try again.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const response = await getProfile(token);
        if (response.success) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error refreshing user:', error);
      }
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    refreshUser,
    loading,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};