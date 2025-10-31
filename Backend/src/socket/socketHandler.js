// ============================================
// FILE: src/socket/socketHandler.js
// ============================================

import { logger } from '../utils/logger.js';
import {
  handleJoinUser,
  handleJoinChat,
  handleSendMessage,
  handleTyping,
  handleStopTyping,
} from './socketEvents.js';

export const socketHandler = (io, socket) => {
  // User joins their personal room
  socket.on('join', (userId) => handleJoinUser(socket, userId));

  // User joins a chat room
  socket.on('join-chat', (chatId) => handleJoinChat(socket, chatId));

  // Handle new message
  socket.on('send-message', (message) => handleSendMessage(io, socket, message));

  // Typing indicators
  socket.on('typing', (data) => handleTyping(socket, data));
  socket.on('stop-typing', (data) => handleStopTyping(socket, data));

  // Handle disconnection
  socket.on('disconnect', () => {
    logger.info(`🔴 User disconnected: ${socket.id}`);
  });

  // Error handling
  socket.on('error', (error) => {
    logger.error('❌ Socket error:', error);
  });
};