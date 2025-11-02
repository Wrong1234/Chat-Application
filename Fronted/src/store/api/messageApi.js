// store/api/messageApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://localhost:4000/api';

export const messageApi = createApi({
  reducerPath: 'messageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  
  tagTypes: ['Messages'],
  
  endpoints: (builder) => ({
    // Get messages for a specific user
    getMessages: builder.query({
      query: (receiverId) => `/messages/get/${receiverId}`,
      transformResponse: (response) => response.data || [],
      providesTags: (result, error, receiverId) => [
        { type: 'Messages', id: receiverId },
      ],
    }),
    
    // Send message (with optional file)
    sendMessage: builder.mutation({
      query: ({ receiverId, senderId, message, file }) => {
        const formData = new FormData();
        formData.append('receiverId', receiverId);
        formData.append('senderId', senderId);
        formData.append('message', message);
        
        if (file) {
          formData.append('file', file);
        }
        
        return {
          url: '/messages/send',
          method: 'POST',
          body: formData,
          // Don't set Content-Type for FormData - browser will set it with boundary
          prepareHeaders: (headers) => {
            headers.delete('Content-Type');
            return headers;
          },
        };
      },
      transformResponse: (response) => response.data,
      invalidatesTags: (result, error, { receiverId }) => [
        { type: 'Messages', id: receiverId },
      ],
      // Optimistic update
      async onQueryStarted(
        { receiverId, senderId, message, file },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          messageApi.util.updateQueryData('getMessages', receiverId, (draft) => {
            draft.push({
              _id: 'temp-' + Date.now(),
              senderId,
              receiverId,
              message,
              createdAt: new Date().toISOString(),
              fileUrl: file ? URL.createObjectURL(file) : null,
              fileType: file?.type.startsWith('image/') ? 'image' : 'file',
            });
          })
        );
        
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
  useLazyGetMessagesQuery,
} = messageApi;