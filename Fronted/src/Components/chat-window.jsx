// Chat Window Component
import { useState, useRef, useEffect } from "react";
import { Send, Phone, Video, Search, MoreVertical, Menu, MessageCircle, Users, Settings, ArrowLeft, Paperclip, Smile, Mic } from "lucide-react";
import io from "socket.io-client";

import  Button  from "./Button.jsx";
function ChatWindow({ selectedChat, onBack, isMobileView }) {
  const [errors, setErrors] = useState({});
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [formData, setFormData] = useState({ message: "" });
  const messagesEndRef = useRef(null);
  const socket = useRef(null);
  const selectedChatRef = useRef(null); // ✅ persistent reference

  const ENDPOINT = "http://localhost:4000";
  const id = selectedChat?._id || selectedChat?.id || null;
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // ✅ Fetch messages
  const fetchMessages = async () => {
    if (!id) return;
    try {
      const response = await fetch(`${ENDPOINT}/api/messages/get/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const result = await response.json();
      if (result.status) {
        setMessages(result.data);
        socket.current?.emit("join-chat", id);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  // ✅ Initialize socket connection
  useEffect(() => {
    socket.current = io(ENDPOINT);
    socket.current.emit("setup", userId); // safer custom event
    socket.current.on("connect", () => setSocketConnected(true));

    return () => socket.current?.disconnect();
  }, [userId]);

  // ✅ Fetch messages when chat changes
  useEffect(() => {
    fetchMessages();
    selectedChatRef.current = selectedChat;
  }, [id]);

  // ✅ Listen for new messages
  useEffect(() => {
    socket.current?.on("receive-message", (newMessage) => {
      if (!selectedChatRef.current || newMessage.chatId !== selectedChatRef.current.id) return;
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.current?.off("receive-message");
    };
  }, []);

  // ✅ Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Handle message input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  // ✅ Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  // ✅ Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch(`${ENDPOINT}/api/messages/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          chatId: id,
          message: formData.message,
        }),
      });

      const data = await response.json();
      console.log(data);
      console.log(userId);
      if (response.ok) {
        setMessages((prev) => [...prev, data.data]);
        socket.current.emit("send-message", {
          chatId: id,
          senderId: userId,
          content: formData.message,
        });
        setFormData({ message: "" });
      } else {
        console.error(data.message || "Message sending failed");
      }
    } catch (error) {
      console.error("An error occurred while sending message:", error);
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
      {/* Header */}
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
              {selectedChat.online ? 'Online' : selectedChat.time}
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

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        {/* {selectedChat.messages.length > 0 ? (
          <>
            {selectedChat.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"} animate-fadeIn`}>
                <div
                  className={`max-w-[75%] md:max-w-xs lg:max-w-md px-3 py-2 rounded-lg shadow-sm ${
                    msg.isOwn
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-white text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm break-words whitespace-pre-wrap">{msg.text}</p>
                  {msg.link && (
                    <a
                      href={msg.link}
                      className={`text-xs underline mt-1 block hover:opacity-80 ${
                        msg.isOwn ? "text-green-100" : "text-green-600"
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {msg.link}
                    </a>
                  )}
                  <div className={`flex items-center gap-1 mt-1 ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                    <p className={`text-xs ${msg.isOwn ? "text-green-100" : "text-gray-500"}`}>
                      {msg.time}
                    </p>
                    {msg.isOwn && (
                      <span className="text-xs text-green-100">✓✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))} */}
            {messages.length > 0 ? (
          <>
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex ${msg.sender?._id === userId ? "justify-end" : "justify-start"} animate-fadeIn`}
              >
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-lg shadow-sm ${
                    msg.sender?._id === localStorage.getItem("userId")
                      ? "bg-green-500 text-white rounded-br-none"
                      : "bg-white text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm break-words whitespace-pre-wrap">{msg.message}</p>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
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

      {/* Input */}
      <div className="p-3 md:p-4 border-t border-gray-300 bg-white">
        <div className="flex gap-2 items-end">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0 hidden md:inline-flex">
            <Smile className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0 md:hidden">
            <Paperclip className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <input
              type="text"
              name="message"
              placeholder="Type a message"
              value={formData.message}
              onChange={handleChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {formData.message.trim() ? (
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="h-9 w-9 rounded-full bg-green-500 hover:bg-green-600 text-white flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
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