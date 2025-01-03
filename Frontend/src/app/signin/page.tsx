"use client";

import { useRef, useState, ChangeEvent,useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import styles from "./signin.module.css";
import { useRouter } from "next/navigation";
import { message } from "antd";
import axios from "axios";

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
    if (token) {
      setIsLogged(false);
      router.push("/dashboard");
    }
    
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login/api/token/`, {
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
      console.log(error);
      message.error(error.response.data.error || "Login failed");
    } finally {
      
      setLoading(false);  // Always stop loading when the request completes
    }
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
              <button className="w-full bg-[#3E3C49] text-white p-2 rounded shadow flex items-center justify-center">
                <img
                  src="data:image/png;base64,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"
                  alt="GitHub"
                  className="w-4 h-4 mr-2"
                />
                Sign in with intra 42
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
                  placeholder="Email or username"
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
