// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/authApi';
import { messageApi } from './api/messageApi';
import authReducer from './slices/authSlice';
import chatReducer from './slices/chatSlice';
import socketReducer from './slices/socketSlice';

export const store = configureStore({
  reducer: {
    // RTK Query API reducers
    [authApi.reducerPath]: authApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    
    // Regular slices
    auth: authReducer,
    chat: chatReducer,
    socket: socketReducer,
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore socket.io instance in actions
        ignoredActions: ['socket/setSocket'],
        ignoredPaths: ['socket.instance'],
      },
    }).concat(authApi.middleware, messageApi.middleware),
});

// Enable refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;