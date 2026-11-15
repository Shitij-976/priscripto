import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Send 6-digit OTP to user's email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/user/send-reset-otp`, { email });
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || otp.trim().length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(`${backendUrl}/api/user/reset-password`, {
        email,
        otp: otp.trim(),
        newPassword,
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center mt-6">
      {!isEmailSent ? (
        <form
          onSubmit={handleSendOtp}
          className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg"
        >
          <p className="text-3xl font-semibold">Reset Password</p>
          <p>Enter your registered email to receive a 6-digit OTP</p>

          <div className="w-full">
            <p>Email</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="email"
              placeholder="user@example.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white w-full py-2 rounded-md text-base mt-1 disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          <p className="mt-1">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        </form>
      ) : (
        <form
          onSubmit={handleResetPassword}
          className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg"
        >
          <p className="text-3xl font-semibold">New Password</p>
          <p>
            OTP sent to <span className="font-medium text-zinc-800">{email}</span>
          </p>

          <div className="w-full">
            <p>6-Digit OTP</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1 tracking-widest text-center font-mono text-lg"
              type="text"
              maxLength="6"
              placeholder="123456"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
              required
            />
            <p className="text-xs text-zinc-400 mt-1">
              Didn't receive email? Use default OTP: <span className="font-semibold text-zinc-600">123456</span>
            </p>
          </div>

          <div className="w-full relative">
            <p>New Password</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1 pr-10"
              type={showPassword ? "text" : "password"}
              placeholder="Min 8 characters"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              required
            />
            <span
              className="absolute right-3 cursor-pointer text-zinc-500"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{ top: "38px" }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white w-full py-2 rounded-md text-base mt-1 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          <div className="w-full flex justify-between items-center text-xs mt-1">
            <span
              onClick={handleSendOtp}
              className="text-primary underline cursor-pointer"
            >
              Resend OTP
            </span>
            <span
              onClick={() => navigate("/login")}
              className="text-primary underline cursor-pointer"
            >
              Back to Login
            </span>
          </div>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
