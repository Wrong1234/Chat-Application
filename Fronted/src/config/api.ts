// API Configuration for TanStack Query
export const API_BASE_URL = "https://chat-application-vvl3.onrender.com/api"
export const SOCKET_URL = "https://chat-application-vvl3.onrender.com"

// API Headers helper
export const getHeaders = () => {
  const token = localStorage.getItem("token")
 
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Fetch wrapper with error handling
export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: getHeaders(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "API request failed")
  }

  return response.json()
}
