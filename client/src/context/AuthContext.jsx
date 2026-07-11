/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState } from 'react';
import api from '../services/api';
import { loginWithGoogle as googleLogin } from './auth-utils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const saveAuthData = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/signin', { email, password });
      const { token, user: userData } = response.data;
      saveAuthData(userData, token);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { token, user: userData } = response.data;
      saveAuthData(userData, token);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (googleToken) => {
    return googleLogin(googleToken, saveAuthData, setLoading);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
