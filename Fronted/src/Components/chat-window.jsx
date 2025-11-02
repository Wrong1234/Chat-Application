// //chat window

// import { useState, useRef, useEffect } from "react";
// import { Send, Phone, Video, Search, MoreVertical, ArrowLeft, Paperclip, Smile, Mic, MessageCircle } from "lucide-react";
// import io from "socket.io-client";

// import Button from "./Button.jsx";

// function ChatWindow({ selectedChat, onBack, isMobileView }) {
//   const [errors, setErrors] = useState({});
//   const [messages, setMessages] = useState([]);
//   const [socketConnected, setSocketConnected] = useState(false);
//   const [formData, setFormData] = useState({ message: "" });
//   const messagesEndRef = useRef(null);
//   const socket = useRef(null);
//   const selectedChatRef = useRef(null);
//   const [isTyping, setIsTyping] = useState(false);
//   const typingTimeoutRef = useRef(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const fileInputRef = useRef(null);
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);

//   const ENDPOINT = "http://localhost:4000";
//   const receiverId = selectedChat?._id || selectedChat?.id || null;
//   const user = JSON.parse(localStorage.getItem("user"));
//   const senderId = user?._id;

//   // ✅ Fetch messages
//   const fetchMessages = async () => {
//     if (!receiverId) return;
//     try {
//       const response = await fetch(`${ENDPOINT}/api/messages/get/${receiverId}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: "Bearer " + localStorage.getItem("token"),
//         },
//       });

//       const result = await response.json();

//       if (result.status) {
//         setMessages(result.data);
//         // console.log(result.data);
//         console.log(`✅ Fetched ${result.data.length} messages`);
//       }
//     } catch (error) {
//       console.error("Failed to fetch messages:", error);
//     }
//   };

//   // ✅ Initialize socket connection (once)
//   useEffect(() => {
//     if (!senderId) return;

//     socket.current = io(ENDPOINT, {
//       transports: ['websocket', 'polling'],
//     });
    
//     // Join personal room
//     socket.current.emit("join", senderId);
    
//     socket.current.on("connected", () => {
//       setSocketConnected(true);
//       console.log("✅ Socket connected successfully");
//     });

//     socket.current.on("joined-chat", (data) => {
//       console.log("✅ Successfully joined chat room:", data.chatRoomId);
//     });

//     // Listen for incoming messages
//     socket.current.on("receive-message", (newMessage) => {
//       console.log("📩 Received message:", newMessage);
      
//       // Add message and prevent duplicates
//       setMessages((prev) => {
//         // Check if message already exists
//         const exists = prev.some(m => m._id === newMessage._id);
//         if (exists) {
//           console.log("⚠️ Duplicate message detected, ignoring");
//           return prev;
//         }
//         console.log("✅ Adding new message to state");
//         return [...prev, newMessage];
//       });
//        setIsTyping(false);
//     });

//     // Error handling
//     socket.current.on("error", (error) => {
//       console.error("❌ Socket error:", error);
//     });

//     // ✅ Listen for typing indicators
//     socket.current.on("user-typing", (data) => {
//       console.log("✍️ User is typing:", data.userId);
//       if (selectedChatRef.current) {
//         const currentChatId = selectedChatRef.current._id || selectedChatRef.current.id;
//         if (data.userId === currentChatId) {
//           setIsTyping(true);
//         }
//       }
//     });

//     // ✅ Listen for stop typing
//     socket.current.on("user-stop-typing", (data) => {
//       console.log("🛑 User stopped typing:", data.userId);
//       if (selectedChatRef.current) {
//         const currentChatId = selectedChatRef.current._id || selectedChatRef.current.id;
//         if (data.userId === currentChatId) {
//           setIsTyping(false);
//         }
//       }
//     });


//     return () => {
//       console.log("🔌 Disconnecting socket");
//       socket.current?.off("receive-message");
//       socket.current?.off("connected");
//       socket.current?.off("joined-chat");
//       socket.current?.off("error");
//       socket.current?.off("user-typing");
//       socket.current?.off("user-stop-typing");
//       socket.current?.disconnect();
//     };
//   }, [senderId]);

