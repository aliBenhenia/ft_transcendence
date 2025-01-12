"use client";

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Input, Dropdown, Avatar } from 'antd';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const FriendSearch = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string>("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const newToken = localStorage.getItem('accessToken');
        if (!newToken) return;
        setToken(newToken);

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
                setResults([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = async (e: any) => {
        const value = e.target.value;
        setUsername(value);

        if (!value) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends/search/?username=${value}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setResults(response.data.success);
        } catch (error) {
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuClick = (username: string) => {
        // $1.log("Selected:", username);
        router.push(`/profile/${username}`);
        // Redirect to profile and fetch data again
    };

    return (
        <div className="relative w-full ml-4 flex justify-center" ref={dropdownRef}>
            <div className="flex items-center">
                <FaSearch className="absolute left-3 text-gray-400 transition-colors duration-300 hover:text-blue-400" />
                <motion.input
                    type="text"
                    placeholder="Search"
                    className="w-full sm:w-full md:w-full lg:w-full pl-10 pr-4 bg-[#031B3A] py-2 rounded-2xl focus:outline-none shadow-lg border border-transparent focus:border-blue-500 transition-all duration-300 ease-in-out"
                    value={username}
                    onChange={handleSearch}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    whileFocus={{ scale: 1.05, boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)' }}
                    transition={{ duration: 0.3 }}
                />
            </div>
            {results.length > 0 && (
                <div className="absolute left-0 right-0 z-[199] mt-10 bg-[#031B3A] rounded-2xl shadow-2xl">
                    {results.map((user: any) => (
                        <div
                            key={user.username}
                            onClick={() => handleMenuClick(user.username)}
                            className="flex items-center p-2 cursor-pointer"
                        >
                            <Avatar src={user.picture} alt={user.full_name} className="mr-2" />
                            <span>{user.full_name} ({user.username})</span>
                        </div>
                    ))}
                    {results.length === 0 && (
                        <div className="p-2 text-gray-500">No results found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FriendSearch;
