// ============================================
// FILE: src/socket/socketEvents.js
// ============================================

import { logger } from '../utils/logger.js';

export const handleJoinUser = (socket, userId) => {
  socket.join(userId);
  logger.info(`👤 User ${userId} joined their room`);
};

export const handleJoinChat = (socket, chatId) => {
  socket.join(chatId);
  logger.info(`💬 User ${socket.id} joined chat: ${chatId}`);
};

export const handleSendMessage = (socket, message) => {
  if (message.chatId) {
    socket.to(message.chatId).emit('receive-message', message);
  }
};

export const handleTyping = (socket, data) => {
  socket.to(data.chatId).emit('user-typing', data);
};

export const handleStopTyping = (socket, data) => {
  socket.to(data.chatId).emit('user-stop-typing', data);
};