//   // ✅ Handle chat selection changes
//   useEffect(() => {
//     if (!receiverId || !senderId) return;

//     console.log("📋 Chat changed:", {
//       receiverId,
//       receiverName: selectedChat?.name,
//       senderId
//     });

//     // Leave previous chat room if exists
//     if (selectedChatRef.current) {
//       const prevReceiverId = selectedChatRef.current._id || selectedChatRef.current.id;
//       socket.current?.emit("leave-chat", {
//         senderId: senderId,
//         receiverId: prevReceiverId
//       });
//     }

//     // Update ref
//     selectedChatRef.current = selectedChat;

//     // Fetch messages
//     fetchMessages();

//     // Join new chat room with BOTH IDs
//     socket.current?.emit("join-chat", { 
//       senderId: senderId, 
//       receiverId: receiverId 
//     });

//     setIsTyping(false);  // switch another user 
//     // Cleanup on unmount or chat change
//     return () => {
//       if (receiverId && senderId) {
//         socket.current?.emit("leave-chat", {
//           senderId: senderId,
//           receiverId: receiverId
//         });
//       }
//     };
//   }, [receiverId, senderId]);

//   // ✅ Scroll to bottom
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   //file management
//   const triggerFileSelect = () => {
//     fileInputRef.current?.click(); 
//   };

// // File input handler
// const handleFileChange = (e) => {
//   const selectedFile = e.target.files[0];
//   if (!selectedFile) return;

//   if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
//     setErrors({ send: "File size must be less than 5MB" });
//     return;
//   }

//   setFile(selectedFile);
//   setPreview(URL.createObjectURL(selectedFile));
// };


//   // ✅ Handle message input
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });

//      // ✅ Emit typing event when user types
//     if (e.target.value.trim() && receiverId) {
//       socket.current?.emit("typing", {
//         senderId: senderId,
//         receiverId: receiverId
//       });

//       // Clear previous timeout
//       if (typingTimeoutRef.current) {
//         clearTimeout(typingTimeoutRef.current);
//       }

//       // ✅ Stop typing after 2 seconds of inactivity
//       typingTimeoutRef.current = setTimeout(() => {
//         socket.current?.emit("stop-typing", {
//           senderId: senderId,
//           receiverId: receiverId
//         });
//       }, 2000);
//     }
//   };

//   // ✅ Validate form
//   const validateForm = () => {
//     const newErrors = {};
//     // if (!formData.message.trim()) newErrors.message = "Message is required";
//     return newErrors;
//   };

//   // ✅ Send message
//   const handleSendMessage = async (e) => {
//     e.preventDefault();
//     setErrors({});

//     const validationErrors = validateForm();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//      // Update validation to allow file-only messages
//     if (!formData.message.trim() && !file) {
//       setErrors({ message: "Please enter a message or select a file" });
//       return;
//     }

//     // ✅ Clear typing timeout and emit stop typing
//     if (typingTimeoutRef.current) {
//       clearTimeout(typingTimeoutRef.current);
//     }
//     socket.current?.emit("stop-typing", {
//       senderId: senderId,
//       receiverId: receiverId
//     });
//     const messageText = formData.message;
//     const fileToSend = file;
//     setFormData({ message: "" }); // Clear input immediately
//     setFile(null);
//     setPreview(null);

//     try {

//       const formDataToSend = new FormData();
//       formDataToSend.append("receiverId", receiverId);
//       formDataToSend.append("senderId", senderId);
//       formDataToSend.append("message", messageText);
//       if(fileToSend) formDataToSend.append("file", fileToSend);

//       console.log(formDataToSend);
//       const response = await fetch(`${ENDPOINT}/api/messages/send`, {
//         method: "POST",
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("token"),
//         },
//         body: formDataToSend,
//       });

//       const data = await response.json();

//       if (response.ok) {
//         console.log("✅ Message saved to database:", data.data);

//         // Emit to socket with complete message object
//         socket.current.emit("send-message", {
//           receiverId: receiverId,
//           senderId: senderId,
//           message: data.data, // Complete message object from backend
//         });

