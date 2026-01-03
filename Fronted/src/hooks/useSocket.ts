import { useEffect, useRef, useCallback } from "react"
import io, { type Socket } from "socket.io-client"
import { SOCKET_URL } from "../config/api"

export const useSocket = (userId: string | null) => {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!userId) return

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    socketRef.current.emit("join", userId)
    

    return () => {
      socketRef.current?.disconnect()
    }
  }, [userId])

  const on = useCallback((event: string, handler: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler)
    }
  }, [])

  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data)
    }
  }, [])

  const off = useCallback((event: string) => {
    if (socketRef.current) {
      socketRef.current.off(event)
    }
  }, [])

  // return { on, emit, off }
   return { socket: socketRef.current, on, emit, off }
}
