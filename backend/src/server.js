require('dotenv').config();
const validateEnv = require('./config/env');
validateEnv(); // crash early if required env vars are missing

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const initChatSocket = require('./sockets/chatSocket');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Mount Socket.io with suitable CORS rules
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize Socket.io chat handlers
initChatSocket(io);

// Start server
server.listen(PORT, () => {
  console.log(`GymFlow SaaS API Server running on port ${PORT}`);
});
