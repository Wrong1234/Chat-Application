import { useEffect, useRef, useCallback } from "react"
import { Loader2 } from "lucide-react"
import { useMessages } from "../hooks/useMessages"
import { useAuthContext } from "../context/AuthContext"
import MessageBubble from "./MessageBubble"

interface MessageListProps {
  receiverId: string | null
}

export default function MessageList({ receiverId }: MessageListProps) {
  const { currentUser } = useAuthContext()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesStartRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { messages, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useMessages(receiverId)

  // Scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages.length, scrollToBottom])

  // Infinite scroll detection
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    const { scrollTop } = containerRef.current
    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      const scrollHeight = containerRef.current.scrollHeight
      fetchNextPage().then(() => {
        // Maintain scroll position after loading more
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

      {/* {messages.map((msg) => (
        <MessageBubble
          key={msg._id}
          message={msg}
          isOwn={
            msg?.senderId === currentUser?._id ||
            (typeof msg?.senderId === "object" && msg?.senderId?._id === currentUser?._id)
          }
        />
      ))} */}
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

      <div ref={messagesEndRef} />
    </div>
  )
}
