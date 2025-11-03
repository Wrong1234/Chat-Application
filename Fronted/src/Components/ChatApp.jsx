// Components/ChatApp.jsx
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { clearSelectedChat, selectSelectedChat } from "../store/slices/chatSlice.js";
import { useSocket } from "../hooks/useSocket.js";

export default function ChatApp() {
  const dispatch = useDispatch();
  const selectedChat = useSelector(selectSelectedChat);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize socket connection
  useSocket();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleBackToList = () => {
    dispatch(clearSelectedChat());
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
      <Sidebar isMobileView={isMobile} />
      <ChatWindow onBack={handleBackToList} isMobileView={isMobile} />
    </div>
  );
}