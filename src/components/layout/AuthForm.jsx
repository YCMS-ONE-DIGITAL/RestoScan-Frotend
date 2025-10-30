import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function AuthForm() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check current route path
  const isLogin = location.pathname === "/login";

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log("Logging in:", formData);
    } else {
      console.log("Signing up:", formData);
    }
  };

  const toggleAuth = () => {
    navigate(isLogin ? "/signup" : "/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isLogin ? "Sign In" : "Create Account"}
        </h2>

        {!isLogin && (
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="relative w-full">
  <label className="block mb-1 font-medium text-gray-700">Password</label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded-lg h-12 pl-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      placeholder="Enter your password"
      required
    />

    {/* 👇 The magic part 👇 */}
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500 hover:text-gray-700"
      style={{ pointerEvents: "auto" }} // ensures click always works
    >
      {showPassword ? (
        <EyeOff size={22} className="block" />
      ) : (
        <Eye size={22} className="block" />
      )}
    </button>
  </div>
</div>


        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {isLogin ? "Sign In" : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={toggleAuth}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </form>
    </div>
  );
}
