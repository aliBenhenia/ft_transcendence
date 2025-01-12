"use client";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { message, notification } from "antd"; // For showing messages and notifications

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Extract the uid and token from query params
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e:any) => {
    e.preventDefault(); // Prevent default form submission

    if (password !== repassword)
    {
      message.error("Passwords do not match.");
      return ;
    }
    if (password.length < 8 )
    {
       message.error("Password must be at least 8 characters long.");
       return ;
    }
    if (password.trim().length === 0)
    {
      message.error("Password cannot contain spaces!");
      return ;
    }
    setLoading(true);
    // $1.log(uid)
    // $1.log(token)
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/secure/reset-password/`, // Make sure this URL is correct for your backend
        {
          uid,
          token,
          newPassword:password,
        }
      );

      message.success("Password reset successful!");
      router.push("/signin"); // Redirect to login page after successful password reset
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle API errors
  const handleError = (err:any) => {
    if (err.response) {
      const { data } = err.response;
      if (data.error) message.error(data.error);
      if (data.information) notification.error({ message: "Error", description: data.information });
    } else {
      message.error("An unknown error occurred.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 to-gray-800 text-white">
      <div className="w-full max-w-lg p-8 space-y-6 bg-gray-900 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-semibold text-center">Reset Your Password</h2>

        {/* Password Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password Input */}
          <div className="flex items-center bg-gray-800 rounded-2xl p-4">
            <input
              type="password"
              placeholder="Enter New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent w-full text-white outline-none placeholder-gray-400"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div className="flex items-center bg-gray-800 rounded-2xl p-4">
            <input
              type="password"
              placeholder="Confirm New Password"
              value={repassword}
              onChange={(e) => setRepassword(e.target.value)}
              className="bg-transparent w-full text-white outline-none placeholder-gray-400"
              required
            />
          </div>

          {/* Reset Password Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

const ResetPasswordWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResetPassword />
  </Suspense>
);

export default ResetPasswordWrapper;