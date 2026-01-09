import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchAPI } from "../config/api"

interface Message {
  _id: string
  senderId: { _id: string; profileImage: string } | string
  receiverId: { _id: string; profileImage: string } | string
  message: string
  fileUrl?: string
  mediaUrl?: string
  createdAt: string
}

interface MessageResponse {
  messages: Message[]
  hasMore: boolean
  page: number
}

export const useMessages = (receiverId: string | null) => {
  const queryClient = useQueryClient()

  const messagesQuery = useInfiniteQuery({
    queryKey: ["messages", receiverId],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchAPI(`/messages/get/${receiverId}?page=${pageParam}&limit=30`)
      
      // Transform backend response to match expected structure
      return {
        messages: response.data || [],
        hasMore: response.data?.length === 30, // If we got 30 messages, there might be more
        page: pageParam
      }
    },
    getNextPageParam: (lastPage: MessageResponse) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    enabled: !!receiverId,
    initialPageParam: 1,
  })

  const sendMessageMutation = useMutation({
    mutationFn: async (data: {
      receiverId: string
      senderId: string
      message: string
      file?: File
    }) => {
      const formData = new FormData()
      formData.append("receiverId", data.receiverId)
      formData.append("senderId", data.senderId)
      formData.append("message", data.message)
      if (data.file) {
        formData.append("file", data.file)
      }

      const response = await fetch(`https://chat-application-vvl3.onrender.com/api/messages/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to send message")
      return response.json()
    },
    onSuccess: (response) => {
      const newMessage = response.data

      queryClient.setQueryData(["messages", receiverId], (oldData: any) => {
        if (!oldData?.pages) return oldData

        const lastPageIndex = oldData.pages.length - 1

        return {
          ...oldData,
          pages: oldData.pages.map((page: any, index: number) => {
            if (index === lastPageIndex) {
              const messages = Array.isArray(page.messages) ? page.messages : []
              return {
                ...page,
                messages: [...messages, newMessage]
              }
            }
            return page
          }),
        }
      })
    },
  })

  return {
    messages: messagesQuery.data?.pages.flatMap((p) => p.messages || []) || [],
    isLoading: messagesQuery.isLoading,
    isFetchingNextPage: messagesQuery.isFetchingNextPage,
    hasNextPage: messagesQuery.hasNextPage,
    fetchNextPage: messagesQuery.fetchNextPage,
    sendMessage: sendMessageMutation,
  }
}