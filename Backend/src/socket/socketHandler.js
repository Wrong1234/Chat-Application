// ============================================
// FILE: src/socket/socketHandler.js - FIXED VERSION
// ============================================

import { logger } from '../utils/logger.js';
import {
  handleJoinUser,
  handleJoinChat,
  handleSendMessage,
  handleTyping,
  handleStopTyping,
  handleLeaveChat,
} from './socketEvents.js';

export const socketHandler = (io, socket) => {
  logger.info(`🟢 New socket connection: ${socket.id}`);
  
  socket.on('join', (senderId) => {
    if (senderId) {
      handleJoinUser(socket, senderId);
    } else {
      logger.error("❌ Join event received without senderId");
    }
  });

  socket.on('join-chat', (data) => {
    handleJoinChat(socket, data);
  });

  socket.on('leave-chat', (data) => {
    handleLeaveChat(socket, data);
  });

  socket.on('send-message', (data) => {
    handleSendMessage(io, socket, data);
  });

  socket.on('typing', (data) => {
    handleTyping(socket, data);
  });
  
  socket.on('stop-typing', (data) => {
    handleStopTyping(socket, data);
  });

  socket.on('disconnect', () => {
    logger.info(`🔴 User disconnected: ${socket.id}`);
  });

  socket.on('error', (error) => {
    logger.error('❌ Socket error:', error);
  });
};
