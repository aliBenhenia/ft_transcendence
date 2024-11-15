"use client";

import { useState } from 'react';
import axios from 'axios';
import { Button, message, notification } from 'antd';
import { motion } from 'framer-motion';
import { UserOutlined, LockOutlined, CheckCircleOutlined, SendOutlined } from '@ant-design/icons';
import { FiCheckCircle } from 'react-icons/fi';
import {useRouter} from 'next/navigation'

const ResetPassword = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState('');
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ email: '', fullName: '', picture: '' });

  // Step 1: Locate Account
  const locateAccount = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:9003/secure/reset-password/locate/?account=${account}`);
      setUser(response.data.success);
      setStep(2);
      message.success('Account located successfully.');
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Send Verification Code
  const sendVerificationCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:9003/secure/reset-password/send/', { account });
      setStep(3);
      message.success(response.data.success);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify Code
  const verifyCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:9003/secure/reset-password/verify/', { account, code });
      setToken(response.data.token);
      setStep(4);
      message.success(response.data.success);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Change Password
  const changePassword = async () => {
    if (password !== repassword) {
      message.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://127.0.0.1:9003/secure/reset-password/update/${token}/`,
        { password, repassword }
      );
      setStep(5);
      message.success(response.data.success);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle API errors
  const handleError = (err) => {
    if (err.response) {
      const { data } = err.response;
      if (data.error) message.error(data.error);
      if (data.information) notification.error({ message: 'Error', description: data.information });
    } else {
      message.error('An unknown error occurred.');
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

        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center bg-gray-800 rounded-2xl p-4">
              <UserOutlined className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Enter Username or Email"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="bg-transparent w-full text-white outline-none"
              />
            </div>
            <Button type="primary" icon={<SendOutlined />} loading={loading} onClick={locateAccount} className="w-full">
              Locate Account
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 text-center">
            <img src={user.picture} alt="Avatar" className="w-24 h-24 mx-auto rounded-full border-4 border-blue-600 shadow-lg" />
            <p className="text-xl font-medium">{user.fullName}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
            <Button type="primary" icon={<SendOutlined />} loading={loading} onClick={sendVerificationCode} className="w-full">
              Send Verification Code
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center bg-gray-800 rounded-2xl p-4">
              <LockOutlined className="text-gray-400 mr-3" />
              <input
                type="number"
                placeholder="Enter Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-transparent w-full text-white outline-none"
              />
            </div>
            <Button type="primary" icon={<CheckCircleOutlined />} loading={loading} onClick={verifyCode} className="w-full">
              Verify Code
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center bg-gray-800 rounded-2xl p-4">
              <LockOutlined className="text-gray-400 mr-3" />
              <input
                type="password"
                placeholder="Enter New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent w-full text-white outline-none"
              />
            </div>
            <div className="flex items-center bg-gray-800 rounded-2xl p-4">
              <LockOutlined className="text-gray-400 mr-3" />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={repassword}
                onChange={(e) => setRepassword(e.target.value)}
                className="bg-transparent w-full text-white outline-none"
              />
            </div>
            <Button type="primary" icon={<CheckCircleOutlined />} loading={loading} onClick={changePassword} className="w-full">
              Change Password
            </Button>
          </div>
        )}

        {step === 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3"
          >
            <FiCheckCircle className="text-green-500 text-6xl mx-auto" />
            <p className="text-xl font-semibold text-green-400">Password Changed Successfully!</p>
            <p>You can now log in with your new password.</p>
            <Button type="primary" onClick={() => router.push("/signin")}>got to login page</Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
