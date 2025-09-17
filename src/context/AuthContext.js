import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';
import toast from 'react-hot-toast';
import { clearAuthData, getStoredUser, getStoredToken, setAuthData } from '../utils/localStorage';

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
  const [token, setToken] = useState(getStoredToken());

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = getStoredToken();
        const storedUser = getStoredUser();
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        } else {
          clearAuthData();
        }
      } catch (error) {
        console.error('Error in checkAuth:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      setAuthData(newToken, userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      const { token: newToken, user: newUser } = response.data;
      
      setToken(newToken);
      setUser(newUser);
      setAuthData(newToken, newUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message, errors: error.response?.data?.errors };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    clearAuthData();
    delete api.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    setAuthData(token, updatedUser);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAdmin,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
