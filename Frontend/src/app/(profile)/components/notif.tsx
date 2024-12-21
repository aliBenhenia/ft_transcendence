"use client"
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications,markAllAsRead } from '../../../store/slices/notificationsSlice';
import axios from 'axios';
import { FaBell } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

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

    const handleBellClick = () => {
        setDropdownOpen(prev => !prev);
        if (!dropdownOpen) {
          
            if (accessToken) {
                dispatch(fetchNotifications(accessToken) as any) 
              }
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
                dispatch(fetchNotifications(accessToken) as any); 
            }
            if (response.data.message === "all notifications has marked as read") {
                if (accessToken) {
                    dispatch(fetchNotifications(accessToken) as any); 
                }
            }
        } catch (err) {
        }
    };

    const deleteAllNotifications = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/notification/api/delete/`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken || ''}`, 
                },
            });

            if (response.data.message === "all notifications has been deleted !") {
                dispatch(fetchNotifications(accessToken || '') as any); 
            }
        } catch (err:any) {
            console.log("Error deleting notifications:", err.response?.data);
        }
    };

    return (
        <div className="relative">
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
                <div className="absolute right-0  w-64 bg-[#001529] shadow-lg rounded-md overflow-hidden z-[90]">
                    <div className="p-2 border-b">
                        <h4 className="font-bold">Notifications</h4>
                        <button onClick={markAllAsRead} className="text-xs text-blue-400 hover:underline">
                            Mark All as Read
                        </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification:any, index:number) => (
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
                                        {notification.subject == "INVITATION"   && (
                                            <div className="flex space-x-2">
                                                <button 
                                                onClick={() => router.push("/req")}
                                                className="text-xs text-white bg-gray-500 px-2 py-1 rounded-md">
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

export default Notification;