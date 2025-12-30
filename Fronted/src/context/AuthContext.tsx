import type React from "react"
import { createContext, useContext } from "react"
import { useAuth } from "../hooks/useAuth"

interface AuthContextType {
  currentUser: any
  token: string | null
  isAuthenticated: boolean
  login: any
  register: any
  logout: any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider")
  }
  return context
}
