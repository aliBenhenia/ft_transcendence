// ```jsx
"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { message } from 'antd';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import logoOAuth from "../assets/42_logo.png";
import Image from "next/image";
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ErrorProps {
  [key: string]: string;
}

export default function CreateAccount() {
  const [hidePass, setHidePass] = useState<boolean>(true);
  const [hideConfirmPass, setHideConfirmPass] = useState<boolean>(true);
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);
  const [error, setError] = useState<ErrorProps>({});
  const [data, setData] = useState<ErrorProps>({});
  const inputFname = useRef<HTMLInputElement>(null);
  const inputLname = useRef<HTMLInputElement>(null);
  const inputEmail = useRef<HTMLInputElement>(null);
  const inputUsername = useRef<HTMLInputElement>(null);
  const inputPassword = useRef<HTMLInputElement>(null);
  const inputConfirmPassword = useRef<HTMLInputElement>(null);
  
  const isAllSpaces = (str: string): boolean => str.trim().length === 0;
  
  const isValidInput = (input: React.RefObject<HTMLInputElement>, confirmPasswordInput?: React.RefObject<HTMLInputElement>) => {
    const value = input.current?.value || "";
    if (input.current?.type != 'password') {
      return value.trim() === "" ? { valid: false, error: 'Field is required' } : { valid: true, error: '' };
    } else {
      if (value.length === 0) return { valid: false, error: 'Field is required' };
      if (isAllSpaces(value)) return { valid: false, error: 'Field does not accept all spaces' };
      if (value.length < 8) return { valid: false, error: 'Password must be at least 8 characters long' };
    }
    return { valid: true, error: '' };
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    setError((prev) => ({ ...prev, [name]: '' }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isFormValid = true;
    const newError: Record<string, string> = {};
    const newData: Record<string, string> = {};
    const fnameValidation = isValidInput(inputFname);
    if (!fnameValidation.valid) {
      isFormValid = false;
      newError.firstName = fnameValidation.error;
    } else {
      newData.first_name = inputFname.current?.value || "";
    }
    const lnameValidation = isValidInput(inputLname);
    if (!lnameValidation.valid) {
      isFormValid = false;
      newError.lastName = lnameValidation.error;
    } else {
      newData.last_name = inputLname.current?.value || "";
    }
    const emailValidation = isValidInput(inputEmail);
    if (!emailValidation.valid) {
      isFormValid = false;
      newError.email = emailValidation.error;
    } else {
      newData.email = inputEmail.current?.value || "";
    }
    const usernameValidation = isValidInput(inputUsername);
    if (!usernameValidation.valid) {
      isFormValid = false;
      newError.username = usernameValidation.error;
    } else {
      newData.username = inputUsername.current?.value || "";
    }
    const passwordValidation = isValidInput(inputPassword, inputConfirmPassword);
    if (!passwordValidation.valid) {
      isFormValid = false;
      newError.password = passwordValidation.error;
    } else {
      newData.password = inputPassword.current?.value || "";
    }
    const confirmPasswordValidation = isValidInput(inputConfirmPassword, inputPassword);
    if (!confirmPasswordValidation.valid) {
      isFormValid = false;
      newError.confirmPassword = confirmPasswordValidation.error;
    } else {
      newData.repassword = inputConfirmPassword.current?.value || "";
    }
    setError(newError);
    setData(newData);
    if (!isFormValid)
      return;
    if (newData.password !== newData.repassword) {
      setError(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }
    if (newData.password.length < 8 || newData.repassword.length < 8) {
      setError(prev => ({ ...prev, password: 'Password must be at least 8 characters long' }));
      return;
    }
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/register/create-account/`, newData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status == 201) {
        message.success('Registration successful! ');
        window.location.href = "/signin";
      }
      else if (response.status == 409) {
        message.error('Email already exists, or username ');
      }
      else {
        message.error('Registration failed. Please check your details');
      }
    } catch (error: any) {
      if (error?.response?.status == 400) {
        message.error(error?.response?.data?.error);
        return;
      }
      if (error.response) {
        const errorMsg = error.response.data?.detail || 'Registration failed. Please check your details.';
        message.error(errorMsg);
        setError(prev => ({ ...prev, general: errorMsg }));
      } else if (error.request) {
        message.error('No response from server. Please try again later.');
        setError(prev => ({ ...prev, general: 'No response from server. Please try again later.' }));
      } else {
        message.error(`Registration error: ${error.message}`);
        setError(prev => ({ ...prev, general: `Registration error: ${error.message}` }));
      }
    }
  };
  
  const handleRegisterRemote = () => {
    const redirectUri:string | undefined = process.env.NEXT_PUBLIC_REDIRECT_URI;
    if (!redirectUri) {
      message.error('Redirect URI is not set');
      return;
    }
    window.location.href = redirectUri;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center w-full">
      <div className="lg:w-[50%] w-full flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl backdrop-blur-sm border border-white/10 shadow-2xl"
        >
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2">Join PongPlay</h2>
            <p className="text-gray-300">Create your account to start playing</p>
          </div>

          <div className="flex flex-col space-y-4 mb-6">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegisterRemote}
              className="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4 rounded-xl shadow-lg flex items-center justify-center space-x-3 hover:from-slate-600 hover:to-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition duration-300 ease-in-out border border-slate-600"
            >
              <Image src={logoOAuth} alt="42 logo" width={24} height={24} />
              <span className="text-lg font-semibold">Sign up with 42</span>
            </motion.button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-gray-400">or continue with</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1">
                <input
                  autoComplete="off"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="w-full bg-slate-800/50 p-4 rounded-xl text-white outline-none border border-slate-700 focus:border-cyan-500 transition-colors placeholder-gray-400"
                  ref={inputFname}
                  onChange={handleInputChange}
                />
                {error.firstName && <p className="text-red-400 text-sm mt-1">{error.firstName}</p>}
              </div>
              <div className="flex-1">
                <input
                  autoComplete="off"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full bg-slate-800/50 p-4 rounded-xl text-white outline-none border border-slate-700 focus:border-cyan-500 transition-colors placeholder-gray-400"
                  ref={inputLname}
                  onChange={handleInputChange}
                />
                {error.lastName && <p className="text-red-400 text-sm mt-1">{error.lastName}</p>}
              </div>
            </div>
            
            <div>
              <input
                autoComplete="off"
                type="text"
                name="username"
                placeholder="Username"
                className="w-full bg-slate-800/50 p-4 rounded-xl text-white outline-none border border-slate-700 focus:border-cyan-500 transition-colors placeholder-gray-400"
                ref={inputUsername}
                onChange={handleInputChange}
              />
              {error.username && <p className="text-red-400 text-sm mt-1">{error.username}</p>}
            </div>
            
            <div>
              <input
                autoComplete="off"
                type="email"
                name="email"
                placeholder="Email"
                className="w-full bg-slate-800/50 p-4 rounded-xl text-white outline-none border border-slate-700 focus:border-cyan-500 transition-colors placeholder-gray-400"
                ref={inputEmail}
                onChange={handleInputChange}
              />
              {error.email && <p className="text-red-400 text-sm mt-1">{error.email}</p>}
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <div className='relative'>
                  <span
                    className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-400 hover:text-white transition-colors"
                    onClick={() => setHidePass(!hidePass)}
                  >
                    {hidePass ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  <input
                    autoComplete="off"
                    type={hidePass ? 'password' : 'text'}
                    name="password"
                    placeholder="Password"
                    className="w-full bg-slate-800/50 p-4 rounded-xl text-white outline-none border border-slate-700 focus:border-cyan-500 transition-colors placeholder-gray-400 pr-12"
                    ref={inputPassword}
                    onChange={handleInputChange}
                  />
                </div>
                {error.password && <p className="text-red-400 text-sm mt-1">{error.password}</p>}
              </div>
              
              <div className="relative">
                <div className='relative'>
                  <span
                    className="absolute inset-y-0 right-4 flex items-center cursor-pointer text-gray-400 hover:text-white transition-colors"
                    onClick={() => setHideConfirmPass(!hideConfirmPass)}
                  >
                    {hideConfirmPass ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  <input
                    autoComplete="off"
                    type={hideConfirmPass ? 'password' : 'text'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full bg-slate-800/50 p-4 rounded-xl text-white outline-none border border-slate-700 focus:border-cyan-500 transition-colors placeholder-gray-400 pr-12"
                    ref={inputConfirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
                {error.confirmPassword && <p className="text-red-400 text-sm mt-1">{error.confirmPassword}</p>}
              </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 text-white p-4 rounded-xl font-semibold text-lg shadow-lg hover:from-cyan-500 hover:to-purple-500 transition-all duration-300"
            >
              Create Account
            </motion.button>
            
            {error.general && <p className="text-red-400 text-center mt-4">{error.general}</p>}
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{' '}
              <Link href="/signin" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
