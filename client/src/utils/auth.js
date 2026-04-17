// Authentication utility functions

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

export const isUser = () => {
  const user = getCurrentUser();
  return user && user.role === 'user';
};

export const logout = () => {
  // Clear all auth-related data
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  
  // Redirect to login page
  window.location.href = '/login';
  
  // Optional: Force a full page reload to reset the application state
  window.location.reload();
};

export const requireAuth = (navigate) => {
  if (!isAuthenticated()) {
    navigate('/login');
    return false;
  }
  return true;
};

export const requireAdmin = (navigate) => {
  if (!isAuthenticated()) {
    navigate('/login');
    return false;
  }
  if (!isAdmin()) {
    navigate('/dashboard');
    return false;
  }
  return true;
};

export const requireUser = (navigate) => {
  if (!isAuthenticated()) {
    navigate('/login');
    return false;
  }
  if (!isUser()) {
    navigate('/admin');
    return false;
  }
  return true;
};
