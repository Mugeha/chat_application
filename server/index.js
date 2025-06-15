import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import { Server } from 'socket.io';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';



dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);


app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);



// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // update later with frontend URL
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`🔌 New socket connected: ${socket.id}`);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('send_message', ({ to, from, message }) => {
    io.to(to).emit('receive_message', { from, message });
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
