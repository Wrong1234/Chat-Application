import { useState } from "react";
import { Search, Menu, MessageCircle, Users, Settings } from "lucide-react";
import ChatItem from "./chat-item.jsx";
import { Button } from "./Button.jsx";

const CHATS = [
  {
    id: 1,
    name: "SCALEUP | Betopia",
    message: "Rubel Das: This message was deleted",
    time: "8:42 am",
    avatar: "👥",
    unread: true,
  },
  {
    id: 2,
    name: "IT | Betopia",
    message: "MD ZOBAIR AHMED: Headphone provided",
    time: "Yesterday",
    avatar: "👨",
    unread: false,
  },
  {
    id: 3,
    name: "SCALEUP | Betopia",
    message: "SAA [Operation Only]",
    time: "Yesterday",
    avatar: "👥",
    unread: false,
  },
  {
    id: 4,
    name: "Khaled Saifullah",
    message: "✓✓ $2y$12$1HiSacK...",
    time: "Yesterday",
    avatar: "👤",
    unread: false,
  },
  {
    id: 5,
    name: "Kongkon Jowarder",
    message: "✓✓ [[baseURL]]/dashboard/static-data",
    time: "Tuesday",
    avatar: "👤",
    unread: false,
  },
];

export default function Sidebar({ selectedChat, onSelectChat }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  //fetch all users
  

  return (
    <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
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
      <div className="flex gap-2 px-4 pt-4 border-b border-gray-200 overflow-x-auto">
        {["all", "unread", "favourites", "groups"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {CHATS.map((chat, index) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isSelected={selectedChat === index}
            onClick={() => onSelectChat(chat)}
          />
        ))}
      </div>

      {/* Bottom Navigation (Mobile) */}
      <div className="p-4 border-t border-gray-200 flex gap-2 justify-around md:hidden bg-white">
        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
          <MessageCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
          <Users className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
