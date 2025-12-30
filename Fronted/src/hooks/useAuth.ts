// import { useMutation, useQueryClient } from "@tanstack/react-query"
// import { fetchAPI } from "../config/api"

// interface User {
//   _id: string
//   fullName: string
//   email: string
//   avatar?: string
//   isOnline: boolean
// }

// interface AuthResponse {
//   accessToken: string
//   refreshToken: string
//   user: User
// }

// export const useAuth = () => {
//   const queryClient = useQueryClient()

//   // Get current user from localStorage
//   const getCurrentUser = (): User | null => {
//     const user = localStorage.getItem("user")
//     return user ? JSON.parse(user) : null
//   }

//   // Get token from localStorage
//   const getToken = () => localStorage.getItem("token")

//   // Login mutation
//   const loginMutation = useMutation({
//     mutationFn: (credentials: { email: string; password: string }) =>
//       fetchAPI("/auth/login", {
//         method: "POST",
//         body: JSON.stringify(credentials),
//       }),
//     onSuccess: (data: AuthResponse) => {
//       localStorage.setItem("token", data.accessToken)
//       localStorage.setItem("refreshToken", data.refreshToken)
//       localStorage.setItem("user", JSON.stringify(data.user))
//       queryClient.setQueryData(["currentUser"], data.user)
//     },
//   })

//   // Register mutation
//   const registerMutation = useMutation({
//     mutationFn: (data: { fullName: string; email: string; password: string }) =>
//       fetchAPI("/auth/register", {
//         method: "POST",
//         body: JSON.stringify(data),
//       }),
//     onSuccess: (data: AuthResponse) => {
//       localStorage.setItem("token", data.accessToken)
//       localStorage.setItem("user", JSON.stringify(data.user))
//       queryClient.setQueryData(["currentUser"], data.user)
//     },
//   })

//   // Logout mutation
//   const logoutMutation = useMutation({
//     mutationFn: async () => {
//       localStorage.removeItem("token")
//       localStorage.removeItem("refreshToken")
//       localStorage.removeItem("user")
//     },
//     onSuccess: () => {
//       queryClient.clear()
//     },
//   })

//   return {
//     currentUser: getCurrentUser(),
//     token: getToken(),
//     login: loginMutation,
//     register: registerMutation,
//     logout: logoutMutation,
//     isAuthenticated: !!getToken(),
//   }
// }


import { useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchAPI } from "../config/api"

interface User {
  _id: string
  fullName: string
  email: string
  avatar?: string
  isOnline: boolean
}

interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export const useAuth = () => {
  const queryClient = useQueryClient()

  // Safe parse function
  const safeJSONParse = <T>(value: string | null): T | null => {
    if (!value) return null
    try {
      return JSON.parse(value)
    } catch {
      localStorage.removeItem("user") // remove invalid value
      return null
    }
  }

  // Get current user from localStorage
  const getCurrentUser = (): User | null => {
    const user = localStorage.getItem("user")
    return safeJSONParse<User>(user)
  }

  // Get token from localStorage
  const getToken = () => localStorage.getItem("token")

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      fetchAPI("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: (response: any) => {
      const { accessToken, refreshToken, user } = response.data

      if (accessToken) localStorage.setItem("token", accessToken)
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken)
      if (user) localStorage.setItem("user", JSON.stringify(user))

      queryClient.setQueryData(["currentUser"], user)
    }
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: { fullName: string; email: string; password: string }) =>
      fetchAPI("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem("token", data.accessToken)
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
      }
      queryClient.setQueryData(["currentUser"], data.user)
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem("token")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })

  return {
    currentUser: getCurrentUser(),
    token: getToken(),
    login: loginMutation,
    register: registerMutation,
    logout: logoutMutation,
    isAuthenticated: !!getToken(),
  }
}

