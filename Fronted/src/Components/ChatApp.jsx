import { useEffect, useState } from "react";
import Sidebar from "./sidebar.jsx"
import ChatWindow from "./chat-window.jsx"
// Main Chat App Component
export default function ChatApp() {
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "SCALEUP | Betopia",
      message: "Rubel Das: This message was deleted",
      time: "8:42 am",
      avatar: "👥",
      unread: 3,
      online: true,
      isGroup: true,
      isFavourite: false,
      messages: [
        {
          id: 1,
          sender: "SCALEUP | Betopia",
          text: "Welcome to the group!",
          time: "8:30 am",
          isOwn: false,
        }
      ]
    },
    {
      id: 2,
      name: "IT | Betopia",
      message: "MD ZOBAIR AHMED: Headphone provided",
      time: "Yesterday",
      avatar: "👨",
      unread: 0,
      online: false,
      isGroup: true,
      isFavourite: true,
      messages: [
        {
          id: 1,
          sender: "MD ZOBAIR AHMED",
          text: "Headphone provided",
          time: "Yesterday",
          isOwn: false,
        }
      ]
    },
    {
      id: 3,
      name: "SCALEUP | Betopia",
      message: "SAA [Operation Only]",
      time: "Yesterday",
      avatar: "👥",
      unread: 0,
      online: false,
      isGroup: true,
      isFavourite: false,
      messages: []
    },
    {
      id: 4,
      name: "SCALEUP | Betopia",
      message: "SAA [Operation Only]",
      time: "Yesterday",
      avatar: "👥",
      unread: 0,
      online: false,
      isGroup: true,
      isFavourite: false,
      messages: []
    },
    {
      id: 5,
      name: "SCALEUP | Betopia",
      message: "SAA [Operation Only]",
      time: "Yesterday",
      avatar: "👥",
      unread: 0,
      online: false,
      isGroup: true,
      isFavourite: false,
      messages: []
    },
    {
      id: 6,
      name: "SCALEUP | Betopia",
      message: "SAA [Operation Only]",
      time: "Yesterday",
      avatar: "👥",
      unread: 0,
      online: false,
      isGroup: true,
      isFavourite: false,
      messages: []
    },
    {
      id: 7,
      name: "Khaled Saifullah",
      message: "✓✓ $2y$12$1HiSacK...",
      time: "Yesterday",
      avatar: "👤",
      unread: 0,
      online: true,
      isGroup: false,
      isFavourite: false,
      messages: []
    },
    {
      id: 8,
      name: "Kongkon Jowarder",
      message: "✓✓ [[baseURL]]/dashboard/static-data",
      time: "Tuesday",
      avatar: "👤",
      unread: 0,
      online: false,
      isGroup: false,
      isFavourite: true,
      messages: [
        {
          id: 1,
          sender: "Kongkon Jowarder",
          text: "Use WhatsApp on your phone to see older messages from before 27/7/2025.",
          time: "16/10/2025",
          isOwn: false,
        },
        {
          id: 2,
          sender: "You",
          text: "Wrong1234 - Overview\nStudied Islamic University, Bangladesh\nDept : Computer Science And Engineering - Wrong1234\ngithub.com",
          time: "1:00 pm",
          isOwn: true,
          link: "https://github.com/Wrong1234",
        },
        {
          id: 3,
          sender: "You",
          text: "[[baseURL]]/dashboard/revenue-report?filterType=year&year=2025",
          time: "11:48 am",
          isOwn: true,
        },
        {
          id: 4,
          sender: "You",
          text: "[[baseURL]]/dashboard/revenue-report?filterType=month&month=10",
          time: "11:50 am",
          isOwn: true,
        },
      ]
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    // Mark as read when opening chat
    setChats(prevChats =>
      prevChats.map(c =>
        c.id === chat.id ? { ...c, unread: 0 } : c
      )
    );
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  const handleSendMessage = (chatId, messageText) => {
    const newMessage = {
      id: Date.now(),
      sender: "You",
      text: messageText,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isOwn: true,
    };

    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              message: `✓✓ ${messageText.substring(0, 30)}${messageText.length > 30 ? '...' : ''}`,
              time: "Just now"
            }
          : chat
      )
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 text-foreground overflow-hidden">
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <Sidebar 
        selectedChat={selectedChat} 
        onSelectChat={handleSelectChat}
        chats={chats}
        isMobileView={isMobile}
      />
      <ChatWindow 
        selectedChat={selectedChat}
        onSendMessage={handleSendMessage}
        onBack={handleBackToList}
        isMobileView={isMobile}
      />
    </div>
  );
}