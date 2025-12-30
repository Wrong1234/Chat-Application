import { useState } from "react"
import { Phone, Video, Search, MoreVertical, ArrowLeft } from "lucide-react"
import { useChatContext } from "../context/ChatContext"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"
import TypingIndicator from "./TypingIndicator"

interface ChatWindowProps {
  onBack: () => void
  isMobileView: boolean
}

export default function ChatWindow({ onBack, isMobileView }: ChatWindowProps) {
  const { selectedChat } = useChatContext()
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())

  if (!selectedChat) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Select a chat to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex-1 flex flex-col bg-white ${!isMobileView && selectedChat ? "flex" : !isMobileView ? "hidden" : "flex"}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isMobileView && (
            <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 truncate">{selectedChat.name}</h2>
            <p className="text-xs text-gray-500">{selectedChat.online ? "Active now" : "Offline"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Phone className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Video className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Search className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <MessageList receiverId={selectedChat._id || selectedChat.id} />

      {/* Typing Indicator */}
      {typingUsers.size > 0 && <TypingIndicator />}

      {/* Input */}
      <MessageInput
        receiverId={selectedChat._id || selectedChat.id}
        onMessageSent={() => console.log("Message sent")}
      />
    </div>
  )
}
