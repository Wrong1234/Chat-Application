import { User, Lock, Bell, HelpCircle, ChevronRight, LogOut, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuthContext } from "../context/AuthContext"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  user: any
}

export default function SettingsPanel({ isOpen, onClose, user }: SettingsPanelProps) {
  const navigate = useNavigate()
  const { logout } = useAuthContext()

  if (!isOpen) return null

  const settingsOptions = [
    { icon: User, label: "Account", description: "Privacy, security, change number" },
    { icon: Lock, label: "Privacy", description: "Block contacts, disappearing messages" },
    { icon: Bell, label: "Notifications", description: "Message, group & call tones" },
    { icon: HelpCircle, label: "Help", description: "Help center, contact us, privacy policy" },
  ]

  const handleLogout = async () => {
    await logout.mutateAsync()
    navigate("/login")
  }

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition h-9 w-9 flex items-center justify-center"
        >
          <X className="h-5 w-5 hover:text-red-500" />
        </button>
        <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
      </div>

      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <img
            src={user?.profileImage || `https://ui-avatars.com/api/?&background=10b981&color=fff&size=80`}
            className="w-16 h-16 rounded-full object-cover"
            alt="Profile"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{user?.fullName || "John Doe"}</h3>
            <p className="text-sm text-gray-500">{user?.status || "Hey there! I'm using this chat app"}</p>
          </div>
        </div>
      </div>

      {/* Settings Options */}
      <div className="flex-1 overflow-y-auto">
        {settingsOptions.map((option, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-4 p-4 hover:bg-gray-100 transition-colors border-b border-gray-100"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <option.icon className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-medium text-gray-900">{option.label}</h4>
              <p className="text-xs text-gray-500">{option.description}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={logout.isPending}
          className="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors mt-4 disabled:opacity-50"
        >
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <LogOut className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-medium text-red-600">Log out</h4>
          </div>
        </button>
      </div>
    </div>
  )
}
