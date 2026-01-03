import { FileText } from "lucide-react"

interface MessageBubbleProps {
  message: {
    _id: string
    message: string
    fileUrl?: string
    fileType?: "image" | "file"
    createdAt: string
  }
  isOwn: boolean
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} animate-fadeIn`}>
      <div
        className={`max-w-[75%] px-3 py-2 rounded-lg shadow-sm ${
          isOwn ? "bg-green-500 text-white rounded-br-none" : "bg-white text-gray-900 rounded-bl-none"
        }`}
      >
        {message.fileUrl && (
          <div className="mb-2">
            {message.fileType === "image" ? (
              <img
                src={message.fileUrl || "/placeholder.svg"}
                alt="Shared image"
                className="rounded max-w-full h-auto max-h-60 object-cover cursor-pointer"
                onClick={() => window.open(message.fileUrl, "_blank")}
              />
            ) : (
              
               <a href={message.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 p-2 rounded ${isOwn ? "bg-green-600" : "bg-gray-100"}`}
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm">Open File</span>
              </a>
            )}
          </div>
        )}
        {message.message && <p className="text-sm break-words whitespace-pre-wrap">{message.message}</p>}
        <div className={`text-xs mt-1 ${isOwn ? "text-green-100" : "text-gray-400"}`}>
          {formatTime(message.createdAt)}
        </div>
      </div>
    </div>
  )
}