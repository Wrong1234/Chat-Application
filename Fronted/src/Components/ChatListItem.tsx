import { useChatContext } from "../context/ChatContext"

interface ChatListItemProps {
  chat: any
  isSelected: boolean
  onClick: () => void
}

export default function ChatListItem({ chat, isSelected, onClick }: ChatListItemProps) {
  const { onlineUsers } = useChatContext()
  const isOnline = onlineUsers[chat._id || chat.id] || false

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 cursor-pointer transition ${
        isSelected ? "bg-gray-100" : "hover:bg-gray-50"
      }`}
    >
      {/* Avatar with online indicator */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {chat.name?.charAt(0).toUpperCase()}
        </div>
        {/* Online status dot */}
        <div
          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
            isOnline ? "bg-green-500" : "bg-red-500"
          }`}
        />
      </div>

      {/* Chat info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
          {chat.lastMessageTime && (
            <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 truncate">{chat.lastMessage || "No messages yet"}</p>
          {chat.unreadCount > 0 && (
            <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}