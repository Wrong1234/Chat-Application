import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Phone } from "lucide-react"
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false) // Fixed: was "Loading"
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "", // Fixed: consistent naming
    phone: "",
  })

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // FIXED: This was backwards - should only validate if phone has a value
    if (formData.phone && !/^(\+?880|0)?1[3-9]\d{8}$/.test(formData.phone.replace(/[\s\-()]/g, ''))) {
      newErrors.phone = 'Please enter a valid Bangladeshi phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // FIXED: Use confirmPassword instead of password_confirmation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrors({});
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    console.log('Form data:', formData);
    
    try {
      // FIXED: Uncommented the API call
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword, // Fixed: was undefined
          phone: formData.phone, // Fixed: was phoneNumber
          role: "users",
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Account created successfully! Welcome aboard.');
        console.log('Token:', data.token);
        console.log('User:', data.user);
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '', // Fixed: consistent naming
          phone: '',
        });

        navigate('/login');
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setMessage(data.message || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false); // FIXED: Always set loading to false
    }
  };

  const passwordStrength =
    formData.password.length >= 8
      ? "strong"
      : formData.password.length >= 4
      ? "medium"
      : "weak"

  return (
    <div className="space-y-5 space-x-1 w-md mx-auto p-10 shadow-amber-600 border mt-6 rounded-2xl mb-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-foreground">Create account</h1>
        <p className="text-muted-foreground">Join us today and get started</p>
      </div>

      {/* ADDED: Success/Error Message Display */}
      {message && (
        <div className={`p-3 rounded-lg text-center ${
          message.includes('success') 
            ? 'bg-green-100 text-green-800 border border-green-300' 
            : 'bg-red-100 text-red-800 border border-red-300'
        }`}>
          {message}
        </div>
      )}

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
          {/* ADDED: Error display */}
          {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
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
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Phone number (optional)
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              placeholder="+8801XXXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
            />
          </div>
          {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
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
          {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}

          {/* Password Strength Indicator */}
          {formData.password && (
            <>
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
            </>
          )}
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
          {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}

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
          disabled={loading || formData.password !== formData.confirmPassword}
          className="w-full py-3 px-4 bg-amber-400 from-primary cursor-pointer to-accent text-primary-foreground font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
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

      {/* Switch to Login */}
      <p className="text-center text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          className="text-primary cursor-pointer font-semibold hover:text-accent transition-smooth"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}