// Chat Item Component

function ChatItem({ chat, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-3 border-b border-gray-100 cursor-pointer transition-colors active:bg-gray-200 ${
        isSelected ? "bg-gray-200 md:bg-gray-300" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex gap-3 items-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xl flex-shrink-0 text-white font-semibold">
            {chat.avatar}
          </div>
          {chat.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-sm text-gray-900 truncate">
              {chat.name}
            </h3>
            <span className="text-xs text-gray-500 flex-shrink-0">
              {chat.time}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-1">
            <p className="text-xs text-gray-600 truncate flex-1">{chat.message}</p>
            {chat.unread > 0 && (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-medium">{chat.unread }</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatItem;