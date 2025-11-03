// Components/ChatWindow.jsx
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Send,
  Phone,
  Video,
  Search,
  MoreVertical,
  ArrowLeft,
  Paperclip,
  Smile,
  Mic,
  MessageCircle,
  X,
  Loader2,
  FileText,
} from "lucide-react";
import Button from "./Button.jsx";
import { useGetMessagesQuery, useSendMessageMutation } from "../store/api/messageApi.js";
import { useSocketEmit } from "../hooks/useSocket";
import { selectCurrentUser } from "../store/slices/authSlice.js";
import { selectSelectedChat, selectIsUserTyping } from "../store/slices/chatSlice.js";

function ChatWindow({ onBack, isMobileView }) {
  const dispatch = useDispatch();
  const selectedChat = useSelector(selectSelectedChat);
  const user = useSelector(selectCurrentUser);
  const isTyping = useSelector(selectIsUserTyping(selectedChat?._id || selectedChat?.id));
  
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ message: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const receiverId = selectedChat?._id || selectedChat?.id || null;
  const senderId = user?._id;

  // RTK Query hooks
  const { data: messages = [], isLoading } = useGetMessagesQuery(receiverId, {
    skip: !receiverId,
  });
  
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  // Socket emit functions
  const socketEmit = useSocketEmit();

  // Join/leave chat room
  useEffect(() => {
    if (!receiverId || !senderId) return;

    console.log("📋 Joining chat:", receiverId);
    socketEmit.joinChat(senderId, receiverId);

    return () => {
      console.log("📋 Leaving chat:", receiverId);
      socketEmit.leaveChat(senderId, receiverId);
    };
  }, [receiverId, senderId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrors({ file: "File size must be less than 5MB" });
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setErrors({});

    console.log("📎 File selected:", {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
    });
  };

  const handleRemoveFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });

    if (e.target.value.trim() && receiverId) {
      socketEmit.typing(senderId, receiverId);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socketEmit.stopTyping(senderId, receiverId);
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
    socketEmit.stopTyping(senderId, receiverId);

    const messageText = formData.message;
    const fileToSend = file;

    // Clear input immediately
    setFormData({ message: "" });
    setFile(null);
    setPreview(null);

    try {
      const result = await sendMessage({
        receiverId,
        senderId,
        message: messageText,
        file: fileToSend,
      }).unwrap();

      console.log("✅ Message sent:", result);

      // Emit via socket for real-time delivery
      socketEmit.sendMessage({
        receiverId,
        senderId,
        message: result,
      });
    } catch (error) {
      console.error("❌ Send failed:", error);
      setErrors({ send: error.data?.message || "Failed to send message" });

      // Restore on error
      setFormData({ message: messageText });
      setFile(fileToSend);
      if (fileToSend) {
        setPreview(URL.createObjectURL(fileToSend));
      }
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
    <div
      className={`flex-1 flex flex-col bg-white ${
        isMobileView ? "fixed inset-0 z-50" : ""
      }`}
    >
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
              {isTyping ? (
                <span className="text-green-600 font-medium">typing...</span>
              ) : selectedChat.online ? (
                "Online"
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

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1d5db' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : messages.length > 0 ? (
          <>
            {messages.map((msg) => {
              const msgSenderId =
                typeof msg.senderId === "object" ? msg.senderId._id : msg.senderId;

              const isMyMessage = msgSenderId === senderId;

              return (
                <div
                  key={msg._id}
                  className={`flex ${
                    isMyMessage ? "justify-end" : "justify-start"
                  } animate-fadeIn`}
                >
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-lg shadow-sm ${
                      isMyMessage
                        ? "bg-green-500 text-white rounded-br-none"
                        : "bg-white text-gray-900 rounded-bl-none"
                    }`}
                  >
                    {msg.fileUrl && (
                      <div className="mb-2">
                        {msg.fileType === "image" ? (
                          <img
                            src={msg.fileUrl}
                            alt="Shared image"
                            className="rounded max-w-full h-auto max-h-60 object-cover cursor-pointer"
                            onClick={() => window.open(msg.fileUrl, "_blank")}
                          />
                        ) : (
                          <a
                            href={msg.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 p-2 rounded ${
                              isMyMessage ? "bg-green-600" : "bg-gray-100"
                            }`}
                          >
                            <FileText className="h-5 w-5" />
                            <span className="text-sm">Open File</span>
                          </a>
                        )}
                      </div>
                    )}

                    {msg.message && (
                      <p className="text-sm break-words whitespace-pre-wrap">{msg.message}</p>
                    )}

                    <div
                      className={`text-xs mt-1 ${
                        isMyMessage ? "text-green-100" : "text-gray-400"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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

      {/* Input */}
      <div className="p-3 md:p-4 border-t border-gray-300 bg-white">
        {preview && (
          <div className="mb-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              {file?.type.startsWith("image/") ? (
                <img src={preview} alt="preview" className="w-16 h-16 object-cover rounded" />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                  <FileText className="h-8 w-8 text-gray-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file?.name}</p>
                <p className="text-xs text-gray-500">{(file?.size / 1024).toFixed(2)} KB</p>
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
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0 hidden md:inline-flex"
          >
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
            disabled={isSending}
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
              disabled={isSending}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !isSending) {
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
              disabled={isSending}
              size="icon"
              className="h-9 w-9 rounded-full bg-green-500 hover:bg-green-600 text-white flex-shrink-0 disabled:opacity-50"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              disabled={isSending}
              className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0"
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>

        {errors.message && <p className="text-red-500 text-xs mt-2">{errors.message}</p>}
      </div>
    </div>
  );
}

export default ChatWindow;