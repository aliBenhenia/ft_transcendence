'use client'

import React, { useEffect, useState, useRef, use } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { VscSend } from "react-icons/vsc";
import { FaGamepad } from "react-icons/fa";
import Link from 'next/link'
import {message} from 'antd'

import sortLastConversations from '@/services/sortLastConversations'
import FetchProfile from '@/services/FetchProfile'

export default function ChatPage() {
  const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'localhost:9003';
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [users, setUsers] = useState<any>([])
  const [filteredUsers, setFilteredUsers] = useState<any>([])
  const [messages, setMessages] = useState<any>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [status, setStatus] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  const online = useSelector((state: any) => state.notifications.online)

  useEffect(() => {
    fetchFriends()

    const socket = openSocket()
    console.log('Socket:', socket)
    return () => {
      console.log('closed socket:', socket)
      socket.close()
    }
  }, [selectedUser])

  useEffect(() => {
    if (selectedUser && online.sender === selectedUser.on_talk) {
      setStatus(online.case === 'ONLINE')
    }
  }, [online, selectedUser])

  useEffect(() => {
    const filtered = users.filter(
      (user:any) =>
        user.is_blocked === false &&
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchQuery, users])

  const fetchFriends = async () => {
    if (!token) return
    await FetchProfile(token)
    setError(null)
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/friends/list/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!data.vide && data.information) {
        const res = await sortLastConversations(data.information)
        setUsers(res)
        setFilteredUsers(res)
      } else {
        setError('No friends found.')
      }
    } catch (err) {
      setError('Failed to load friends list. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const fetchMessages = async (username:any, is_blocked:any, user:any) => {
    if (!token) return
    setError(null)
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/conversation/?account=${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.vide === false) {
        setMessages(data.data || [])
        setStatus(data['sender-info'].online)
        setSelectedUser({
          ...data['sender-info'],
          is_blocked,
        })
      } else {
        setMessages([])
        setSelectedUser({
          on_talk: user.username,
          is_blocked,
          picture: user.picture,
          online: data.online,
          full_name: user.full_name,
        })
        setStatus(data.online)
      }
    } catch (err) {
      setError('Failed to load messages. Please try again.')
    } finally {
      setLoading(false)
      setIsMenuOpen(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage || !selectedUser?.on_talk || isSending || !token) return
    if (newMessage.length > 700)
    {
      message.error('message must be less then 700');
      return;
    }
    const messagePayload = {
      account: selectedUser.on_talk,
      message: newMessage,
    }

    const newMessageEntry = {
      sender: 'me',
      message: newMessage,
      time: new Date().toISOString(),
    }

    setMessages((prevMessages:any) => [...prevMessages, newMessageEntry])
    setNewMessage('')
    setError(null)
    setIsSending(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/message/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      })
      const result = await response.json()
      if (!result.success) {
        throw new Error(result.message || 'Error sending message.')
      }
    } catch (err) {
      setError('Failed to send message. Please try again.')
      setMessages((prevMessages:any) => prevMessages.filter((msg:any) => msg !== newMessageEntry))
    } finally {
      setTimeout(() => {
        setIsSending(false)
      }, 2000)
    }
  }

  const openSocket = () => {
    if (!token) return { close: () => {} }
    const socket = new WebSocket(`ws://${socketUrl.slice(7)}/ws/connection/?token=${token}`)

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.case === 'NEW_MESSAGE') {
        if (selectedUser && data.sender === selectedUser.on_talk) {
          addMessage(data.sender)
          // if (messagesEndRef.current) {
          //   messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
          // }
        }
      }
    }

    return socket
  }

  const addMessage = async (username:any) => {
    if (!selectedUser || selectedUser.on_talk !== username || !token) return
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/conversation/?account=${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (!data.vide) {
        setMessages(data.data || [])
      }
    } catch (err) {
      console.log('Error fetching new messages:', err)
    }
  }

  const handleKeyPress = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage()
    }
  }

  const sendGameRequest = async () => {
    if (!selectedUser?.on_talk || !token) return
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/send_game_invite/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to_invite: selectedUser.on_talk }),
      })
      const data = await response.json()
      if (!data.success) {
        throw new Error(data.message || 'Error sending game request.')
      }
    } catch (err) {
      // message
    }
  }
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ping pong Chat</h1>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden bg-gray-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-full md:w-80 bg-gray-800 overflow-y-auto transition-all duration-300 ease-in-out ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
          <div className="p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          {/* {loading && (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )} */}
          {error && <div className="p-4 text-red-500">{error}</div>}
          <ul className="space-y-2 p-4">
            {filteredUsers.map((user:any) => (
              <li key={user.username}>
                <button
                  onClick={() => fetchMessages(user.username, user.is_blocked, user)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    selectedUser?.on_talk === user.username ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
                >
                  <div className="relative">
                    <img src={user.picture} alt={user.full_name} className="w-10 h-10 rounded-full" />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
                          (user.username === selectedUser?.on_talk && status )? 'bg-green-500' : 'bg-gray-500'
                        }`}
                      >
                      </span>
                      <span
                        className={`animate-ping opacity-75 absolute bottom-0 right-0 w-3 h-3 rounded-full border-2  ${
                          (user.username === selectedUser?.on_talk && status )? 'bg-green-500' : 'bg-gray-500'
                        }`}
                      >
                      </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.full_name}</p>
                    
                      <p  className="text-xs text-gray-400 font-bold hover:text-slate-200">@{user.username}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-gray-800 p-4 flex items-center space-x-3 border-b border-gray-700">
                <div className="relative">
                <Link href={`/profile/${selectedUser.on_talk}`}>
                  <img src={selectedUser.picture} alt={selectedUser.full_name} className="w-10 h-10 rounded-full" />
                </Link>
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
                      status ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  ></span>
                  <span
                    className={`animate-ping opacity-75 absolute bottom-0 right-0 w-3 h-3 rounded-full border-2  ${
                      status ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  ></span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{selectedUser.full_name}</h2>
                  <p className="text-sm text-gray-400">{status ? 'Online' : 'Offline'}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500">No messages yet. Start a conversation!</div>
                ) : (
                  messages.map((msg:any, index:number) => (
                    <div
                      key={index}
                      className={`flex ${msg.sender !== selectedUser.on_talk ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg ${
                          msg.sender !== selectedUser.on_talk
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-200'
                        }`}
                      >
                        <p className="break-words">{msg.message}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.time).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {/* <div ref={messagesEndRef} /> */}
              </div>

              {/* Message Input */}
              <div className="bg-gray-800 p-4 border-t border-gray-700 fixed bottom-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    onClick={sendMessage}
                    disabled={loading || !newMessage.trim() || isSending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-200"
                  >
                    {isSending ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      // <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      //   <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      // </svg>
                      <VscSend />
                    )}
                  </button>
                  <button
                  onClick={sendGameRequest}
                  className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <FaGamepad />
                  </button>
                </div>
                {error && <div className="text-red-500 mt-2">{error}</div>}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 text-lg">Select a friend to start chatting</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

