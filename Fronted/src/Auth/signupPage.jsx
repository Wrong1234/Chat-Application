
//   const passwordStrength =
//     formData.password.length >= 8
//       ? "strong"
//       : formData.password.length >= 4
//       ? "medium"
//       : "weak";
//         {/* Password Input */}
//         <div className="space-y-2">
//           <label htmlFor="password" className="text-sm font-medium text-foreground">
//             Password
//           </label>
//           <div className="relative">
//             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
//             <input
//               id="password"
//               name="password"
//               type={showPassword ? "text" : "password"}
//               placeholder="••••••••"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full pl-10 pr-12 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
//             >
//               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//           </div>
//           {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}

//           {formData.password && (
//             <>
//               <div className="flex gap-1 mt-2">
//                 {[1, 2, 3].map((i) => (
//                   <div
//                     key={i}
//                     className={`h-1 flex-1 rounded-full transition-smooth ${
//                       i <= (passwordStrength === "strong" ? 3 : passwordStrength === "medium" ? 2 : 1)
//                         ? "bg-primary"
//                         : "bg-border"
//                     }`}
//                   />
//                 ))}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 {passwordStrength === "strong" && "Strong password"}
//                 {passwordStrength === "medium" && "Medium strength"}
//                 {passwordStrength === "weak" && "Weak password - use at least 8 characters"}
//               </p>
//             </>
//           )}
//         </div>

//         {/* Confirm Password */}
//         <div className="space-y-2">
//           <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
//             Confirm password
//           </label>
//           <div className="relative">
//             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
//             <input
//               id="confirmPassword"
//               name="confirmPassword"
//               type={showConfirmPassword ? "text" : "password"}
//               placeholder="••••••••"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               className="w-full pl-10 pr-12 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
//             >
//               {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//           </div>
//           {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}

//           {formData.password && formData.confirmPassword && (
//             <div className="flex items-center gap-2 text-xs">
//               {formData.password === formData.confirmPassword ? (
//                 <>
//                   <Check className="w-4 h-4 text-primary" />
//                   <span className="text-primary">Passwords match</span>
//                 </>
//               ) : (
//                 <>
//                   <div className="w-4 h-4 rounded-full border-2 border-destructive" />
//                   <span className="text-destructive">Passwords don't match</span>
//                 </>
//               )}
//             </div>
//           )}
//         </div>


// Auth/SignupForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, Phone, MessageCircle } from "lucide-react";
import { useRegisterMutation } from "../store/api/authApi";
import { setCredentials } from "../store/slices/authSlice";

function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.length < 2) newErrors.name = "Name must be at least 2 characters";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";

    if (formData.phone && !/^(\+?880|0)?1[3-9]\d{8}$/.test(formData.phone.replace(/[\s\-()]/g, ""))) {
      newErrors.phone = "Please enter a valid Bangladeshi phone number";
    }

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const result = await register({
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        phone: formData.phone,
        role: "users",
      }).unwrap();

      setMessage("Account created successfully! Welcome aboard.");

      dispatch(
        setCredentials({
          user: result.user,
          token: result.token,
        })
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
      });

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Registration error:", err);
      if (err.data?.errors) setErrors(err.data.errors);
      else setMessage(err.data?.message || "Registration failed. Please try again.");
    }
  };

  const passwordStrength =
    formData.password.length >= 8
      ? "strong"
      : formData.password.length >= 4
      ? "medium"
      : "weak";

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-gray-50">
      <div className="relative z-10 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl">
          {/* Header Icon */}
          <div className="flex items-center justify-center mb-6">
            <MessageCircle className="w-8 h-8 text-blue-600" />
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Join us today</h1>
            <p className="text-sm text-gray-500">Connect with friends and family</p>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-xl text-center mb-6 font-medium text-sm ${
                message.includes("success")
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message}
            </div>
          )}

          {/* Errors */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                placeholder="+8801XXXXXXXXX"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-2.5 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none ${
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

            {/* Confirm Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-2.5 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || formData.password !== formData.confirmPassword}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Create account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-bold text-blue-600 hover:text-blue-700"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
