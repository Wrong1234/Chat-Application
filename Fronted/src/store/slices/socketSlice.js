// ===================================

// store/slices/socketSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  instance: null,
  connected: false,
  error: null,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.instance = action.payload;
      state.connected = true;
      state.error = null;
    },
    clearSocket: (state) => {
      state.instance = null;
      state.connected = false;
    },
    setSocketError: (state, action) => {
      state.error = action.payload;
      state.connected = false;
    },
  },
});

export const { setSocket, clearSocket, setSocketError } = socketSlice.actions;
export default socketSlice.reducer;

// Selectors
export const selectSocket = (state) => state.socket.instance;
export const selectSocketConnected = (state) => state.socket.connected;