import { useEffect, useRef, useCallback, useState } from "react"
import { Loader2 } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useMessages } from "../hooks/useMessages"
import { useAuthContext } from "../context/AuthContext"
import { useSocket } from "../hooks/useSocket"
import { useChatContext } from "../context/ChatContext"
import MessageBubble from "./MessageBubble"
import TypingIndicator from "./TypingIndicator"

interface MessageListProps {
  receiverId: string | null
}

export default function MessageList({ receiverId }: MessageListProps) {
  const { currentUser } = useAuthContext()
  const { setUserOnline } = useChatContext()
  const queryClient = useQueryClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesStartRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)

  const { messages, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useMessages(receiverId)
  const { socket, emit, on, off } = useSocket(currentUser?._id || null)

  useEffect(() => {
    if (!receiverId || !currentUser?._id || !socket) return

    emit('join-chat', { 
      senderId: currentUser._id, 
      receiverId 
    })

    const handleNewMessage = (newMessage: any) => {
      if (newMessage.senderId === currentUser._id || 
          newMessage.senderId?._id === currentUser._id) {
        return
      }
      
      queryClient.setQueryData(['messages', receiverId], (oldData: any) => {
        if (!oldData?.pages) return oldData

        const lastPageIndex = oldData.pages.length - 1
        
        return {
          ...oldData,
          pages: oldData.pages.map((page: any, index: number) => {
            if (index === lastPageIndex) {
              const messages = Array.isArray(page.messages) ? page.messages : []
              
              const messageExists = messages.some((msg: any) => msg._id === newMessage._id)
              if (messageExists) return page
              
              return {
                ...page,
                messages: [...messages, newMessage]
              }
            }
            return page
          }),
        }
      })

      setTimeout(() => scrollToBottom(), 100)
    }

    const handleUserTyping = (data: any) => {
      if (data.userId === receiverId) {
        setIsTyping(true)
      }
    }

    const handleUserStopTyping = (data: any) => {
      if (data.userId === receiverId) {
        setIsTyping(false)
      }
    }

    // Listen for online/offline status
    const handleUserOnline = (data: any) => {
      setUserOnline(data.userId, true)
    }

    const handleUserOffline = (data: any) => {
      setUserOnline(data.userId, false)
    }

    const handleJoinedChat = (data: any) => {
      // Set initial online status when joining chat
      if (data.receiverOnline !== undefined) {
        setUserOnline(receiverId, data.receiverOnline)
      }
    }

    on('receive-message', handleNewMessage)
    on('user-typing', handleUserTyping)
    on('user-stop-typing', handleUserStopTyping)
    on('user-online', handleUserOnline)
    on('user-offline', handleUserOffline)
    on('joined-chat', handleJoinedChat)

    return () => {
      off('receive-message')
      off('user-typing')
      off('user-stop-typing')
      off('user-online')
      off('user-offline')
      off('joined-chat')
      emit('leave-chat', { 
        senderId: currentUser._id, 
        receiverId 
      })
    }
  }, [receiverId, currentUser?._id, socket, emit, on, off, queryClient, setUserOnline])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages.length, isTyping, scrollToBottom])

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    const { scrollTop } = containerRef.current
    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      const scrollHeight = containerRef.current.scrollHeight
      fetchNextPage().then(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight - scrollHeight
        }
      })
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23d1d5db' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      )}

      <div ref={messagesStartRef} />

      {messages?.length > 0
        ? messages
            .filter((msg): msg is typeof messages[0] => !!msg)
            .map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                isOwn={
                  msg.senderId === currentUser?._id ||
                  (typeof msg.senderId === "object" && msg.senderId._id === currentUser?._id)
                }
              />
            ))
        : null}

      {isTyping && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  )
}