//         // Add to local state (check for duplicates)
//         setMessages((prev) => {
//           const exists = prev.some(m => m._id === data.data._id);
//           if (!exists) {
//             return [...prev, data.data];
//           }
//           return prev;
//         });
//       } else {
//         console.error(data.message || "Message sending failed");
//         setFormData({ message: messageText }); // Restore on error
//         setFile(fileToSend);
//         if(fileToSend){
//           setPreview(URL.createObjectURL(fileToSend));
//         }
//       }
//     } catch (error) {
//       console.error("An error occurred while sending message:", error);
//       setFormData({ message: messageText }); // Restore on error
//       setFile(fileToSend);
//       if(fileToSend){
//         setPreview(URL.createObjectURL(fileToSend));
//       }
//     }
//   };

//   if (!selectedChat) {
//     return (
//       <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <MessageCircle className="h-20 w-20 text-gray-300 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a chat</h3>
//           <p className="text-gray-500 text-sm">Choose a conversation to start messaging</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`flex-1 flex flex-col bg-white ${
//       isMobileView ? 'fixed inset-0 z-50' : ''
//     }`}>
//       {/* Header */}
//       <div className="p-3 md:p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm">
//         <div className="flex items-center gap-3 flex-1 min-w-0">
//           {isMobileView && (
//             <Button 
//               variant="ghost" 
//               size="icon" 
//               className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0"
//               onClick={onBack}
//             >
//               <ArrowLeft className="h-5 w-5" />
//             </Button>
//           )}
//           <div className="relative flex-shrink-0">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-lg text-white font-semibold">
//               {selectedChat.avatar}
//             </div>
//             {selectedChat.online && (
//               <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//             )}
//           </div>
//           <div className="flex-1 min-w-0">
//             <h2 className="font-semibold text-gray-900 truncate">{selectedChat.name}</h2>
//             <p className="text-xs text-gray-500 truncate">
//               {isTyping ? (
//                 <span className="text-green-600 font-medium">typing...</span>
//               ) : selectedChat.online ? (
//                 'Online'
//               ) : (
//                 selectedChat.time
//               )}
//             </p>
//           </div>
//         </div>
//         <div className="flex gap-1 md:gap-2 flex-shrink-0">
//           <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100">
//             <Phone className="h-4 w-4 md:h-5 md:w-5" />
//           </Button>
//           <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100">
//             <Video className="h-4 w-4 md:h-5 md:w-5" />
//           </Button>
//           <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100 hidden md:inline-flex">
//             <Search className="h-5 w-5" />
//           </Button>
//           <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100">
//             <MoreVertical className="h-4 w-4 md:h-5 md:w-5" />
//           </Button>
//         </div>
//       </div>

//       {/* Messages */}
//       <div 
//         className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
//         style={{
//           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
//         }}
//       >
//         {messages.length > 0 ? (
//           <>
//             {messages.map((msg) => {
//               // ✅ Handle both object and string senderId
//               const msgSenderId = typeof msg.senderId === 'object' 
//                 ? msg.senderId._id 
//                 : msg.senderId;
              
//               const isMyMessage = msgSenderId === senderId;
              
//               return (
//                 <div
//                   key={msg._id}
//                   className={`flex ${isMyMessage ? "justify-end" : "justify-start"} animate-fadeIn`}
//                 >
//                   <div
//                     className={`max-w-[75%] px-3 py-2 rounded-lg shadow-sm ${
//                       isMyMessage
//                         ? "bg-green-500 text-white rounded-br-none"
//                         : "bg-white text-gray-900 rounded-bl-none"
//                     }`}
//                   >
//                     <p className="text-sm break-words whitespace-pre-wrap">{msg.message}</p>
//                     <div className={`text-xs mt-1 ${isMyMessage ? 'text-green-100' : 'text-gray-400'}`}>
//                       {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//             <div ref={messagesEndRef} />
//           </>
//         ) : (
//           <div className="flex flex-col items-center justify-center h-full">
//             <MessageCircle className="h-16 w-16 text-gray-300 mb-3" />
//             <p className="text-gray-500 text-sm">No messages yet</p>
//             <p className="text-gray-400 text-xs mt-1">Start the conversation!</p>
//           </div>
//         )}
//       </div>

