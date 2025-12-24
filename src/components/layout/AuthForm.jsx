import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/api";
import ForgotPassword from "../auth/ForgotPassword";
import toast from "react-hot-toast";

export default function AuthForm() {
  const navigate = useNavigate();

  // const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const isLogin = location.pathname === "/login";

  useEffect(() => {
    setIsOtpStage(false);
    setOtp("");
  }, [location.pathname]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",   // ⭐ fixed key
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ⭐ LOGIN OR SEND OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ⭐ LOGIN
    if (isLogin) {
      try {
        const res = await api.post("/user/login", {
          email: formData.email,
          password: formData.password,
        });
        
        

        if (res.data.status === "success") {
          navigate("/dashboard");
        } else {
          // alert(res.data.message);
          toast.error(res.data.message)
        }
      } catch {
        // alert("Invalid email or password");
        toast.error("Invalid email or password")

      }

      setLoading(false);
      return;
    }

    // ⭐ SIGNUP → SEND OTP
    try {

      // console.log("OTP SEND PAYLOAD:", {
      //   name: formData.name,
      //   email: formData.email,
      //   phone_number: formData.phone_number,
      //   password: formData.password,
      // });

      const res = await api.post("/otp/send", {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,  // ⭐ correct key
        password: formData.password,
      });
      // console.log(res)

      if (res.data.status === "success") {
        setIsOtpStage(true);

      }
      else {
        // alert(res.data.message);
        toast.error(res.data.message)

      }
    } catch (err) {
      // alert(err?.response?.data?.message || "Failed to send OTP");
      toast.error(err?.response?.data?.message || "Failed to send OTP")

    }

    setLoading(false);
  };

  // ⭐ OTP VERIFY
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/otp/verify", {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number, // ⭐ correct key
        password: formData.password,
        otp,
      });

      if (res.data.status === "success") {
        navigate("/dashboard");
        toast.success("singup successfully")

      } else {
        // alert(res.data.message);
        toast.error(res.data.message)

      }
    } catch {
      // alert("Invalid OTP");
      toast.error("Invalid otp")

    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">

        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isOtpStage ? "Verify OTP" : isLogin ? "Sign In" : "Create Account"}
        </h2>

        {/* STEP 1 — Login / Signup */}
        {!isOtpStage && (
          <form onSubmit={handleSubmit} className="space-y-5">

            {!isLogin && (
              <div>
                <label className="block mb-1 font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block mb-1 font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg pl-10 p-2"
                  required
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block mb-1 font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    name="phone_number"               // ⭐ fixed
                    value={formData.phone_number}     // ⭐ fixed
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 p-2"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 pl-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3" 
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              {loading ? "Please Wait..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => navigate(isLogin ? "/signup" : "/login")}
                  className="text-blue-600 ml-1"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>

              {isLogin && (
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-blue-600 text-sm"
                >
                  Forgot Password?
                </button>
              )}
            </div>


          </form>
        )}

        {/* STEP 2 — OTP Verify */}
        {isOtpStage && (
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
            <p className="text-gray-600 text-sm">
              Enter the OTP sent to <br />
              <span className="text-blue-600 font-medium">{formData.email}</span>
            </p>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-center text-xl tracking-widest"
              required
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsOtpStage(false)}
                className="w-full bg-gray-300 py-2 rounded-lg"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg"
              >
                Verify OTP
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
