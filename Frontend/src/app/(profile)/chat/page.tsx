'use client'

import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BsChatSquareHeartFill } from 'react-icons/bs'
import { FaSearch } from 'react-icons/fa'
import { IoMdSend } from 'react-icons/io'
import "./chat.css"


import sortLastConversations from '@/services/sortLastConversations'
import FetchProfile from '@/services/FetchProfile'

export default function Component() {
  const messagesEndRef = useRef<any>(null)
  const [users, setUsers] = useState<any>([])
  const [filteredUsers, setFilteredUsers] = useState<any>([])
  const [messages, setMessages] = useState<any>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [status, setStatus] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  const online = useSelector((state: any) => state.notifications.online)

  useEffect(() => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  useEffect(() => {
    fetchFriends()
    const socket = openSocket()
    return () => {
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
    try {
      const response = await fetch('http://127.0.0.1:9003/friends/list/', {
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
    }
  }
  
  const fetchMessages = async (username:any, is_blocked:any, user:any) => {
    if (!token) return
    setError(null)
    try {
      const response = await fetch(`http://127.0.0.1:9003/chat/conversation/?account=${username}`, {
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
    }
  }

  const sendMessage = async () => {
    if (!newMessage || !selectedUser?.on_talk || isSending || !token) return

    const messagePayload = {
      account: selectedUser.on_talk,
      message: newMessage,
    }

    const newMessageEntry = {
      sender: 'me',
      message: newMessage,
      time: new Date().toISOString(),
    }

    setMessages((prevMessages:any) => [...prevMessages, newMessageEntry]) // ma3loma n9der nsiti or nfetchi l messages fi kol send
    setNewMessage('')
    setError(null)
    setIsSending(true)

    try {
      const response = await fetch('http://127.0.0.1:9003/chat/message/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messagePayload),
      })
      const result = await response.json()
      // fetchMessages(selectedUser.on_talk, selectedUser.is_blocked, selectedUser);
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
    const socket = new WebSocket(`ws://127.0.0.1:9003/ws/connection/?token=${token}`)

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.case === 'NEW_MESSAGE') {
        if (selectedUser && data.sender === selectedUser.on_talk) {
          addMessage(data.sender)
          if (messagesEndRef.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
          }
        }
      }
    }

    return socket
  }

  const addMessage = async (username:any) => {
    if (!selectedUser || selectedUser.on_talk !== username || !token) return
    try {
      const response = await fetch(`http://127.0.0.1:9003/chat/conversation/?account=${username}`, {
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

  const handleKeyPress = (event:any) => {
    if (event.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="flex h-screen  text-white chatContainer"
    >
      {/* Sidebar */}
      <div className="w-full md:w-1/4 border-r border-gray-700 overflow-y-auto flex flex-col bg-gray-900">
        <h2 className="p-4 text-lg font-semibold flex items-center justify-center gap-3">
          <span className="hidden md:block">Messenger</span>
          <BsChatSquareHeartFill className="text-blue-500" />
        </h2>
        <div className="px-4 mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-700 bg-gray-800 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        {error && <div className="p-4 text-red-500">{error}</div>}
        <ul className="overflow-y-auto flex-grow">
          {filteredUsers && filteredUsers.length > 0 ? (
            filteredUsers.map((user:any) => (
              <li
                key={user.username}
                className={`p-4 cursor-pointer hover:bg-gray-800 transition-colors ${
                  selectedUser?.on_talk === user.username ? 'bg-gray-700' : ''
                }`}
                onClick={() => fetchMessages(user.username, user.is_blocked, user)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={user.picture}
                      alt={user.full_name}
                      className="w-10 h-10 rounded-full"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                        user.online ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    ></span>
                  </div>
                  <span className="font-medium text-gray-300">{user.full_name}</span>
                </div>
              </li>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No friends available.</div>
          )}
        </ul>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gray-800 p-4 flex items-center space-x-3">
          {selectedUser && (
            <>
              <div className="relative">
                <img
                  src={selectedUser.picture}
                  alt={selectedUser.full_name}
                  className="h-10 w-10 rounded-full"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                    status ? 'bg-green-500' : 'bg-gray-500'
                  }`}
                ></span>
              </div>
              <h2 className="text-lg font-semibold">{selectedUser.full_name}</h2>
            </>
          )}
          {!selectedUser && <h2 className="text-lg font-semibold">Select a friend to chat</h2>}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading && <div className="text-center">Loading messages...</div>}
          {messages.length === 0 && !loading && (
            <div className="text-center text-gray-500">No messages yet.</div>
          )}
          {messages.map((msg:any, index:any) => (
            <div
              key={index}
              className={`flex ${msg.sender !== selectedUser?.on_talk ? 'justify-end' : 'justify-start'}`}
            >
                    <div className={`"relative max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg shadow-lg transition-transform transform  duration-200 ease-in-out ${
    msg.sender !== selectedUser?.on_talk 
      ? 'bg-blue-600 text-white' 
      : 'bg-gray-700 text-white'
  }"`}>
    <div className="">
      {msg.sender === selectedUser?.on_talk && (
        <img 
          src={selectedUser.picture} 
          alt={`${msg.sender}'s avatar`} 
          className=" w-8 h-8 rounded-full border-2 border-white shadow-lg"
        />
      )}
      
      <p className={`break-words ${msg.sender === selectedUser?.on_talk ? 'pl-3' : ''}`}>
        {msg.message}
      </p>
  </div>
  
  <div className="text-xs text-gray-400 mt-1">
    {new Date(msg.time).toLocaleString()}
  </div>
</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-gray-800 p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-gray-700 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              disabled={loading || !newMessage.trim()}
            >
              <IoMdSend />
            </button>
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
      </div>
    </div>
  )
}