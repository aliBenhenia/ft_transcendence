"use client"
<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications,markAllAsRead } from '../../../store/slices/notificationsSlice';
=======
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAllAsRead } from '../../../store/slices/notificationsSlice';
>>>>>>> origin/main
import axios from 'axios';
import { FaBell } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

<<<<<<< HEAD
const Notification:React.FC  = () => {
    const router = useRouter();
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    const dispatch = useDispatch();
    const { notifications, unreadCount, error } = useSelector(state => (state as any).notifications);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (accessToken) {
            dispatch(fetchNotifications(accessToken) as any); 
        }
    }, []);
    
=======
const Notification: React.FC = () => {
    const router = useRouter();
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const dispatch = useDispatch();
    const { notifications, unreadCount, error } = useSelector(state => (state as any).notifications);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (accessToken) {
            dispatch(fetchNotifications(accessToken) as any);
        }
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [accessToken, dispatch]);
>>>>>>> origin/main

    const handleBellClick = () => {
        setDropdownOpen(prev => !prev);
        if (!dropdownOpen) {
<<<<<<< HEAD
          
            if (accessToken) {
                dispatch(fetchNotifications(accessToken) as any) 
              }
=======
            if (accessToken) {
                dispatch(fetchNotifications(accessToken) as any);
            }
>>>>>>> origin/main
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notification/api/mark/`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (accessToken) {
<<<<<<< HEAD
                dispatch(fetchNotifications(accessToken) as any); 
            }
            if (response.data.message === "all notifications has marked as read") {
                if (accessToken) {
                    dispatch(fetchNotifications(accessToken) as any); 
                }
            }
        } catch (err) {
=======
                dispatch(fetchNotifications(accessToken) as any);
            }
            if (response.data.message === "all notifications has marked as read") {
                if (accessToken) {
                    dispatch(fetchNotifications(accessToken) as any);
                }
            }
        } catch (err) {
            console.log("Error marking all as read:", err);
>>>>>>> origin/main
        }
    };

    const deleteAllNotifications = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notification/api/delete/`, {}, {
                headers: {
<<<<<<< HEAD
                    Authorization: `Bearer ${accessToken || ''}`, 
=======
                    Authorization: `Bearer ${accessToken || ''}`,
>>>>>>> origin/main
                },
            });

            if (response.data.message === "all notifications has been deleted !") {
<<<<<<< HEAD
                dispatch(fetchNotifications(accessToken || '') as any); 
            }
        } catch (err:any) {
=======
                dispatch(fetchNotifications(accessToken || '') as any);
            }
        } catch (err: any) {
>>>>>>> origin/main
            console.log("Error deleting notifications:", err.response?.data);
        }
    };

    return (
<<<<<<< HEAD
        <div className="relative">
=======
        <div className="relative" ref={dropdownRef}>
>>>>>>> origin/main
            <button
                onClick={handleBellClick}
                className="flex items-center relative"
            >
                <FaBell className="text-2xl" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 text-xs">
                        {unreadCount <= 99 ? unreadCount : '99+'}
                    </span>
                )}
            </button>

            {dropdownOpen && (
<<<<<<< HEAD
                <div className="absolute right-0  w-64 bg-[#001529] shadow-lg rounded-md overflow-hidden z-[90]">
=======
                <div className="absolute right-0 w-64 bg-[#001529] shadow-lg rounded-md overflow-hidden z-[90]">
>>>>>>> origin/main
                    <div className="p-2 border-b">
                        <h4 className="font-bold">Notifications</h4>
                        <button onClick={markAllAsRead} className="text-xs text-blue-400 hover:underline">
                            Mark All as Read
                        </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {notifications.length > 0 ? (
<<<<<<< HEAD
                            notifications.map((notification:any, index:number) => (
=======
                            notifications.map((notification: any, index: number) => (
>>>>>>> origin/main
                                <div key={index} className="flex items-center space-x-2 p-2 transition">
                                    <img
                                        src={notification.picture}
                                        alt={notification["full-name"]}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <h4 className="font-semibold">{notification.subject}</h4>
                                        <p className="text-sm text-gray-500">{notification["full-name"]}</p>
                                        <p className="text-xs text-gray-400">{new Date(notification.time).toLocaleString()}</p>
<<<<<<< HEAD
                                        {notification.subject == "INVITATION"   && (
                                            <div className="flex space-x-2">
                                                <button 
                                                onClick={() => router.push("/req")}
                                                className="text-xs text-white bg-gray-500 px-2 py-1 rounded-md">
=======
                                        {notification.subject == "INVITATION" && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => router.push("/req")}
                                                    className="text-xs text-white bg-gray-500 px-2 py-1 rounded-md">
>>>>>>> origin/main
                                                    see invitations list
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-2 text-gray-500 text-sm">No notifications</div>
                        )}
                    </div>
                    <div className="p-2 border-t">
                        <button onClick={deleteAllNotifications} className="w-full text-left text-red-500 hover:bg-red-100">
                            Delete All
                        </button>
                    </div>
                </div>
            )}

            {error && <div className="text-red-500">{error}</div>}
        </div>
    );
};

<<<<<<< HEAD
export default Notification;
=======
export default Notification;
>>>>>>> origin/main
