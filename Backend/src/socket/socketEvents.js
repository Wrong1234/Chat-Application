// ============================================
// FILE: src/socket/socketEvents.js
// ============================================

import { logger } from '../utils/logger.js';

// Track online users
const onlineUsers = new Map();

export const handleJoinUser = (io, socket, senderId) => {
  // Join personal room for user-specific notifications
  socket.join(`user:${senderId}`);
  
  // Mark user as online
  onlineUsers.set(senderId, socket.id);
  socket.userId = senderId; // Store userId on socket for disconnect handling
  
  // Broadcast to all users that this user is online
  io.emit('user-online', { userId: senderId });
  
  socket.emit("connected");
  logger.info(`👤 User ${senderId} joined personal room: user:${senderId}`);
};

export const handleJoinChat = (socket, data) => {
  const { senderId, receiverId } = data;
  
  if (!senderId || !receiverId) {
    logger.error("❌ Missing senderId or receiverId in join-chat");
    return;
  }
  
  // Create a consistent chat room ID (alphabetically sorted)
  const chatRoomId = [senderId, receiverId].sort().join('-');
  
  socket.join(`chat:${chatRoomId}`);
  // logger.info(`💬 User ${senderId} joined chat room: chat:${chatRoomId}`);
  
  // Notify the socket which room they joined and send receiver's online status
  const isReceiverOnline = onlineUsers.has(receiverId);
  socket.emit("joined-chat", { 
    chatRoomId: `chat:${chatRoomId}`,
    receiverOnline: isReceiverOnline
  });
};

export const handleSendMessage = (io, socket, data) => {
  try {
    const { receiverId, senderId, message } = data;

    if (!receiverId || !senderId || !message) {
      console.error("❌ Missing required fields:", { receiverId, senderId, hasMessage: !!message });
      socket.emit("error", { message: "Missing required fields" });
      return;
    }

    // Create consistent chat room ID (alphabetically sorted)
    const chatRoomId = [senderId, receiverId].sort().join('-');
    
    console.log(`📤 Emitting to chat room: chat:${chatRoomId}`);
    
    // Emit to the chat room (both users will receive it)
    io.to(`chat:${chatRoomId}`).emit('receive-message', message);
    
    logger.info(`✅ Message sent to chat room: chat:${chatRoomId}`);
  } catch (err) {
    console.error("⚠️ Error handling send-message:", err);
    socket.emit("error", { message: "Failed to send message" });
  }
};

export const handleTyping = (socket, data) => {
  try {
    const { senderId, receiverId } = data;
    
    if (!senderId || !receiverId) {
      return;
    }
    
    const chatRoomId = [senderId, receiverId].sort().join('-');
    
    socket.to(`chat:${chatRoomId}`).emit('user-typing', { userId: senderId });
  } catch (err) {
    console.error("⚠️ Error handling typing:", err);
  }
};

export const handleStopTyping = (socket, data) => {
  try {
    const { senderId, receiverId } = data;
    
    if (!senderId || !receiverId) {
      return;
    }
    
    const chatRoomId = [senderId, receiverId].sort().join('-');
    
    socket.to(`chat:${chatRoomId}`).emit('user-stop-typing', { userId: senderId });
    
  } catch (err) {
    console.error("⚠️ Error handling stop-typing:", err);
  }
};

export const handleLeaveChat = (socket, data) => {
  try {
    const { senderId, receiverId } = data;
    
    if (!senderId || !receiverId) {
      return;
    }
    
    const chatRoomId = [senderId, receiverId].sort().join('-');
    socket.leave(`chat:${chatRoomId}`);
    
    // logger.info(`👋 User ${senderId} left chat room: chat:${chatRoomId}`);
  } catch (err) {
    console.error("⚠️ Error handling leave-chat:", err);
  }
};

export const handleDisconnect = (io, socket) => {
  const userId = socket.userId;
  
  if (userId) {
    // Remove from online users
    onlineUsers.delete(userId);
    
    // Broadcast to all users that this user is offline
    io.emit('user-offline', { userId });
    
    logger.info(`🔴 User ${userId} disconnected and marked offline`);
  }
};

// Helper function to get all online users (optional, for initial load)
export const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};