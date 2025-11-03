// Components/Sidebar.jsx
import { useDispatch, useSelector } from "react-redux";
import { Search, Menu, MessageCircle, Users, Settings } from "lucide-react";
import ChatItem from "./ChatItem.jsx";
import Button from "./Button.jsx";
import SettingsPanel from "./SettingPanel.jsx";
import { useState } from "react";
import { 
  setActiveTab, 
  setSearchQuery, 
  setSelectedChat,
  selectActiveTab,
  selectSearchQuery,
  selectSelectedChat
} from "../store/slices/chatSlice.js";
import { useGetUsersQuery } from "../store/api/authApi.js";

function Sidebar({ isMobileView }) {
  const dispatch = useDispatch();
  
  const activeTab = useSelector(selectActiveTab);
  const searchQuery = useSelector(selectSearchQuery);
  const selectedChat = useSelector(selectSelectedChat);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  
  // Fetch users with RTK Query
  const { data: chats = [],  isLoading , error } = useGetUsersQuery();

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  const handleSelectChat = (chat) => {
    dispatch(setSelectedChat(chat));
  };

  const filteredChats = chats.filter((chat) => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "unread"
        ? chat.unread > 0
        : activeTab === "groups"
        ? chat.isGroup
        : activeTab === "favourites"
        ? chat.isFavourite
        : true;
    return matchesSearch && matchesTab;
  });

  return (
    <div
      className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col h-screen relative ${
        isMobileView && selectedChat ? "hidden" : "flex"
      }`}
    >
      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        user={currentUser}
      />

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
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-3 pt-4 border-b border-gray-200 overflow-x-auto pb-4 scrollbar-hide">
        {["all", "unread", "favourites", "groups"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
              key={chat.id}
              chat={chat}
              isSelected={selectedChat?.id === chat.id}
              onClick={() => handleSelectChat(chat)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No chats found</p>
          </div>
        )}
      </div>

      {/* Bottom Settings Section (Visible on all screens) */}
      
      {/* Mobile Bottom Navigation */}
      <div className="p-3 border-t border-gray-200 flex gap-1 justify-around md:hidden bg-white">
        <Button variant="ghost" className="flex-1 flex flex-col items-center gap-1 h-auto py-2 text-green-600">
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs">Chats</span>
        </Button>
        <Button variant="ghost" className="flex-1 flex flex-col items-center gap-1 h-auto py-2 text-gray-600 hover:bg-gray-100">
          <Users className="h-5 w-5" />
          <span className="text-xs">Groups</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex-1 flex flex-col items-center gap-1 h-auto py-2 text-gray-600 hover:bg-gray-100"
          onClick={() => setIsSettingsOpen(true)}
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs">Settings</span>
        </Button>
      </div>

      {/* Desktop Settings Button */}
      <div className="hidden md:block p-3 border-t border-gray-200 bg-white">
        <Button 
          variant="ghost" 
          className="w-full flex items-center gap-3 justify-start px-3 py-2 hover:bg-gray-50 cursor-pointer"
          onClick={() => setIsSettingsOpen(true)}
        >
          <img
            src={currentUser.avatar}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1 text-left">
            <p className="font-medium text-sm text-gray-900">{currentUser.fullName}</p>
            {/* <p className="text-xs text-gray-500 truncate">View settings</p> */}
          </div>
          <Settings className="h-5 w-5 text-gray-400" />
        </Button>
      </div>
    </div>
  );
}


export default Sidebar;