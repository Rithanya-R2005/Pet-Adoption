const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Admin authorization middleware
const adminAuth = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No authentication token provided.' 
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authorization' 
    });
  }
};

// Admin or Pet Owner authorization middleware
const adminOrOwnerAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No authentication token provided.' 
      });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'petowner') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin or Pet Owner privileges required.' 
      });
    }

    next();
  } catch (error) {
    console.error('Admin/Owner auth error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authorization' 
    });
  }
};

module.exports = { adminAuth, adminOrOwnerAuth };
