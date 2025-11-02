// import { useEffect, useState } from "react";
// import Sidebar from "./sidebar.jsx"
// import ChatWindow from "./chat-window.jsx"
// // Main Chat App Component
// export default function ChatApp() {
//   const [chats, setChats] = useState([]);


//   //fetch all users
//   const users = async() => {
//     try{

//       const response = await fetch("http://localhost:4000/api/auth/users",{
//         method: "GET",
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: "Bearer " + localStorage.getItem("token"),
//         },

//       });
      
//       const data = await response.json();

//       // 🧩 Transform backend data into sidebar format
//       const formattedUsers = data.data.map((user, index) => ({
//         id: user._id, // or index + 1
//         name: user.fullName,
//         message: user.about || "Hey there! I am using WhatsApp",
//         time: "Online recently",
//         avatar: "👤",
//         unread: 0,
//         online: user.isOnline,
//         isGroup: false,
//         isFavourite: false,
//         messages: [],
//       }));

//       setChats(formattedUsers);
//     }catch (error) {
//     console.error("Failed to load users:", error);
//   }

// }
//   useEffect(() =>{
//     users();
//   }, [])

//   const [selectedChat, setSelectedChat] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   const handleSelectChat = (chat) => {
//     setSelectedChat(chat);
//     // Mark as read when opening chat
//     setChats(prevChats =>
//       prevChats.map(c =>
//         c.id === chat.id ? { ...c, unread: 0 } : c
//       )
//     );
//   };

//   const handleBackToList = () => {
//     setSelectedChat(null);
//   };

//   const handleSendMessage = (receiverId, messageText) => {
//     const newMessage = {
//       id: Date.now(),
//       sender: "You",
//       text: messageText,
//       time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
//       isOwn: true,
//     };

//     setChats(prevChats => 
//       prevChats.map(chat => 
//         chat.id === receiverId
//           ? {
//               ...chat,
//               messages: [...chat.messages, newMessage],
//               message: `✓✓ ${messageText.substring(0, 30)}${messageText.length > 30 ? '...' : ''}`,
//               time: "Just now"
//             }
//           : chat
//       )
//     );
//   };

//   return (
//     <div className="flex h-screen bg-gray-100 text-foreground overflow-hidden">
//       <style>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out;
//         }
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//       <Sidebar 
//         selectedChat={selectedChat} 
//         onSelectChat={handleSelectChat}
//         chats={chats}
//         isMobileView={isMobile}
//       />
//       <ChatWindow 
//         selectedChat={selectedChat}
//         onSendMessage={handleSendMessage}
//         onBack={handleBackToList}
//         isMobileView={isMobile}
//       />
//     </div>
//   );
// }

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