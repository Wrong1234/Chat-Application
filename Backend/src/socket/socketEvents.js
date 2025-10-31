// ============================================
// FILE: src/socket/socketEvents.js
// ============================================

import { logger } from '../utils/logger.js';

export const handleJoinUser = (socket, userId) => {
  socket.join(userId);
  // console.log(userId);
  socket.emit("connected");
  // logger.info(`👤 User ${userId} joined their room`);
};

export const handleJoinChat = (socket, chatId) => {
  socket.join(chatId);
  console.log("join chat room", chatId);
  // logger.info(`💬 User ${socket.id} joined chat: ${chatId}`);
};

export const handleSendMessage = (socket, message) => {
  try {
    const { chatId, senderId, message } = message;

    if (!chatId || !senderId || !message) {
      console.error("❌ Missing required message fields:", message);
      return;
    }

    // ✅ Emit to all users in the chat room (including sender)
    socket.to(chatId).emit('receive-message', message);

    console.log(`📩 Message sent to room ${chatId} from ${senderId}`);
  } catch (err) {
    console.error("⚠️ Error handling send-message:", err);
  }
};

export const handleTyping = (socket, data) => {
  socket.to(data.chatId).emit('user-typing', data);
};

export const handleStopTyping = (socket, data) => {
  socket.to(data.chatId).emit('user-stop-typing', data);
};
