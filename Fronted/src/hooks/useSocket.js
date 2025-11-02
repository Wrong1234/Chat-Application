// hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { setSocket, clearSocket, setSocketError } from '../store/slices/socketSlice';
import { setUserTyping } from '../store/slices/chatSlice';
import { messageApi } from '../store/api/messageApi';
import { selectCurrentUser } from '../store/slices/authSlice';

const ENDPOINT = 'http://localhost:4000';

export const useSocket = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return;

    // Initialize socket
    socketRef.current = io(ENDPOINT, {
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    // Join with user ID
    socket.emit('join', user._id);

    // Connection handlers
    socket.on('connected', () => {
      console.log('✅ Socket connected');
      dispatch(setSocket(socket));
    });

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
      dispatch(setSocketError(error.message));
    });

    // Message handlers
    socket.on('receive-message', (newMessage) => {
      console.log('📩 Received message:', newMessage);
      
      // Update cache with new message
      dispatch(
        messageApi.util.updateQueryData(
          'getMessages',
          newMessage.senderId._id || newMessage.senderId,
          (draft) => {
            const exists = draft.some(m => m._id === newMessage._id);
            if (!exists) {
              draft.push(newMessage);
            }
          }
        )
      );

      // Clear typing indicator
      dispatch(setUserTyping({
        userId: newMessage.senderId._id || newMessage.senderId,
        isTyping: false,
      }));
    });

    // Typing indicators
    socket.on('user-typing', (data) => {
      console.log('✍️ User typing:', data.userId);
      dispatch(setUserTyping({ userId: data.userId, isTyping: true }));
    });

    socket.on('user-stop-typing', (data) => {
      console.log('🛑 User stopped typing:', data.userId);
      dispatch(setUserTyping({ userId: data.userId, isTyping: false }));
    });

    socket.on('joined-chat', (data) => {
      console.log('✅ Joined chat:', data.chatRoomId);
    });

    // Cleanup
    return () => {
      console.log('🔌 Disconnecting socket');
      socket.off('connected');
      socket.off('receive-message');
      socket.off('user-typing');
      socket.off('user-stop-typing');
      socket.off('joined-chat');
      socket.off('error');
      socket.disconnect();
      dispatch(clearSocket());
    };
  }, [user?._id, dispatch]);

  return socketRef.current;
};

// Socket event emitters
export const useSocketEmit = () => {
  const socket = useSelector((state) => state.socket.instance);

  return {
    joinChat: (senderId, receiverId) => {
      socket?.emit('join-chat', { senderId, receiverId });
    },
    leaveChat: (senderId, receiverId) => {
      socket?.emit('leave-chat', { senderId, receiverId });
    },
    sendMessage: (data) => {
      socket?.emit('send-message', data);
    },
    typing: (senderId, receiverId) => {
      socket?.emit('typing', { senderId, receiverId });
    },
    stopTyping: (senderId, receiverId) => {
      socket?.emit('stop-typing', { senderId, receiverId });
    },
  };
};