//         {/* Preview above the input bar container */}
//        {preview && (
//           <div className="mb-2 flex items-center gap-2">
//             <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded" />
//             <button onClick={() => { setFile(null); setPreview(null); }} className="text-red-500">Remove</button>
//           </div>
//         )}

//       {/* Input */}
//       <div className="p-3 md:p-4 border-t border-gray-300 bg-white">
//         <div className="flex gap-2 items-end">
//           <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0 hidden md:inline-flex">
//             <Smile className="h-5 w-5" />
//           </Button>
//            <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             accept="image/*,.pdf,.doc,.docx,.txt"
//             className="hidden"
//           />
//           <Button 
//             variant="ghost" 
//             size="icon" 
//             onClick={triggerFileSelect}
//             className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0">
            
//             <Paperclip className="h-5 w-5" />
//           </Button>
//           <div className="flex-1 relative">
//             <input
//               type="text"
//               name="message"
//               placeholder="Type a message"
//               value={formData.message}
//               onChange={handleChange}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter' && !e.shiftKey) {
//                   e.preventDefault();
//                   handleSendMessage(e);
//                 }
//               }}
//               className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
//             />
//           </div>
//           {formData.message.trim() || file ? (
//             <Button
//               onClick={handleSendMessage}
//               size="icon"
//               className="h-9 w-9 rounded-full bg-green-500 hover:bg-green-600 text-white flex-shrink-0"
//             >
//               <Send className="h-4 w-4" />
//             </Button>
//           ) : (
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0"
//             >
//               <Mic className="h-5 w-5" />
//             </Button>
//           )}
//         </div>
//         {errors.message && (
//           <p className="text-red-500 text-xs mt-2">{errors.message}</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ChatWindow;

import { useState, useRef, useEffect } from "react";
import { Send, Phone, Video, Search, MoreVertical, ArrowLeft, Paperclip, Smile, Mic, MessageCircle, X, Loader2, FileText, Image as ImageIcon } from "lucide-react";
import io from "socket.io-client";

import Button from "./Button.jsx";

