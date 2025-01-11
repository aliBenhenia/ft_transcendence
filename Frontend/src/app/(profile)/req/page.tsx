'use client'

import React,{ useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchNotifications } from '@/store/slices/notificationsSlice'
import { FaBell, FaCheck, FaTimes, FaUserFriends, FaBan, FaUser, FaArrowAltCircleRight, FaUnlock } from 'react-icons/fa'
import axios from 'axios'
import customAxios from '@/services/apiClient'
import { useRouter } from 'next/navigation'
import {message} from "antd";
import { TbLockSearch } from "react-icons/tb";
import { RootState } from '@/store/store'

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
  count?: number;
}

const TabButton = ({ active, onClick, icon: Icon, label, count = 0 }:TabButtonProps) => (
  <motion.button
    className={`relative flex items-center p-4 rounded-2xl transition-colors ${
      active
        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
    }`}
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Icon className="text-xl" />
    <span className="hidden md:block ml-2">{label}</span>
    {count > 0 && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold"
      >
        {count}
      </motion.div>
    )}
  </motion.button>
)

const CardWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 p-4 rounded-2xl shadow-lg mb-4 backdrop-blur-sm border border-white/10"
  >
    {children}
  </motion.div>
)
interface FriendList {
  username?: string;
  full_name: string;
  picture: string;
  online: boolean;
  is_blocked: boolean;
  blocked_by: string;
}
interface InvitationProps {
  username: string;
  full_name: string;
  picture: string;
}
interface BlockedUserProps {
  username: string;
  full_name: string;
  picture: string;
}
export default function NotificationsPage() {
  const dispatch = useDispatch()
  const router = useRouter()
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  const { notifications } = useSelector((state: RootState) => state.notifications)

<<<<<<< HEAD
  const [activeTab, setActiveTab] = useState('friends')
=======
  const [activeTab, setActiveTab] = useState('invitations')
>>>>>>> origin/main
  const [invitations, setInvitations] = useState<InvitationProps[]>([])
  const [friendsList, setFriendsList] = useState<FriendList[]>([])
  const [blockedList, setBlockedList] = useState<BlockedUserProps[]>([])
  const [loading, setLoading] = useState(true)
  const [isCancel, setIsCancel] = useState(false)
  const [hoveredUser, setHoveredUser] = useState<string>()

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchNotifications(accessToken) as any) // Pass the accessToken as an argument
    }
  }, [dispatch, accessToken])

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return

      try {
        const [invitationsRes, friendsRes] = await Promise.all([
          customAxios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends/invitations/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
          customAxios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends/list/`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          }),
        ])

        if (invitationsRes.status === 200 && !invitationsRes.data.vide) {
          setInvitations(invitationsRes.data.information)
        }
        else if (invitationsRes.data.vide)
            setInvitations([])

        if (friendsRes.status === 200 && !friendsRes.data.vide) {
          const friends = friendsRes.data.information
          setFriendsList(friends.filter((friend:any) => !friend.is_blocked))
          setBlockedList(
            friends.filter(
              (friend:any) => friend.is_blocked && friend.blocked_by !== friend.username
            )
          )
        }
      } catch (err) {
        console.log('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [notifications, isCancel, activeTab, accessToken])
  const handleBlockUser = async (username:any) => {
    const token = localStorage.getItem("accessToken");
    if (!token || !username) {
      message.error("Invalid token or username.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/friends/block/`, {
        username: username,
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.data.success) {
        message.success("User has been blocked successfully!");
        setIsCancel(!isCancel)
      }
    } catch (error:any) {
      const errorMessage = error.response ? error.response.data.error : error.message;
      message.error(errorMessage);
      // console.log("Error blocking user:", errorMessage);
    }
  };

  const handleAction = async (action: any, username: any) => {
    if (!accessToken) return

    const actions = {
      accept: {
        url: `${process.env.NEXT_PUBLIC_API_URL}/friends/accept/`,
        successMessage: 'Invitation accepted! You are now friends.',
      },
      decline: {
        url: `${process.env.NEXT_PUBLIC_API_URL}/friends/decline/`,
        successMessage: 'Invitation declined successfully.',
      },
      unblock: {
        url: `${process.env.NEXT_PUBLIC_API_URL}/friends/unblock/`,
        successMessage: 'User has been unblocked successfully!',
      },
    }

    try {
      const response = await axios.post(
        (actions as Record<string, { url: string; successMessage: string }>)[action].url,
        { username },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )

      if (response.data.success) {
        setIsCancel(!isCancel)
      }
    } catch (error) {
      // Show error message here (replace with your toast/message system)
      console.log('Action failed:', error)
    }
  }

  const tabContent:any = {
    invitations: (
      <AnimatePresence mode="wait">
        {invitations.length > 0 ? (
          <motion.div layout className="space-y-4">
            {invitations.map((invitation, index) => (
              <CardWrapper key={invitation.username}>
                <div className="flex items-center justify-between">
                  <motion.div
                    className="flex items-center space-x-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200" />
                      <img
                        src={invitation.picture}
                        alt={invitation.full_name}
                        className="relative w-14 h-14 rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{invitation.full_name}</h4>
                      <p className="text-sm text-gray-300">@{invitation.username}</p>
                    </div>
                  </motion.div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
                      onClick={() => handleAction('accept', invitation.username)}
                    >
                      <FaCheck className="text-lg" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                      onClick={() => handleAction('decline', invitation.username)}
                    >
                      <FaTimes className="text-lg" />
                    </motion.button>
                  </div>
                </div>
              </CardWrapper>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-8"
          >
            No pending invitations
          </motion.div>
        )}
      </AnimatePresence>
    ),
    friends: (
      <AnimatePresence mode="wait">
        {friendsList.length > 0 ? (
          <motion.div layout className="space-y-4">
            {friendsList.map((friend, index) => (
              <CardWrapper key={friend.username}>
                <div className="flex items-center justify-between">
                  <motion.div
                    className="flex items-center space-x-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onHoverStart={() => setHoveredUser(friend.username)}
                    onHoverEnd={() => setHoveredUser("")}
                  >
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200" />
                      <img
                        src={friend.picture}
                        alt={friend.full_name}
<<<<<<< HEAD
                        className="relative w-14 h-14 rounded-full object-cover"
=======
                        className="relative w-14 h-14 rounded-full object-cover cursor-pointer "
                        onClick={() => router.push(`/profile/${friend.username}`)}
>>>>>>> origin/main
                      />
                      {friend.online && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-indigo-900" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold flex items-center gap-2">
                        {friend.full_name}
<<<<<<< HEAD
                        {hoveredUser === friend.username && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-sm text-gray-400"
                          >
                            • {friend.online ? 'Online' : 'Offline'}
                          </motion.span>
                        )}
=======
                        
>>>>>>> origin/main
                      </h4>
                      <p className="text-sm text-gray-300">@{friend.username}</p>
                    </div>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                    onClick={() => handleBlockUser(friend.username)}
                  >
                    <TbLockSearch className="text-lg" />
                  </motion.button>
                </div>
              </CardWrapper>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-8"
          >
            No friends yet
          </motion.div>
        )}
      </AnimatePresence>
    ),
    blocked: (
      <AnimatePresence mode="wait">
        {blockedList.length > 0 ? (
          <motion.div layout className="space-y-4">
            {blockedList.map((user, index) => (
              <CardWrapper key={user.username}>
                <div className="flex items-center justify-between">
                  <motion.div
                    className="flex items-center space-x-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200" />
                      <img
                        src={user.picture}
                        alt={user.full_name}
                        className="relative w-14 h-14 rounded-full object-cover grayscale"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">{user.full_name}</h4>
                      <p className="text-sm text-gray-300">@{user.username}</p>
                    </div>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-white text-indigo-900 rounded-xl hover:bg-gray-100 transition-colors"
                    onClick={() => handleAction('unblock', user.username)}
                  >
                    <FaUnlock />
                    <span>Unblock</span>
                  </motion.button>
                </div>
              </CardWrapper>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-400 py-8"
          >
            No blocked users
          </motion.div>
        )}
      </AnimatePresence>
    ),
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10"
      >
        <div className="p-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white text-center mb-8"
          >
            Friends & Invitations
          </motion.h1>

          <div className="flex justify-center space-x-4 mb-8">
<<<<<<< HEAD
            <TabButton
=======
            {/* <TabButton
>>>>>>> origin/main
              active={activeTab === 'friends'}
              onClick={() => setActiveTab('friends')}
              icon={FaUserFriends}
              label="Friends"
              count={friendsList.length}
<<<<<<< HEAD
            />
=======
            /> */}
>>>>>>> origin/main
            <TabButton
              active={activeTab === 'invitations'}
              onClick={() => setActiveTab('invitations')}
              icon={FaBell}
              label="Invitations"
              
              count={invitations.length}
            />
<<<<<<< HEAD
            <TabButton
=======
            {/* <TabButton
>>>>>>> origin/main
              active={activeTab === 'blocked'}
              onClick={() => setActiveTab('blocked')}
              icon={FaBan}
              label="Blocked"
              count={blockedList.length}
<<<<<<< HEAD
            />
=======
            /> */}
>>>>>>> origin/main
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[600px] px-2 custom-scrollbar">
              {tabContent[activeTab]}
            </div>
          )}
        </div>
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
}