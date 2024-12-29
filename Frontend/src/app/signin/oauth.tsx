"use client";
import { FaFacebook } from "react-icons/fa";


const OAuth2Login = () => {
    return (
        <div>
          <button className="btn bg-[#3B5998] text-white w-full p-2 rounded">
            <FaFacebook className="mr-2" />
            Continue with Facebook
            </button>
        </div>
    );
};

export default OAuth2Login;