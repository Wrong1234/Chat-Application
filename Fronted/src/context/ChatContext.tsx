// import type React from "react"
// import { createContext, useContext, useState } from "react"

// interface ChatContextType {
//   selectedChat: any
//   setSelectedChat: (chat: any) => void
//   activeTab: string
//   setActiveTab: (tab: string) => void
//   searchQuery: string
//   setSearchQuery: (query: string) => void
//   typingUsers: Record<string, boolean>
//   setUserTyping: (userId: string, isTyping: boolean) => void
// }

// const ChatContext = createContext<ChatContextType | undefined>(undefined)

// export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [selectedChat, setSelectedChat] = useState(null)
//   const [activeTab, setActiveTab] = useState("all")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({})

//   const setUserTyping = (userId: string, isTyping: boolean) => {
//     setTypingUsers((prev) => ({ ...prev, [userId]: isTyping }))
//   }

//   return (
//     <ChatContext.Provider
//       value={{
//         selectedChat,
//         setSelectedChat,
//         activeTab,
//         setActiveTab,
//         searchQuery,
//         setSearchQuery,
//         typingUsers,
//         setUserTyping,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   )
// }

// export const useChatContext = () => {
//   const context = useContext(ChatContext)
//   if (!context) {
//     throw new Error("useChatContext must be used within ChatProvider")
//   }
//   return context
// }



import type React from "react"
import { createContext, useContext, useState } from "react"

interface ChatContextType {
  selectedChat: any
  setSelectedChat: (chat: any) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  typingUsers: Record<string, boolean>
  setUserTyping: (userId: string, isTyping: boolean) => void
  onlineUsers: Record<string, boolean>
  setUserOnline: (userId: string, isOnline: boolean) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({})
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({})

  const setUserTyping = (userId: string, isTyping: boolean) => {
    setTypingUsers((prev) => ({ ...prev, [userId]: isTyping }))
  }

  const setUserOnline = (userId: string, isOnline: boolean) => {
    setOnlineUsers((prev) => ({ ...prev, [userId]: isOnline }))
  }

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        typingUsers,
        setUserTyping,
        onlineUsers,
        setUserOnline,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider")
  }
  return context
}