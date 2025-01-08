"use client";

import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

const TwoFactorAuth = () => {
    const router = useRouter();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const verify2FACode = async () => {
        const user_id = localStorage.getItem(`user_id`);
        try {
            setLoading(true);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/secure/verification/check/`, 
                { code,user_id }, 
            );
            localStorage.setItem(`accessToken`,response.data.access);
            router.push("/dashboard");
        } catch (error:any) {
            if (error.response) {
                message.error(error.response.data.error);
            } else {
                message.error("An unexpected error occurred.");
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#001529]">
            <h1 className="text-3xl font-bold text-white mb-6">Two-Factor Authentication</h1>
            <input 
                type="text" 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                placeholder="Enter 2FA Code" 
                className="p-3 border border-gray-600 rounded-lg mb-4 bg-[#0d0e0f] text-white"
            />
            <button 
                onClick={verify2FACode} 
                className="p-3 bg-[#07325F] text-white rounded-lg shadow hover:bg-[#0d0e0f] transition duration-300"
                disabled={loading}
            >
                Verify Code
            </button>
        </div>
    );
};

export default TwoFactorAuth;