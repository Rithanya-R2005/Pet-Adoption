import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  const isAdmin = () => {
    return isAuthenticated() && user.role === 'admin';
  };

  const isPetOwner = () => {
    return isAuthenticated() && user.role === 'petowner';
  };

  const isCustomer = () => {
    return isAuthenticated() && user.role === 'customer';
  };

  const value = {
    user,
    token: localStorage.getItem('token'),
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isPetOwner,
    isCustomer
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
