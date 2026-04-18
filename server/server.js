const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const petsRoutes = require('./routes/pets');
const adoptionRoutes = require('./routes/adoption');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://pet-adoption-warl.vercel.app',
      'https://pet-adoption-warl.vercel.app/',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires', 'Last-Modified', 'If-Modified-Since', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.use(cors(corsOptions));
//app.options('*', cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  if (req.headers.authorization) {
    console.log('Authorization header present:', req.headers.authorization.substring(0, 20) + '...');
  }
  next();
});

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    console.log('Connection URI (masked):', process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 'Not defined');
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Ready State: ${conn.connection.readyState}`);
    
    // Test the connection by counting documents
    const Pet = require('./models/Pet');
    const petCount = await Pet.countDocuments();
    console.log(`   Total pets in database: ${petCount}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // Provide helpful troubleshooting information
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('💡 Network issue: Check your internet connection and MongoDB Atlas network access settings');
    } else if (error.message.includes('authentication failed')) {
      console.error('💡 Authentication issue: Check your MongoDB Atlas username and password');
    } else if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.error('💡 SSL/TLS issue: This might be a network firewall or certificate issue');
    }
    
    console.log('🔄 Retrying connection in 10 seconds...');
    setTimeout(connectDB, 10000);
  }
};

// Initialize database connection
connectDB();
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Reconnecting...');
  connectDB();
});

// Log when database connection is established
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
  console.log('Available models:', Object.keys(mongoose.connection.models).join(', '));
});

// Log when the server starts listening
// Start the server
const startServer = () => {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('Allowed origins:', [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://pet-adoption-warl.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean).join(', '));
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    // Handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`Port ${PORT} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`Port ${PORT} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });
};

// Start the server after database connection is established
mongoose.connection.once('open', () => {
  console.log('✅ MongoDB connected successfully');
  console.log('Available models:', Object.keys(mongoose.connection.models).join(', '));
  startServer();
});

// Root route
//Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to PetAdopt API',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth: '/api/auth',
      pets: '/api/pets',
      adoptions: '/api/adoptions',
      admin: '/api/admin'
    },
    documentation: 'https://github.com/yourusername/pet-adoption#api-documentation'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: Object.values(err.errors).map(error => error.message).join(', ')
    });
  }

  // Handle mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `${field} already exists`
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!'
  });
});
