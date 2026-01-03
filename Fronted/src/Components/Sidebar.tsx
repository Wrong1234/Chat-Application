import { useState } from "react"
import { Search, Menu } from "lucide-react"
import { useChatContext } from "../context/ChatContext"
import { useUsers } from "../hooks/useUsers"
import { useAuthContext } from "../context/AuthContext"
import ChatItem from "./ChatListItem"
import SettingsPanel from "./SettingsPanel"

interface SidebarProps {
  isMobileView: boolean
}

export default function Sidebar({ isMobileView }: SidebarProps) {
  const { selectedChat, setSelectedChat, activeTab, setActiveTab, searchQuery, setSearchQuery } = useChatContext()
  const { users, isLoading } = useUsers()
  const { currentUser } = useAuthContext()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const filteredChats = users.filter((chat) => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "unread"
          ? chat.unread > 0
          : activeTab === "groups"
            ? chat.isGroup
            : activeTab === "favourites"
              ? chat.isFavourite
              : true
    return matchesSearch && matchesTab
  })

  return (
    <div
      className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-screen relative ${
        isMobileView && selectedChat ? "hidden" : "flex"
      }`}
    >
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} />

      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-gray-100 rounded-full transition">
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-3 pt-4 border-b border-gray-200 overflow-x-auto pb-4 scrollbar-hide">
        {["all", "unread", "favourites", "groups"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading chats...</p>
          </div>
        ) : filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChat?.id === chat.id}
              onClick={() => setSelectedChat(chat)}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No chats found</p>
          </div>
        )}
      </div>
    </div>
  )
}
