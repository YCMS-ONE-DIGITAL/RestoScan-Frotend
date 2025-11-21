import { useEffect,useState } from "react";
import { Eye, EyeOff, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // <-- correct path

export default function AuthForm() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

// // 🔥 PREVENT showing login page if already logged in
useEffect(() => {
  api
    .head("/user/me")
    .then(() => navigate("/dashboard"))
    .catch(() => {});
}, []);




  const handleChange = (e) => {
    const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
  };

  // 🔹 LOGIN OR SEND OTP FOR SIGNUP
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---------------- 🔵 LOGIN ----------------
    if (isLogin) {
      setLoading(true);

      try {
        const res = await api.post("/user/login", {
          email: formData.email,
          password: formData.password,
        });

        if (res.data.status === "success") {
          alert("Login Successful!");
          navigate("/dashboard");
        } else {
          alert(res.data.message);
        }
      } catch (err) {
        alert("Invalid email or password");
      }

      setLoading(false);
      return;
    }

    // ---------------- 🔵 SIGNUP → SEND OTP ----------------
    setLoading(true);
    try {
      const res = await api.post("otp/send", {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
      });

      if (res.data.status === "success") {
        alert("OTP sent to your email!");
        setIsOtpStage(true);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to send OTP");
    }

    setLoading(false);
  };

  // 🔹 VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/otp/verify", {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
        otp: otp,
      });

      if (res.data.status === "success") {
        alert("Signup Successful!");
        navigate("/dashboard");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Error verifying OTP");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 transition-all">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">

        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isOtpStage ? "Verify OTP" : isLogin ? "Sign In" : "Create Account"}
        </h2>

        {/* ------------------- STEP 1 FORM ------------------- */}
        {!isOtpStage && (
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            {!isLogin && (
              <div>
                <label className="block mb-1 font-medium">Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2"
                  required
                />
              </div>
            )}

            {/* Email */}
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

            {/* Phone */}
            {!isLogin && (
              <div>
                <label className="block mb-1 font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 p-2"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 pr-10"
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              {loading ? "Please Wait..." : isLogin ? "Sign In" : "Sign Up"}
            </button>

            {/* Toggle Login/Signup */}
            <p className="text-center text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 ml-1"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>

          </form>
        )}

        {/* ------------------- STEP 2 - OTP ------------------- */}
        {isOtpStage && (
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
            <p className="text-gray-600 text-sm">
              Enter the 6-digit OTP sent to <br />
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
