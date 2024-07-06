import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { config } from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.route';
import postRoutes from './routes/post.route';
import userRoutes from './routes/user.route';
import { errorHandler } from './middlewares/errorhandlerMiddleware';

config();
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server function
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

// Start server
startServer();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Handle incoming 'message' events
  socket.on('message', (message) => {
    console.log(`Received message from client: ${message}`);
    io.emit('message', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Endpoint to check Socket.io server status
app.get('/checkSocketStatus', (req, res) => {
  const isConnected = !!io.engine.clientsCount;
  res.json({ status: 'Socket.io server status', connected: isConnected });
});

// Export app and io for use in other modules (if needed)
export { app, io };
