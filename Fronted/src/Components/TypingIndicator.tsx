// FILE: TypingIndicator.tsx
export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-2">
      <div className="bg-gray-200 rounded-2xl px-4 py-2 flex items-center gap-2">
        {/* <span className="text-xs text-gray-600">typing</span> */}
        <div className="flex gap-1">
          <div 
            className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" 
            style={{ animationDelay: "0ms", animationDuration: "1s" }} 
          />
          <div 
            className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" 
            style={{ animationDelay: "150ms", animationDuration: "1s" }} 
          />
          <div 
            className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" 
            style={{ animationDelay: "300ms", animationDuration: "1s" }} 
          />
        </div>
      </div>
    </div>
  )
}