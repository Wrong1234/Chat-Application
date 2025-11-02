// store/slices/chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedChat: null,
  activeTab: 'all',
  searchQuery: '',
  isTyping: false,
  typingUsers: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    clearSelectedChat: (state) => {
      state.selectedChat = null;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setUserTyping: (state, action) => {
      const { userId, isTyping } = action.payload;
      state.typingUsers[userId] = isTyping;
    },
    clearTypingUsers: (state) => {
      state.typingUsers = {};
    },
  },
});

export const {
  setSelectedChat,
  clearSelectedChat,
  setActiveTab,
  setSearchQuery,
  setUserTyping,
  clearTypingUsers,
} = chatSlice.actions;

export default chatSlice.reducer;

// Selectors
export const selectSelectedChat = (state) => state.chat.selectedChat;
export const selectActiveTab = (state) => state.chat.activeTab;
export const selectSearchQuery = (state) => state.chat.searchQuery;
export const selectIsUserTyping = (userId) => (state) => 
  state.chat.typingUsers[userId] || false;

// ===================================

