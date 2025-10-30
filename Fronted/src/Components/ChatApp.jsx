import { useState } from "react";
import Sidebar from "./sidebar.jsx"
import ChatWindow from "./chat-window.jsx"

export default function ChatApp() {
  const [selectedChat, setSelectedChat] = useState(0)

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar selectedChat={selectedChat} onSelectChat={setSelectedChat} />
      <ChatWindow selectedChat={selectedChat} />
    </div>
  )
}
