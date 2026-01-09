import { Phone, Video, Search, MoreVertical, ArrowLeft } from "lucide-react"
import { useChatContext } from "../context/ChatContext"
import MessageList from "./MessageList"
import MessageInput from "./MessageInput"

interface ChatWindowProps {
  onBack: () => void
  isMobileView: boolean
}

export default function ChatWindow({ onBack, isMobileView }: ChatWindowProps) {
  const { selectedChat, onlineUsers } = useChatContext()
  
  if (!selectedChat) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Select a chat to start messaging</p>
        </div>
      </div>
    )
  }

  const isOnline = onlineUsers[selectedChat._id || selectedChat.id] || false

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
          
          {/* Avatar with online indicator */}
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {selectedChat.name?.charAt(0).toUpperCase()}
            </div>
            {/* Online status dot */}
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                isOnline ? "bg-green-500" : "bg-red-500"
              }`}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 truncate">{selectedChat.name}</h2>
            <p className="text-xs text-gray-500">
              {isOnline ? "Active now" : "Offline"}
            </p>
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
      
      {/* Input */}
      <MessageInput
        receiverId={selectedChat._id || selectedChat.id}
        onMessageSent={() => console.log("Message sent")}
      />
    </div>
  )
}