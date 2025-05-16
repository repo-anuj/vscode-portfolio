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

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.error('Please check your MongoDB connection string and make sure your IP is whitelisted in MongoDB Atlas');
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
    // Get client IP address
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const existingLike = await Like.findOne({ ipAddress: ip });

    res.json({
      success: true,
      hasLiked: !!existingLike
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
    // Get client IP address
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Check if IP has already liked
    const existingLike = await Like.findOne({ ipAddress: ip });

    if (existingLike) {
      return res.status(400).json({
        success: false,
        message: 'You have already liked this portfolio'
      });
    }

    // Add new like
    await Like.create({ ipAddress: ip });

    // Get updated count
    const count = await Like.countDocuments();

    // Emit WebSocket event to all connected clients
    io.emit('like-update', { count });

    res.json({
      success: true,
      message: 'Like added successfully',
      count: count
    });
  } catch (error) {
    console.error('Error adding like:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add like'
    });
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send current likes count to newly connected client
  Like.countDocuments()
    .then(count => {
      socket.emit('initial-likes', { count });
    })
    .catch(err => {
      console.error('Error fetching initial likes count:', err);
    });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
