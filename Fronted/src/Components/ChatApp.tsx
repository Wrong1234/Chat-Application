import { useEffect, useState } from "react"
import { useChatContext } from "../context/ChatContext"
import { useAuthContext } from "../context/AuthContext"
import { useSocket } from "../hooks/useSocket"
import Sidebar from "./Sidebar"
import ChatWindow from "./ChatWindow"

export default function ChatApp() {
  const { selectedChat, setSelectedChat } = useChatContext()
  const { currentUser } = useAuthContext()
  const [isMobile, setIsMobile] = useState(false)
  const { on } = useSocket(currentUser?._id)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Listen to socket events
  useEffect(() => {
    on("receive-message", (newMessage) => {
      console.log("New message received:", newMessage)
    })

    on("user-typing", (data) => {
      console.log("User typing:", data)
    })
  }, [on])

  const handleBackToList = () => {
    setSelectedChat(null)
  }

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
  )
}
