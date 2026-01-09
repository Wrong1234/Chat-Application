import { useState, useRef, useCallback, useEffect } from "react"
import { Send } from "lucide-react"
import { useAuthContext } from "../context/AuthContext"
import { useSocket } from "../hooks/useSocket"

interface ChatInputProps {
  receiverId: string | null
  onSendMessage: (message: string) => void
}

export default function ChatInput({ receiverId, onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const { currentUser } = useAuthContext()
  const { emit } = useSocket(currentUser?._id || null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isTypingRef = useRef(false)

  const handleTyping = useCallback(() => {
    if (!receiverId || !currentUser?._id) return

   
    if (!isTypingRef.current) {
      emit('typing', {
        senderId: currentUser._id,
        receiverId
      })
      isTypingRef.current = true
    }

 
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      emit('stop-typing', {
        senderId: currentUser._id,
        receiverId
      })
      isTypingRef.current = false
    }, 2000)
  }, [receiverId, currentUser?._id, emit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim()) return

    // Stop typing before sending
    if (isTypingRef.current) {
      emit('stop-typing', {
        senderId: currentUser?._id,
        receiverId
      })
      isTypingRef.current = false
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    onSendMessage(message.trim())
    setMessage("")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    handleTyping()
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      if (isTypingRef.current && receiverId && currentUser?._id) {
        emit('stop-typing', {
          senderId: currentUser._id,
          receiverId
        })
      }
    }
  }, [receiverId, currentUser?._id, emit])

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </form>
  )
}