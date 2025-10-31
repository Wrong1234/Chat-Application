// Sidebar Component
import { useState } from "react";
import { Search, Menu, MessageCircle, Users, Settings } from "lucide-react";
import ChatItem from "./chat-item.jsx";
import  Button  from "./Button.jsx";

function Sidebar({ selectedChat, onSelectChat, chats, isMobileView }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = 
      activeTab === "all" ? true :
      activeTab === "unread" ? chat.unread > 0 :
      activeTab === "groups" ? chat.isGroup :
      activeTab === "favourites" ? chat.isFavourite : true;
    return matchesSearch && matchesTab;
  });

  return (
    <div className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-screen ${
      isMobileView && selectedChat ? 'hidden' : 'flex'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100">
            <Menu className="h-5 w-5" />
          </Button>
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
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatItem
              key={chat.id + 1}
              chat={chat}
              isSelected={selectedChat?.id === chat.id}
              onClick={() => onSelectChat(chat)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No chats found</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="p-3 border-t border-gray-200 flex gap-1 justify-around md:hidden bg-white">
        <Button variant="ghost" className="flex-1 flex flex-col items-center gap-1 h-auto py-2 text-green-600">
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs">Chats</span>
        </Button>
        <Button variant="ghost" className="flex-1 flex flex-col items-center gap-1 h-auto py-2 text-gray-600 hover:bg-gray-100">
          <Users className="h-5 w-5" />
          <span className="text-xs">Groups</span>
        </Button>
        <Button variant="ghost" className="flex-1 flex flex-col items-center gap-1 h-auto py-2 text-gray-600 hover:bg-gray-100">
          <Settings className="h-5 w-5" />
          <span className="text-xs">Settings</span>
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;