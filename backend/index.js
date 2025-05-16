require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

// Initialize Express app
const app = express();
const server = http.createServer(app);
// Get allowed origins from environment variable or use defaults
const allowedOrigins = process.env.WEBSOCKET_ORIGINS
  ? process.env.WEBSOCKET_ORIGINS.split(',')
  : (process.env.NODE_ENV === 'production'
    ? ['https://anujkidding-portfolio.vercel.app']
    : ['http://localhost:5173']);

console.log('WebSocket allowed origins:', allowedOrigins);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});
const PORT = process.env.PORT || 3001;

// Middleware with enhanced CORS configuration
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Add a simple health check endpoint for Render
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Add a debug endpoint to check IP address
app.get('/api/debug/ip', (req, res) => {
  // Get client IP address - handle x-forwarded-for properly
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  // If x-forwarded-for contains multiple IPs, take the first one (client's real IP)
  if (ip && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  // Return all headers for debugging
  res.json({
    ip: ip,
    headers: req.headers,
    rawIp: req.socket.remoteAddress,
    forwardedFor: req.headers['x-forwarded-for']
  });
});

// Add a debug endpoint to view all likes in the database
app.get('/api/debug/likes', async (_, res) => {
  try {
    // Get all likes from the database
    const allLikes = await Like.find({}).lean();

    // Count total likes
    const count = await Like.countDocuments();

    // Return the data
    res.json({
      success: true,
      count: count,
      likes: allLikes
    });
  } catch (error) {
    console.error('Error fetching all likes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch likes'
    });
  }
});

// Add a debug endpoint to clear all likes (for testing purposes)
// Only available in development mode
app.delete('/api/debug/likes', async (_, res) => {
  // Only allow this in development mode
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'This endpoint is only available in development mode'
    });
  }

  try {
    // Delete all likes from the database
    const result = await Like.deleteMany({});

    // Emit WebSocket event to all connected clients
    const newCount = await Like.countDocuments();
    io.emit('like-update', { count: newCount });

    // Return the result
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} likes`,
      count: newCount
    });
  } catch (error) {
    console.error('Error clearing likes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear likes'
    });
  }
});

// MongoDB connection with improved error handling and reconnection logic
console.log('Connecting to MongoDB...');
const connectWithRetry = () => {
  console.log('MongoDB connection attempt...');

  // Mask the connection string to avoid exposing credentials in logs
  const connectionString = process.env.MONGODB_URI || '';
  const maskedUri = connectionString.replace(
    /mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/,
    'mongodb$1://$2:****@'
  );
  console.log(`Using connection string: ${maskedUri}`);

  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch(err => {
    // Create a safe error message that doesn't expose the connection string
    const safeError = err.toString().replace(connectionString, maskedUri);
    console.error('MongoDB connection error:', safeError);
    console.error('Please check your MongoDB connection string and make sure your IP is whitelisted in MongoDB Atlas');
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  });
};

connectWithRetry();

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  setTimeout(connectWithRetry, 5000);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected, attempting to reconnect...');
  setTimeout(connectWithRetry, 5000);
});

// Define Like schema and model
const likeSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Like = mongoose.model('Like', likeSchema);

// Routes

// Get total likes count
app.get('/api/likes', async (_, res) => {
  try {
    const count = await Like.countDocuments();

    res.json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('Error fetching likes count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch likes count'
    });
  }
});

// Check if IP has already liked
app.get('/api/likes/check', async (req, res) => {
  try {
    // Get client IP address - handle x-forwarded-for properly
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // If x-forwarded-for contains multiple IPs, take the first one (client's real IP)
    if (ip && ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    console.log(`Checking like status for IP: ${ip}`);

    const existingLike = await Like.findOne({ ipAddress: ip });

    // Log the result for debugging
    console.log(`Like status for IP ${ip}: ${!!existingLike ? 'Has liked' : 'Has not liked'}`);

    // If we're in development mode, log all likes for debugging
    if (process.env.NODE_ENV !== 'production') {
      const allLikes = await Like.find({}).lean();
      console.log('All likes in database:', allLikes);
    }

    res.json({
      success: true,
      hasLiked: !!existingLike,
      ip: ip // Include the IP in the response for debugging
    });
  } catch (error) {
    console.error('Error checking if IP has liked:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check if IP has liked'
    });
  }
});

// Add a new like
app.post('/api/likes', async (req, res) => {
  try {
    // Get client IP address - handle x-forwarded-for properly
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // If x-forwarded-for contains multiple IPs, take the first one (client's real IP)
    if (ip && ip.includes(',')) {
      ip = ip.split(',')[0].trim();
    }

    console.log(`Adding like for IP: ${ip}`);

    // Check if IP has already liked
    const existingLike = await Like.findOne({ ipAddress: ip });

    // Log the result for debugging
    console.log(`Like check for IP ${ip}: ${existingLike ? 'Already liked' : 'Not liked yet'}`);

    if (existingLike) {
      console.log(`Rejected duplicate like from IP: ${ip}`);
      return res.status(400).json({
        success: false,
        message: 'You have already liked this portfolio',
        ip: ip // Include the IP in the response for debugging
      });
    }

    // Add new like
    const newLike = await Like.create({ ipAddress: ip });
    console.log(`Added new like for IP: ${ip}, document ID: ${newLike._id}`);

    // Get updated count
    const count = await Like.countDocuments();
    console.log(`New total like count: ${count}`);

    // Emit WebSocket event to all connected clients
    io.emit('like-update', { count });

    res.json({
      success: true,
      message: 'Like added successfully',
      count: count,
      ip: ip // Include the IP in the response for debugging
    });
  } catch (error) {
    console.error('Error adding like:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add like'
    });
  }
});

// WebSocket connection handling with improved error handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Log connection information
  const clientInfo = {
    id: socket.id,
    address: socket.handshake.address,
    time: new Date().toISOString(),
    userAgent: socket.handshake.headers['user-agent'] || 'Unknown'
  };
  console.log('Client connection details:', clientInfo);

  // Send current likes count to newly connected client
  Like.countDocuments()
    .then(count => {
      socket.emit('initial-likes', { count });
      console.log(`Sent initial likes count (${count}) to client ${socket.id}`);
    })
    .catch(err => {
      console.error('Error fetching initial likes count:', err);
      // Send a fallback value to prevent client from hanging
      socket.emit('initial-likes', { count: 0, error: true });
    });

  // Handle ping from client (for keeping connection alive)
  socket.on('ping', (callback) => {
    if (typeof callback === 'function') {
      callback({ status: 'ok', time: Date.now() });
    }
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`Client disconnected (${reason}):`, socket.id);
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error(`Socket error for client ${socket.id}:`, error);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
