import { useEffect, useState } from "react";
import { Send, Phone, Video, Search, MoreVertical } from "lucide-react";
import { Button } from "./Button.jsx";
import io from 'socket.io-client';

const MESSAGES = [
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
];


const EndPoint = "http://localhost:4000";
var socket;
export default function ChatWindow({ selectedChat }) {
  
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 2) {
      newErrors.message = 'Message must be at least 2 characters';
    }

    return newErrors;
  };

  const handleSendMessage = async(e) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log('Form data:', formData);

    try {
      const response = await fetch('http://localhost:4000/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
           Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          chatId: "6902393b03abade999de6cc7",
          message: formData.message,
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("message sent successfully", data);
        
        // Clear form
        setFormData({
          message: ""
        });
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          console.error(data.message || 'Message sending failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('An error occurred. Please try again.', error);
    } 
  };

  useEffect(() =>{
    socket = io(EndPoint);
  }, []);

  return (
    <div className="hidden md:flex flex-1 flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
        <div>
          <h2 className="font-semibold text-gray-900">{ selectedChat.name}</h2>
          <p className="text-xs text-gray-500">{ selectedChat.time }</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600 hover:bg-gray-100">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
        {MESSAGES.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.isOwn
                  ? "bg-green-500 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-900 rounded-bl-none"
              }`}
            >
              <p className="text-sm break-words">{msg.text}</p>
              {msg.link && (
                <a
                  href={msg.link}
                  className={`text-xs underline mt-1 block hover:opacity-80 ${
                    msg.isOwn ? "text-green-100" : "text-green-600"
                  }`}
                >
                  {msg.link}
                </a>
              )}
              <p className={`text-xs mt-1 ${msg.isOwn ? "text-green-100" : "text-gray-500"}`}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
          <input
            type="text"
            name="message"
            placeholder="Type a message"
            value={formData.message}
            onChange={handleChange}
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 rounded-full bg-green-500 hover:bg-green-600 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        {errors.message && (
          <p className="text-red-500 text-xs mt-2">{errors.message}</p>
        )}
      </div>
    </div>
  );
}