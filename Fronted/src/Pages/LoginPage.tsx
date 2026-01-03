

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, ArrowRight, MessageCircle, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../context/AuthContext"

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthContext()
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email"
    if (!formData.password) newErrors.password = "Password is required"
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setErrors({})

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      await login.mutateAsync({
        email: formData.email,
        password: formData.password,
      })
      setMessage("✓ Login successful! Redirecting...")
      setTimeout(() => navigate("/"), 1500)
    } catch (err: any) {
      setMessage(err.message || "Login failed. Please try again.")
    }
  }

  const hasErrors = Object.keys(errors).length > 0

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-gray-50">
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl">
          <div className="flex items-center justify-center mb-6">
            <MessageCircle className="w-8 h-8 text-blue-600" />
          </div>

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500">Sign in to connect and chat</p>
          </div>

          {message && (
            <div
              className={`p-3 rounded-xl text-center mb-6 font-medium text-sm ${
                message.includes("✓")
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message}
            </div>
          )}

          {hasErrors && !message && (
            <div className="bg-red-50 border border-red-300 rounded-xl p-4 mb-6">
              <ul className="space-y-2">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field} className="text-red-700 text-sm flex gap-2">
                    <span>•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-2.5 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="w-4 h-4 border rounded cursor-pointer accent-blue-600"
              />
              <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-blue-700 transition coursor-pointer"
            >
              {login.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
