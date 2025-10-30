import React from "react";

export default function ChatItem({ chat, isSelected, onClick }) {

  return (
    <div
      onClick={onClick}
      className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${
        isSelected ? "bg-gray-50" : "hover:bg-gray-50"
      }`}
    >
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-xl flex-shrink-0 text-white font-semibold">
          {chat.avatar}
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
          <p className="text-xs text-gray-600 truncate mt-1">{chat.message}</p>
        </div>
        {chat.unread && (
          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1"></div>
        )}
      </div>
    </div>
  );
}
