// store/api/authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://localhost:4000/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  
  tagTypes: ['User', 'Users'],
  
  endpoints: (builder) => ({
    // Register user
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
      },
    }),
    
    // Login user
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
         const { accessToken, refreshToken, user } = response.data || {};
        if (accessToken && user) {
          localStorage.setItem('token', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('user', JSON.stringify(user));
        }
        return response;
      },
      invalidatesTags: ['User'],
    }),
    
    // Logout user
    logout: builder.mutation({
      queryFn: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return { data: { success: true } };
      },
      invalidatesTags: ['User', 'Users'],
    }),
    
    // Get all users
    getUsers: builder.query({
      query: () => '/auth/users',
      transformResponse: (response) => {
        return response.data.map((user) => ({
          id: user._id,
          _id: user._id,
          name: user.fullName,
          message: user.about || "Hey there! I am using WhatsApp",
          time: "Online recently",
          avatar: user.avatar || "👤",
          unread: 0,
          online: user.isOnline || false,
          isGroup: false,
          isFavourite: false,
        }));
      },
      providesTags: ['Users'],
    }),
    
    // Get current user
    getCurrentUser: builder.query({
      queryFn: () => {
        const user = localStorage.getItem('user');
        return user 
          ? { data: JSON.parse(user) }
          : { error: { status: 401, data: 'Not authenticated' } };
      },
      providesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetUsersQuery,
  useGetCurrentUserQuery,
} = authApi;