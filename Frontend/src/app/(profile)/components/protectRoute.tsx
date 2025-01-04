

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { updateProfile } from '@/store/slices/profileSlice';
import FetchProfile from '@/services/FetchProfile';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;// fixed the issue
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const getProfileData = async () => {
      if (!token) {
        router.push('/'); 
        return;
      }
      try {
        const data = await FetchProfile(token);
        dispatch(updateProfile(data.informations));
        setIsLoading(false); 
      } catch (err) {
        router.push('/'); 
      }
    };
    getProfileData();
  }, [token, dispatch, router]);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return <>{children}</>;
};

export default ProtectedRoute;