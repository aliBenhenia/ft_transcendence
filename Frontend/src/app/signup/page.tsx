"use client";

import styles from './signup.module.css';
import Link from 'next/link';
import { message } from 'antd';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRef, useState, ChangeEvent } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';

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
            console.log(response)
            message.success('Registration successful! Please check your email to confirm your account.');
            router.push("/signin")
      }
      else if (response.status == 409)
      {
        console.log(response)
        message.error('Email already exists, or username ');
      }
      else
      {
        
        console.log(response.status)
        console.log(response)
        message.error('Registration failed. Please check your details');
      }
    } catch (error: any) {
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

  return (
    <div className={`${styles.singup} min-h-screen flex items-center justify-center w-full`}>
      <div className='lg:w-[50%] w-full flex items-center justify-center'>
        <div className='w-full max-w-md p-8 bg-[#00152993] rounded-2xl bg-[#001529] shadow-lg '>
          <h2 className="text-2xl font-semibold text-white text-center mb-6">Create Account </h2>
          <div className="flex flex-col space-y-4 mb-6">
            <button className="w-full bg-[#3E3C49] text-white p-2 rounded shadow flex items-center justify-center">
              <img
                src="data:image/png;base64,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"
                alt="GitHub"
                className="w-4 h-4 mr-2"
              />
              Sign up with intra 42
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
