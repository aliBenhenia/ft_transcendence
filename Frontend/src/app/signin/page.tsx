"use client";

import { useRef, useState, ChangeEvent,useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import styles from "./signin.module.css";
import { useRouter } from "next/navigation";
import { message } from "antd";
import axios from "axios";
import logoOAuth from "../assets/42_logo.png";
import Image from "next/image";
import FetchProfile from "@/services/FetchProfile";

export default function SignIn() {
  const inputEmail = useRef<HTMLInputElement>(null);
  const inputPassword = useRef<HTMLInputElement>(null);
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState<Record<string, string>>({});
  const [hidePass, setHidePass] = useState(true);
  const [loading, setLoading] = useState(false);
  const [passErr, setPassErr] = useState(false);
  const [isLogged, setIsLogged] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("accessToken") || '';
    const checkisLogged = async () => {
      setIsLogged(false);
      console.log("===> ",process.env.NEXT_PUBLIC_API_URL)
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/account/profile/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
        if (res.status === 200) {
          router.push("/dashboard");
        }
    } catch (err: any) {
      // $1.log(err.status);
        if (err.status === 401) {
          setIsLogged(true);
        }
    }
      
    };
    checkisLogged();
  }, []);

  const isAllSpaces = (str: string): boolean => {
    return str.trim().length === 0;
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setPassErr(true);
      return false;
    } else {
      setPassErr(false);
      return true;
    }
  };

  const isValidInput = (input: React.RefObject<HTMLInputElement>) => {
    const value = input.current?.value || "";
    if (input.current?.type !== "password") {
      if (value.trim() === "") {
        return { valid: false, error: "Field is required" };
      } else if (!value) {
        return { valid: false, error: "Invalid email address" };
      }
    } else {
      if (value.length === 0) {
        return { valid: false, error: "Field is required" };
      }
      if (isAllSpaces(value)) {
        return { valid: false, error: "Field does not accept all spaces" };
      }
      if (value.length < 8) {
        return { valid: false, error: "Password must be at least 8 characters long" };
      }
    }
    return { valid: true, error: "" };
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" }));

    if (name === "password") {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);  // Start loading state

    const emailValidation = isValidInput(inputEmail);
    const passwordValidation = isValidInput(inputPassword);
    const newError: Record<string, string> = {};

    if (!emailValidation.valid) {
      newError.email = emailValidation.error;
    }
    if (!passwordValidation.valid) {
      newError.password = passwordValidation.error;
    }
    setError(newError);
    if (!emailValidation.valid || !passwordValidation.valid) {
      setLoading(false);  // Stop loading if there's an invalid field
      return;
    }

    if (data.password.length < 8) {
      setPassErr(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login/token/`, {
        email: data.email,
        password: data.password,
      });
      setLoading(true);

      const result = response.data;
      if (response.status == 200) {
        if (result["2FA"] === true) {
          localStorage.setItem(`user_id`,result.user_id)
          message.success("You need to verify 2FA authentication");
          router.push("/2fa");
          setLoading(false);
          return;
        }
        setLoading(true);
        message.success("Login success");
        localStorage.setItem("accessToken", result.access);
        router.push("/dashboard");
      } else {
        message.error("Error during login");
        setError((prev) => ({ ...prev, general: "Login failed" }));
      }
    } catch (error: any) {
      // $1.log(error);
      message.error(error.response.data.error || "Login failed");
    } finally {
      
      setLoading(false);  // Always stop loading when the request completes
    }
  };
  // OAuth login
  const handleLogin = () => {
    const redirectUri:string | undefined = process.env.NEXT_PUBLIC_REDIRECT_URI;
    if (!redirectUri)
    {
      message.error('Redirect URI is not set');
      return;
    }
    router.push(redirectUri);
  };
  return (
    <>
      {

        !isLogged ? null: ( <div className="flex flex-col">
        <div className={`${styles.singin} min-h-screen flex items-center justify-center w-full`}>
          <div className="bg-cover bg-center absolute top-0 left-0 w-full h-full opacity-50"></div>
          <div className={`${styles.box} relative p-8 rounded-lg shadow-lg`}>
            <h2 className="text-2xl font-semibold text-white text-center mb-6">Sign In</h2>
            <div className="flex flex-col space-y-4 mb-6">
                <button 
                onClick={handleLogin}
                className="w-full bg-[#3E3C49] text-white p-4 rounded-lg shadow-lg flex items-center justify-center space-x-3 hover:bg-[#5A575F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3E3C49] transition duration-300 ease-in-out">
                  <Image src={logoOAuth} alt="42 logo" width={24} height={24} />
                  <span className="text-lg font-semibold">Sign in with 42</span>
                </button>
              </div>

            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-4 text-gray-400">Or sign in with email</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <input
                  ref={inputEmail}
                  type="text"
                  name="email"
                  placeholder="Email "
                  className="w-full bg-[#D9D9D9] p-2 rounded text-black outline-none"
                  value={data.email}
                  onChange={handleInputChange}
                />
                {error.email && <p className="text-red-500">{error.email}</p>}
              </div>
              <div className="relative ">
                <input
                  autoComplete="off"
                  ref={inputPassword}
                  type={hidePass ? "password" : "text"}
                  name="password"
                  placeholder="Password"
                  className={`w-full bg-[#D9D9D9] p-2 rounded text-black ${passErr ? "border-red-500" : "border-gray-300"} outline-none`}
                  value={data.password}
                  onChange={handleInputChange}
                />
                <span
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setHidePass(!hidePass)}
                >
                  {!hidePass ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
                {passErr && <p className="text-red-500">Password must be at least 8 characters long.</p>}
                {error.password && !passErr && <p className="text-red-500">{error.password}</p>}
              <div className="flex justify-between items-center">
                <Link className="text-gray-400 hover:underline" href="/request-password-reset">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                className={`w-full bg-[#3E3C49] text-white p-2 rounded mt-4 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading} // Disable button while loading
              >
                {loading ? "Signing In..." : "Sign In"} {/* Show loading state text */}
              </button>
            </form>
            {error.general && <p className="text-red-500 text-center mt-4">{error.general}</p>}
            <p className="text-center text-gray-400 mt-4">
              Dont have an account? <Link href="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </div>)
      }
   
  </>
  );
}
