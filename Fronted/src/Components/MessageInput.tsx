// import type React from "react"
// import { useState, useRef } from "react"
// import { Send, Paperclip, Smile, Mic, Loader2, X } from "lucide-react"
// import { useMessages } from "../hooks/useMessages"
// import { useAuthContext } from "../context/AuthContext"

// interface MessageInputProps {
//   receiverId: string | null
//   onMessageSent?: () => void
// }

// export default function MessageInput({ receiverId, onMessageSent }: MessageInputProps) {
//   const { currentUser } = useAuthContext()
//   const { sendMessage } = useMessages(receiverId)
//   const [message, setMessage] = useState("")
//   const [file, setFile] = useState<File | null>(null)
//   const [preview, setPreview] = useState<string | null>(null)
//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0]
//     if (!selectedFile) return

//     const maxSize = 10 * 1024 * 1024 // 10MB
//     if (selectedFile.size > maxSize) {
//       setErrors({ file: "File size must be less than 10MB" })
//       return
//     }

//     setFile(selectedFile)
//     if (selectedFile.type.startsWith("image/")) {
//       setPreview(URL.createObjectURL(selectedFile))
//     }
//     setErrors({})
//   }

//   const handleSendMessage = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setErrors({})

//     if (!message.trim() && !file) {
//       setErrors({ message: "Please enter a message or select a file" })
//       return
//     }

//     try {
//       await sendMessage.mutateAsync({
//         receiverId: receiverId!,
//         senderId: currentUser?._id,
//         message,
//         file: file || undefined,
//       })

//       setMessage("")
//       setFile(null)
//       setPreview(null)
//       onMessageSent?.()
//     } catch (error: any) {
//       setErrors({ send: error.message || "Failed to send message" })
//     }
//   }

//   const triggerFileSelect = () => fileInputRef.current?.click()

//   const hasContent = message.trim() || file

//   return (
//     <div className="p-4 bg-white border-t border-gray-200">
//       {preview && (
//         <div className="mb-3 relative inline-block">
//           <img src={preview || "/placeholder.svg"} alt="preview" className="h-20 w-20 object-cover rounded" />
//           <button
//             onClick={() => {
//               setFile(null)
//               setPreview(null)
//             }}
//             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       )}

//       {errors.file && (
//         <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs">{errors.file}</div>
//       )}

//       <form onSubmit={handleSendMessage}>
//         <div className="flex gap-2 items-end">
//           <button
//             type="button"
//             className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0 hidden md:inline-flex rounded"
//           >
//             <Smile className="h-5 w-5" />
//           </button>

//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileChange}
//             accept="image/*,.pdf,.doc,.docx,.txt"
//             className="hidden"
//           />

//           <button
//             type="button"
//             onClick={triggerFileSelect}
//             disabled={sendMessage.isPending}
//             className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0 disabled:opacity-50 rounded inline-flex items-center justify-center"
//           >
//             <Paperclip className="h-5 w-5" />
//           </button>

//           <div className="flex-1 relative">
//             <input
//               type="text"
//               placeholder="Type a message..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               disabled={sendMessage.isPending}
//               onKeyPress={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey && !sendMessage.isPending) {
//                   e.preventDefault()
//                   handleSendMessage(e)
//                 }
//               }}
//               className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
//             />
//           </div>

//           {hasContent ? (
//             <button
//               type="submit"
//               disabled={sendMessage.isPending}
//               className="h-9 w-9 rounded-full bg-green-500 hover:bg-green-600 text-white flex-shrink-0 disabled:opacity-50 inline-flex items-center justify-center transition"
//             >
//               {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//             </button>
//           ) : (
//             <button
//               type="button"
//               disabled={sendMessage.isPending}
//               className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0 rounded inline-flex items-center justify-center"
//             >
//               <Mic className="h-5 w-5" />
//             </button>
//           )}
//         </div>

//         {errors.message && <p className="text-red-500 text-xs mt-2">{errors.message}</p>}
//         {errors.send && <p className="text-red-500 text-xs mt-2">{errors.send}</p>}
//       </form>
//     </div>
//   )
// }



