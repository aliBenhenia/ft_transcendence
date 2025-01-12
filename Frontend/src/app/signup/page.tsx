"use client";

import styles from './signup.module.css';
import Link from 'next/link';
import { message } from 'antd';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRef, useState, ChangeEvent } from "react";
import { useRouter, redirect } from 'next/navigation';
import axios from 'axios';
import logoOAuth from "../assets/42_logo.png";
import Image from "next/image";


interface ErrorProps {
  [key: string]: string;//ma3loma (Index Signature is used to define an object with any number of properties())
}

export default function CreateAccount() {
  const router = useRouter();
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


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {// ChangeEvent is a generic type that takes the type of the event target as a type argument.
    const name = e.target.name;
    setError((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();// Prevents the default action of the event from being triggered.

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
     
      if (response.status == 201)
      {
            // $1.log(response)
            message.success('Registration successful! ');
            router.push("/signin")
      }
      else if (response.status == 409)
      {
        // $1.log(response)
        message.error('Email already exists, or username ');
      }
      else
      {
        
        // $1.log(response.status)
        // $1.log(response)
        message.error('Registration failed. Please check your details');
      }
    } catch (error: any) {
      if (error?.response?.status == 400)
      {
        message.error(error?.response?.data?.error);
        return  ;
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
    if (!redirectUri)
    {
      message.error('Redirect URI is not set');
      return;
    }
    router.push(redirectUri);
  };
  return (
    <div className={`${styles.singup} min-h-screen flex items-center justify-center w-full`}>
      <div className='lg:w-[50%] w-full flex items-center justify-center'>
        <div className='w-full max-w-md p-8 bg-[#00152993] rounded-2xl bg-[#001529] shadow-lg '>
          <h2 className="text-2xl font-semibold text-white text-center mb-6">Create Account </h2>
          <div className="flex flex-col space-y-4 mb-6">
                <button 
                onClick={handleRegisterRemote}
                className="w-full bg-[#3E3C49] text-white p-4 rounded-lg shadow-lg flex items-center justify-center space-x-3 hover:bg-[#5A575F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3E3C49] transition duration-300 ease-in-out">
                  <Image src={logoOAuth} alt="42 logo" width={24} height={24} />
                  <span className="text-lg font-semibold">Sign up with 42</span>
                </button>
              </div>
          <p className="text-white text-center mb-5">or</p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex-1">
                <input
                autoComplete="off"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="w-full bg-[#031B3A] p-3 rounded text-white outline-none"
                  ref={inputFname}
                  onChange={handleInputChange}
                />
                {error.firstName && <p className="text-red-500 text-sm mt-1">{error.firstName}</p>}
              </div>
              <div className="flex-1">
                <input
                autoComplete="off"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full bg-[#031B3A] p-3 rounded text-white outline-none"
                  ref={inputLname}
                  onChange={handleInputChange}
                />
                {error.lastName && <p className="text-red-500 text-sm mt-1">{error.lastName}</p>}
              </div>
            </div>

            <div>
              <input
               autoComplete="off"
                type="text"
                name="username"
                placeholder="Username"
                className="w-full bg-[#031B3A] p-3 rounded text-white outline-none"
                ref={inputUsername}
                onChange={handleInputChange}
              />
              {error.username && <p className="text-red-500 text-sm mt-1">{error.username}</p>}
            </div>

            <div>
              <input
              autoComplete="off"
                type="email"
                name="email"
                placeholder="Email"
                className="w-full bg-[#031B3A] p-3 rounded text-white outline-none"
                ref={inputEmail}
                onChange={handleInputChange}
              />
              {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
            </div>

            <div className="flex flex-col gap-y-5">
              <div className="flex-1 relative">
                <div className='relative'>
                  <span
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setHidePass(!hidePass)}
                  >
                    {hidePass ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  <input
                  autoComplete="off"
                    type={hidePass ? 'password' : 'text'}
                    name="password"
                    placeholder="Password"
                    className="w-full bg-[#031B3A] p-3 rounded text-white outline-none"
                    ref={inputPassword}
                    onChange={handleInputChange}
                  />
                </div>
                {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
              </div>

              <div className="flex-1 relative">
                <div className='relative'>
                  <span
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setHideConfirmPass(!hideConfirmPass)}
                  >
                    {hideConfirmPass ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  <input
                  autoComplete="off"
                    type={hideConfirmPass ? 'password' : 'text'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full bg-[#031B3A] p-3 rounded text-white outline-none"
                    ref={inputConfirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
                {error.confirmPassword && <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>}
              </div>
            </div>

            <button type="submit" className="w-full bg-[#07325F] text-[#fff] p-3 rounded text-lg font-semibold">
              Register
            </button>

            {error.general && <p className="text-red-500 text-center mt-4">{error.general}</p>}
          </form>

          <p className="text-white text-center mt-6">
            Already have an account? <Link href="/signin" className="text-[#07325F] ">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
