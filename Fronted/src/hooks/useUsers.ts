import { useQuery } from "@tanstack/react-query"
import { fetchAPI } from "../config/api"

interface ChatUser {
  id: string
  _id: string
  name: string
  message: string
  time: string
  avatar: string
  unread: number
  online: boolean
  isGroup: boolean
  isFavourite: boolean
}

export const useUsers = () => {
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetchAPI("/auth/users")
      return (response.data || []).map((user: any) => ({
        id: user._id,
        _id: user._id,
        name: user.fullName,
        message: user.about || "Hey there!",
        time: "Online recently",
        avatar: user.avatar || "👤",
        unread: 0,
        online: user.isOnline || false,
        isGroup: false,
        isFavourite: false,
      }))
    },
    staleTime: 5 * 60 * 1000,
  })

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,
    refetch: usersQuery.refetch,
  }
}