import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Send, Paperclip, Smile, Mic, Loader2, X } from "lucide-react"
import { useMessages } from "../hooks/useMessages"
import { useAuthContext } from "../context/AuthContext"
import { useSocket } from "../hooks/useSocket"

interface MessageInputProps {
  receiverId: string | null
  onMessageSent?: () => void
}

export default function MessageInput({ receiverId, onMessageSent }: MessageInputProps) {
  const { currentUser } = useAuthContext()
  const { sendMessage } = useMessages(receiverId)
  const { emit } = useSocket(currentUser?._id || null)
  
  const [message, setMessage] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isTypingRef = useRef(false)

  
  const handleTyping = useCallback(() => {
    if (!receiverId || !currentUser?._id) return
    if (!isTypingRef.current) {
      emit('typing', {
        senderId: currentUser._id,
        receiverId
      })
      isTypingRef.current = true
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      emit('stop-typing', {
        senderId: currentUser._id,
        receiverId
      })
      isTypingRef.current = false
    }, 2000)
  }, [receiverId, currentUser?._id, emit])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (selectedFile.size > maxSize) {
      setErrors({ file: "File size must be less than 10MB" })
      return
    }

    setFile(selectedFile)
    if (selectedFile.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(selectedFile))
    }
    setErrors({})
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    if (!message.trim() && !file) {
      setErrors({ message: "Please enter a message or select a file" })
      return
    }

    if (isTypingRef.current) {
      emit('stop-typing', {
        senderId: currentUser?._id,
        receiverId
      })
      isTypingRef.current = false
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    try {
      await sendMessage.mutateAsync({
        receiverId: receiverId!,
        senderId: currentUser?._id,
        message,
        file: file || undefined,
      })

      setMessage("")
      setFile(null)
      setPreview(null)
      onMessageSent?.()
    } catch (error: any) {
      setErrors({ send: error.message || "Failed to send message" })
    }
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    handleTyping()
  }

  const triggerFileSelect = () => fileInputRef.current?.click()

  const hasContent = message.trim() || file
  
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      if (isTypingRef.current && receiverId && currentUser?._id) {
        emit('stop-typing', {
          senderId: currentUser._id,
          receiverId
        })
      }
    }
  }, [receiverId, currentUser?._id, emit])

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      {preview && (
        <div className="mb-3 relative inline-block">
          <img src={preview || "/placeholder.svg"} alt="preview" className="h-20 w-20 object-cover rounded" />
          <button
            onClick={() => {
              setFile(null)
              setPreview(null)
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {errors.file && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-xs">{errors.file}</div>
      )}

      <form onSubmit={handleSendMessage}>
        <div className="flex gap-2 items-end">
          <button
            type="button"
            className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0 hidden md:inline-flex rounded"
          >
            <Smile className="h-5 w-5" />
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.txt"
            className="hidden"
          />

          <button
            type="button"
            onClick={triggerFileSelect}
            disabled={sendMessage.isPending}
            className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0 disabled:opacity-50 rounded inline-flex items-center justify-center"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={handleMessageChange} 
              disabled={sendMessage.isPending}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !sendMessage.isPending) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
              className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            />
          </div>

          {hasContent ? (
            <button
              type="submit"
              disabled={sendMessage.isPending}
              className="h-9 w-9 rounded-full bg-green-500 hover:bg-green-600 text-white flex-shrink-0 disabled:opacity-50 inline-flex items-center justify-center transition"
            >
              {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          ) : (
            <button
              type="button"
              disabled={sendMessage.isPending}
              className="h-9 w-9 text-gray-600 hover:bg-gray-100 flex-shrink-0 rounded inline-flex items-center justify-center"
            >
              <Mic className="h-5 w-5" />
            </button>
          )}
        </div>

        {errors.message && <p className="text-red-500 text-xs mt-2">{errors.message}</p>}
        {errors.send && <p className="text-red-500 text-xs mt-2">{errors.send}</p>}
      </form>
    </div>
  )
}