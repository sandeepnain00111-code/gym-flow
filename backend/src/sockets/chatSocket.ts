const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom');
const jwt = require('jsonwebtoken');
const Membership = require('../models/Membership');

// SECURITY: Middleware to authenticate Socket.IO connections
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'gymflow_access_secret_key_123456789!');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user || user.status !== 'active') {
      return next(new Error('Invalid or inactive user'));
    }

    // Attach user to socket for later use
    socket.user = user;
    next();
  } catch (error) {
    next(new Error(`Authentication failed: ${error.message}`));
  }
};

const initChatSocket = (io) => {
  // SECURITY: Apply authentication middleware to all socket connections
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id} (User: ${socket.user._id})`);

    // Join Gym room channel by Room ID
    socket.on('join_room', async ({ roomId }) => {
      try {
        if (!roomId) return;

        // SECURITY: Verify user has access to this room (belongs to gym)
        const room = await ChatRoom.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Verify user is part of this gym
        if (socket.user.gymId && socket.user.gymId.toString() !== room.gymId.toString() && socket.user.role !== 'super_admin') {
          socket.emit('error', { message: 'Access denied. You do not belong to this gym.' });
          return;
        }

        socket.join(roomId.toString());
        console.log(`User ${socket.user._id} joined room: ${roomId}`);
      } catch (error) {
        console.error('join_room error:', error.message);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Join Gym channel by Gym ID (Matches PWA Client BottomNav/Chat view)
    socket.on('join_gym', async ({ gymId }) => {
      try {
        if (!gymId) return;

        // SECURITY: Verify user belongs to this gym
        if (socket.user.gymId && socket.user.gymId.toString() !== gymId && socket.user.role !== 'super_admin') {
          socket.emit('error', { message: 'Access denied. You do not belong to this gym.' });
          return;
        }

        socket.join(gymId.toString());
        console.log(`User ${socket.user._id} joined gym channel: ${gymId}`);
      } catch (error) {
        console.error('join_gym error:', error.message);
        socket.emit('error', { message: 'Failed to join gym channel' });
      }
    });

    // Send a message real-time
    socket.on('send_message', async (data) => {
      try {
        // 1. If it's a pre-saved populated message from the REST API, broadcast it instantly
        if (data.roomId && data.senderId && data.message && data._id) {
          // SECURITY: Verify sender is the authenticated user
          if (data.senderId.toString() !== socket.user._id.toString()) {
            socket.emit('error', { message: 'Unauthorized: Cannot send messages as another user' });
            return;
          }

          const targetRoom = typeof data.roomId === 'object' ? data.roomId._id : data.roomId;
          
          // Broadcast to room channel
          io.to(targetRoom.toString()).emit('receive_message', data);
          
          // Also broadcast to gym channel
          const room = await ChatRoom.findById(targetRoom);
          if (room && room.gymId) {
            io.to(room.gymId.toString()).emit('receive_message', data);
          }
          return;
        }

        // 2. Fallback: Persist raw socket message to DB if not saved via REST
        const { roomId, message, media } = data;
        if (!message || !roomId) {
          socket.emit('error', { message: 'Message and room ID are required' });
          return;
        }

        // SECURITY: Verify user has access to this room
        const room = await ChatRoom.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        if (socket.user.gymId && socket.user.gymId.toString() !== room.gymId.toString() && socket.user.role !== 'super_admin') {
          socket.emit('error', { message: 'Access denied. You do not belong to this gym.' });
          return;
        }

        const chatMsg = await ChatMessage.create({
          roomId,
          senderId: socket.user._id,
          message,
          media: media || ''
        });

        // Populate sender info
        const populatedMsg = await ChatMessage.findById(chatMsg._id)
          .populate('senderId', 'name avatar role');

        // Broadcast to both channels
        io.to(roomId.toString()).emit('receive_message', populatedMsg);
        io.to(room.gymId.toString()).emit('receive_message', populatedMsg);
      } catch (error) {
        console.error('Socket send_message error:', error.message);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Broadcast typing indicators in real-time
    socket.on('user_typing', ({ gymId, userName, isTyping }) => {
      if (gymId) {
        // SECURITY: Verify user belongs to gym before broadcasting
        if (socket.user.gymId && socket.user.gymId.toString() === gymId.toString()) {
          socket.to(gymId.toString()).emit('user_typing_broadcast', { userName, isTyping });
        }
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket Disconnected: ${socket.id} (User: ${socket.user._id})`);
    });
  });
};

module.exports = initChatSocket;
