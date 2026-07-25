require('dotenv').config();
const validateEnv = require('./config/env');
validateEnv(); // crash early if required env vars are missing

const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const initChatSocket = require('./sockets/chatSocket');

const PORT = Number(process.env.PORT) || 5001;

// Connect to Database
connectDB();

const startServer = (port: number) => {
  // Create HTTP server
  const server = http.createServer(app);

  // Mount Socket.io with suitable CORS rules
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', process.env.CLIENT_URL].filter(Boolean) as string[],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Initialize Socket.io chat handlers
  initChatSocket(io);

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use. Trying ${nextPort}...`);
      startServer(nextPort);
      return;
    }

    console.error('Failed to start server:', error);
    process.exit(1);
  });

  // Start server
  server.listen(port, () => {
    console.log(`GymFlow SaaS API Server running on port ${port}`);
  });
};

startServer(PORT);
