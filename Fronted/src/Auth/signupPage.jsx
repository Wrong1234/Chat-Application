import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react"

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  const passwordStrength =
    formData.password.length >= 8
      ? "strong"
      : formData.password.length >= 4
      ? "medium"
      : "weak"

  return (
    <div className="space-y-5 space-x-1 w-md mx-auto p-10 shadow-amber-600 border mt-6 rounded-2xl">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-foreground">Create account</h1>
        <p className="text-muted-foreground">Join us today and get started</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Input */}
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
              required
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          <div className="flex gap-1 mt-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-smooth ${
                  i <=
                  (passwordStrength === "strong"
                    ? 3
                    : passwordStrength === "medium"
                    ? 2
                    : 1)
                    ? "bg-primary"
                    : "bg-border"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {passwordStrength === "strong" && "Strong password"}
            {passwordStrength === "medium" && "Medium strength"}
            {passwordStrength === "weak" && "Weak password - use at least 8 characters"}
          </p>
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
            Confirm password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {formData.password && formData.confirmPassword && (
            <div className="flex items-center gap-2 text-xs">
              {formData.password === formData.confirmPassword ? (
                <>
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-primary">Passwords match</span>
                </>
              ) : (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-destructive" />
                  <span className="text-destructive">Passwords don't match</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2">
          <input
            id="terms"
            type="checkbox"
            className="w-4 h-4 rounded border-border bg-input cursor-pointer accent-primary mt-1"
            required
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
            I agree to the{" "}
            <a href="#" className="text-primary hover:text-accent transition-smooth">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:text-accent transition-smooth">
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || formData.password !== formData.confirmPassword}
          className="w-full py-3 px-4 bg-amber-400 from-primary cursor-pointer to-accent text-primary-foreground font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">

        <div className="relative flex justify-center text-sm pt-4">
          <span className="px-2 bg-background text-muted-foreground">Or sign up with</span>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button className="py-3 px-4 border border-border rounded-lg hover:bg-secondary transition-smooth font-medium text-foreground">
          Google
        </button>
        <button className="py-3 px-4 border border-border rounded-lg hover:bg-secondary transition-smooth font-medium text-foreground">
          GitHub
        </button>
      </div>

      {/* Switch to Login */}
      <p className="text-center text-muted-foreground">
        Already have an account?{" "}
        <button
          className="text-primary cursor-pointer font-semibold hover:text-accent transition-smooth"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}
