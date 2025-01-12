'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import {message} from 'antd'

interface SendResetLinkProps {
  email: string
}

export default function SendResetLink({ email }: SendResetLinkProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const sendResetLink = async () => {
    setLoading(true)
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/secure/request-password-reset/`,
        { email }
      )
      
     message.success(response?.data?.message);
    } catch (error) {
     
      // $1.error('Error sending reset link:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
        <h3 className='text-gray-300'>you forgot a password ?</h3>
        <button
        onClick={sendResetLink}
        disabled={loading}
        className={`w-full py-2 mt-3 px-4 rounded-md text-white font-semibold transition-colors ${
            loading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        >
        {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
    </div>
  )
}