function ChatWindow({ selectedChat, onBack, isMobileView }) {
  const [errors, setErrors] = useState({});
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [formData, setFormData] = useState({ message: "" });
  const messagesEndRef = useRef(null);
  const socket = useRef(null);
  const selectedChatRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // ✅ Add loading state

  const ENDPOINT = "http://localhost:4000";
  const receiverId = selectedChat?._id || selectedChat?.id || null;
  const user = JSON.parse(localStorage.getItem("user"));
  const senderId = user?._id;

  // ... (keep all your existing useEffects - they're fine)

  // ✅ Fetch messages
  const fetchMessages = async () => {
    if (!receiverId) return;
    try {
      const response = await fetch(`${ENDPOINT}/api/messages/get/${receiverId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const result = await response.json();

      if (result.status) {
        setMessages(result.data);
        console.log(`✅ Fetched ${result.data.length} messages`);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  // ... (keep all socket useEffects)

  useEffect(() => {
    if (!senderId) return;

    socket.current = io(ENDPOINT, {
      transports: ['websocket', 'polling'],
    });
    
    socket.current.emit("join", senderId);
    
    socket.current.on("connected", () => {
      setSocketConnected(true);
      console.log("✅ Socket connected successfully");
    });

    socket.current.on("joined-chat", (data) => {
      console.log("✅ Successfully joined chat room:", data.chatRoomId);
    });

    socket.current.on("receive-message", (newMessage) => {
      console.log("📩 Received message:", newMessage);
      
      setMessages((prev) => {
        const exists = prev.some(m => m._id === newMessage._id);
        if (exists) {
          console.log("⚠️ Duplicate message detected, ignoring");
          return prev;
        }
        console.log("✅ Adding new message to state");
        return [...prev, newMessage];
      });
      setIsTyping(false);
    });

    socket.current.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });

    socket.current.on("user-typing", (data) => {
      console.log("✍️ User is typing:", data.userId);
      if (selectedChatRef.current) {
        const currentChatId = selectedChatRef.current._id || selectedChatRef.current.id;
        if (data.userId === currentChatId) {
          setIsTyping(true);
        }
      }
    });

    socket.current.on("user-stop-typing", (data) => {
      console.log("🛑 User stopped typing:", data.userId);
      if (selectedChatRef.current) {
        const currentChatId = selectedChatRef.current._id || selectedChatRef.current.id;
        if (data.userId === currentChatId) {
          setIsTyping(false);
        }
      }
    });

    return () => {
      console.log("🔌 Disconnecting socket");
      socket.current?.off("receive-message");
      socket.current?.off("connected");
      socket.current?.off("joined-chat");
      socket.current?.off("error");
      socket.current?.off("user-typing");
      socket.current?.off("user-stop-typing");
      socket.current?.disconnect();
    };
  }, [senderId]);

  useEffect(() => {
    if (!receiverId || !senderId) return;

    console.log("📋 Chat changed:", {
      receiverId,
      receiverName: selectedChat?.name,
      senderId
    });

    if (selectedChatRef.current) {
      const prevReceiverId = selectedChatRef.current._id || selectedChatRef.current.id;
      socket.current?.emit("leave-chat", {
        senderId: senderId,
        receiverId: prevReceiverId
      });
    }

    selectedChatRef.current = selectedChat;
    fetchMessages();

    socket.current?.emit("join-chat", { 
      senderId: senderId, 
      receiverId: receiverId 
    });

    setIsTyping(false);
    
    return () => {
      if (receiverId && senderId) {
        socket.current?.emit("leave-chat", {
          senderId: senderId,
          receiverId: receiverId
        });
      }
    };
  }, [receiverId, senderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // File management
  const triggerFileSelect = () => {
    fileInputRef.current?.click(); 
  };

  // ✅ Fixed file input handler
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrors({ file: "File size must be less than 5MB" });
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setErrors({}); // Clear any previous errors
    
    console.log('📎 File selected:', {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type
    });
  };

  // ✅ Remove file
  const handleRemoveFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview); // Clean up memory
    }
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });

    if (e.target.value.trim() && receiverId) {
      socket.current?.emit("typing", {
        senderId: senderId,
        receiverId: receiverId
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.current?.emit("stop-typing", {
          senderId: senderId,
          receiverId: receiverId
        });
      }, 2000);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.message.trim() && !file) {
      newErrors.message = "Please enter a message or select a file";
    }
    return newErrors;
  };

  // ✅ Fixed send message with better error handling
  const handleSendMessage = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.current?.emit("stop-typing", {
      senderId: senderId,
      receiverId: receiverId
    });

    const messageText = formData.message;
    const fileToSend = file;
    const previewUrl = preview;
    
    // Clear input immediately for better UX
    setFormData({ message: "" });
    setFile(null);
    setPreview(null);
    setIsUploading(true); // ✅ Show loading state

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("receiverId", receiverId);
      formDataToSend.append("senderId", senderId);
      formDataToSend.append("message", messageText);
      
      if (fileToSend) {
        formDataToSend.append("file", fileToSend);
      }

      // ✅ Proper way to log FormData
      console.log('📤 Sending message:', {
        receiverId,
        senderId,
        message: messageText,
        hasFile: !!fileToSend,
        fileName: fileToSend?.name,
        fileSize: fileToSend?.size,
        fileType: fileToSend?.type
      });

      const response = await fetch(`${ENDPOINT}/api/messages/send`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Message saved to database:", data.data);

        socket.current.emit("send-message", {
          receiverId: receiverId,
          senderId: senderId,
          message: data.data,
        });

        setMessages((prev) => {
          const exists = prev.some(m => m._id === data.data._id);
          if (!exists) {
            return [...prev, data.data];
          }
          return prev;
        });
      } else {
        console.error("❌ Message sending failed:", data.message);
        setErrors({ send: data.message || "Failed to send message" });
        
        // Restore on error
        setFormData({ message: messageText });
        setFile(fileToSend);
        setPreview(previewUrl);
      }
    } catch (error) {
      console.error("❌ An error occurred while sending message:", error);
      setErrors({ send: "Network error. Please try again." });
      
      // Restore on error
      setFormData({ message: messageText });
      setFile(fileToSend);
      setPreview(previewUrl);
    } finally {
      setIsUploading(false); // ✅ Hide loading state
    }
  };

  if (!selectedChat) {
    return (
      <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageCircle className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a chat</h3>
          <p className="text-gray-500 text-sm">Choose a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col bg-white ${
      isMobileView ? 'fixed inset-0 z-50' : ''
    }`}>
      {/* Header - Keep as is */}
      <div className="p-3 md:p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isMobileView && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0"
              onClick={onBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-lg text-white font-semibold">
              {selectedChat.avatar}
            </div>
            {selectedChat.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 truncate">{selectedChat.name}</h2>
            <p className="text-xs text-gray-500 truncate">
              {isTyping ? (
                <span className="text-green-600 font-medium">typing...</span>
              ) : selectedChat.online ? (
                'Online'
              ) : (
                selectedChat.time
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-1 md:gap-2 flex-shrink-0">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100">
            <Phone className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100">
            <Video className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100 hidden md:inline-flex">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100">
            <MoreVertical className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>

      {/* Messages - ✅ Enhanced to show files */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        {messages.length > 0 ? (
          <>
            {messages.map((msg) => {
              const msgSenderId = typeof msg.senderId === 'object' 
                ? msg.senderId._id 
                : msg.senderId;
              
              const isMyMessage = msgSenderId === senderId;
              
              return (
                <div
                  key={msg._id}
                  className={`flex ${isMyMessage ? "justify-end" : "justify-start"} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-lg shadow-sm ${
                      isMyMessage
                        ? "bg-green-500 text-white rounded-br-none"
                        : "bg-white text-gray-900 rounded-bl-none"
                    }`}
                  >
                    {/* ✅ Show file if exists */}
                    {msg.fileUrl && (
                      <div className="mb-2">
                        {msg.fileType === 'image' ? (
                          <img 
                            src={msg.fileUrl} 
                            alt="Shared image" 
                            className="rounded max-w-full h-auto max-h-60 object-cover cursor-pointer"
                            onClick={() => window.open(msg.fileUrl, '_blank')}
                          />
                        ) : (
                          <a 
                            href={msg.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 p-2 rounded ${
                              isMyMessage ? 'bg-green-600' : 'bg-gray-100'
                            }`}
                          >
                            <FileText className="h-5 w-5" />
                            <span className="text-sm">Open File</span>
                          </a>
                        )}
                      </div>
                    )}
                    
                    {/* Message text */}
                    {msg.message && (
                      <p className="text-sm break-words whitespace-pre-wrap">{msg.message}</p>
                    )}
                    
                    <div className={`text-xs mt-1 ${isMyMessage ? 'text-green-100' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <MessageCircle className="h-16 w-16 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No messages yet</p>
            <p className="text-gray-400 text-xs mt-1">Start the conversation!</p>
          </div>
        )}
      </div>

      {/* Input - ✅ Fixed preview placement */}
      <div className="p-3 md:p-4 border-t border-gray-300 bg-white">
        {/* ✅ Preview inside input container */}
        {preview && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              {file?.type.startsWith('image/') ? (
                <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded" />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                  <FileText className="h-8 w-8 text-gray-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file?.name}</p>
                <p className="text-xs text-gray-500">
                  {(file?.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRemoveFile}
                className="h-8 w-8 text-red-500 hover:bg-red-50 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ✅ Error display */}
        {errors.send && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs">
            {errors.send}
          </div>
        )}
        {errors.file && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs">
            {errors.file}
          </div>
        )}

        <div className="flex gap-2 items-end">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0 hidden md:inline-flex">
            <Smile className="h-5 w-5" />
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.txt"
            className="hidden"
          />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={triggerFileSelect}
            disabled={isUploading}
            className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0 disabled:opacity-50"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              name="message"
              placeholder="Type a message"
              value={formData.message}
              onChange={handleChange}
              disabled={isUploading}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isUploading) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            />
          </div>
          
          {formData.message.trim() || file ? (
            <Button
              onClick={handleSendMessage}
              disabled={isUploading}
              size="icon"
              className="h-9 w-9 rounded-full bg-green-500 hover:bg-green-600 text-white flex-shrink-0 disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              disabled={isUploading}
              className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0"
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {errors.message && (
          <p className="text-red-500 text-xs mt-2">{errors.message}</p>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;