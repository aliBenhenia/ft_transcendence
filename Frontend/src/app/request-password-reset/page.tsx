"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button, message, notification } from "antd";
import { motion } from "framer-motion";
import { UserOutlined, LockOutlined, CheckCircleOutlined, SendOutlined } from "@ant-design/icons";
import { FiCheckCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";

const ResetPassword = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState("");
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [locateLoading, setLocateLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [user, setUser] = useState({ email: "", fullName: "", picture: "" });

  useEffect(() => {
    // console.log("Reset Password page loaded", process.env.NODE_ENV);
    // console.log("Reset Password page loaded===>", process.env.NEXT_PUBLIC_API_URL);
  }, []);

  // Step 1: Locate Account
  const locateAccount = async () => {
    setLocateLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/secure/request-password-reset/`, // Make sure this path corresponds to your Django API
        { email:account }
      );
      setUser(response.data.success);
      message.success(response.data.message);
    } catch (err) {
      handleError(err);
    } finally {
      setLocateLoading(false);
    }
  };

 
  // Handle API errors
  const handleError = (err: any) => {
    if (err.response) {
      const { data } = err.response;
      if (data.error) message.error(data.error);
      if (data.information) notification.error({ message: "Error", description: data.information });
    } else {
      message.error("An unknown error occurred.");
    }
  };

  // Render steps with animations
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 to-gray-800 text-white">
      <motion.div
        className="w-full max-w-lg p-8 space-y-6 bg-gray-900 rounded-xl shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-semibold text-center">Reset Your Password</h2>

   
          <div className="space-y-4">
      <div className="flex items-center bg-gray-800 rounded-2xl p-4">
          <UserOutlined className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Enter Email"
            value={account}
            onChange={(e) => setAccount(e.target.value)}  // Corrected here
            className="bg-transparent w-full text-white outline-none"
          />
        </div>
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={locateLoading}
              onClick={locateAccount}
              className="w-full"
            >
              Send reset link
            </Button>
          </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
