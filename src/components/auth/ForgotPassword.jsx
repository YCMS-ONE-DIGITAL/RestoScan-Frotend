import { useState } from "react";
import api from "../../api/api";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);  
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ⭐ STEP 1 — Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/forgot-password/send-otp", { email });

      if (res.data.status === "success") {
        // OPTIONAL: backend OTP show करत असेल तर store करू शकतो
        console.log("OTP:", res.data.token || res.data.otp);

        setStep(2);
      } else {
        alert(res.data.message);
      }
    } catch {
      alert("Failed to send OTP");
    }

    setLoading(false);
  };

  // ⭐ STEP 2 — Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/forgot-password/verify-otp", {
        email,
 otp: otp,            });

      if (res.data.status === "success") {
        setStep(3);
      } else {
        alert(res.data.message);
      }
    } catch {
      alert("Invalid OTP");
    }

    setLoading(false);
  };

  // ⭐ STEP 3 — Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/forgot-password/reset", {
        email,
 otp: otp,              new_password: newPassword,
      });

      if (res.data.status === "success") {
        alert("Password changed successfully!");
        window.location.href = "/login";
      } else {
        alert(res.data.message);
      }
    } catch (err) {
    console.log(err.response?.data);
    alert(err.response?.data?.message || "Failed to reset password");
}


    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">

        <h2 className="text-2xl font-bold text-center text-gray-800">
          {step === 1 && "Forgot Password"}
          {step === 2 && "Verify OTP"}
          {step === 3 && "Reset Password"}
        </h2>

        {/* STEP 1 — Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium">Enter Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 — OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
            <p className="text-gray-600 text-sm">
              OTP sent to <span className="text-blue-600">{email}</span>
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
                onClick={() => setStep(1)}
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

        {/* STEP 3 — New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block mb-1 font-medium">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
