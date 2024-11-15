"use client";

import { useState, useEffect } from "react";
import { Input, message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ConfirmEmail() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    send2FACode();
  }, []);

  const send2FACode = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(
        "http://127.0.0.1:9003/secure/verification/send/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success(
          "2FA code has been sent to your email. Please check your inbox."
        );
      }
    } catch (error: any) {
      console.error("Error sending 2FA code", error);
      if (error.response?.status === 401) {
        message.error("Invalid or expired token. Please log in again.");
      } else if (error.response?.status === 429) {
        message.error(
          `Too many requests. Please wait ${error.response.data.time}.`
        );
      } else {
        message.error("Failed to send 2FA code. Please try again later.");
      }
    }
  };

  const handleChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleConfirmClick = async () => {
    const otpNumber = otp.join("");

    if (otpNumber.length < 6) {
      message.error("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "http://127.0.0.1:9003/secure/verification/check/",
        { code: otpNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        message.success("Your 2FA code has been verified successfully!");
        setTimeout(() => {
          router.push("/admin/");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error verifying 2FA code", error);
      if (error.response?.status === 401) {
        message.error("Invalid or expired token. Please log in again.");
      } else if (error.response?.status === 404) {
        message.error("The 2FA code you entered is incorrect. Please try again.");
      } else if (error.response?.status === 429) {
        message.error(
          `Retry limit reached. Please wait ${error.response.data.time}.`
        );
      } else {
        message.error("Failed to verify 2FA code. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#07325F]">
      <nav className="w-full p-4 text-white text-center text-xl font-bold">
        Otp verification
      </nav>
      <div className="bg-[#001529] p-8 rounded-2xl shadow-lg mt-8">
        <h2 className="text-white mb-4 text-center">Enter the 6-Digit Code</h2>
        <div className="flex space-x-2 mb-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Input
              key={index}
              value={otp[index]}
              onChange={(event) => handleChange(index, event)}
              maxLength={1}
              style={{ width: "29px", textAlign: "center" }}
              className="bg-slate-400 text-[#444] rounded border-none focus:border-none focus:ring-0 focus:bg-white"
            />
          ))}
        </div>
        <button
          onClick={handleConfirmClick}
          className={`w-full py-2 rounded-2xl text-white text-lg font-semibold hover:bg-opacity-80 mt-4 ${
            loading ? "bg-gray-500" : "bg-[#07325F]"
          }`}
          disabled={loading}
        >
          {loading ? "Confirming..." : "Confirm"}
        </button>
      </div>
    </div>
  );
}
