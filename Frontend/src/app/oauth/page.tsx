"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const OAuthCallback = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get('code'); 
    // $1.log(code)

    if (code) {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_URL}/register/intra-42/`, { code }) 
        .then((response) => {
          // $1.log('OAuth successful:', response.data);
          window.localStorage.setItem('accessToken', response.data.access);
          router.push("/dashboard");
        })
        .catch((error) => {
          // $1.error('OAuth error:', error);
         
        })
        .finally(() => {
          setLoading(false);  
        });
    } else {
   
      // $1.error('OAuth code is missing or invalid');
      setLoading(false); 
    }
  }, [searchParams]); 

  if (loading) {
    return null;  
  }

  return null;  
};

const OAuthCallbackWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <OAuthCallback />
  </Suspense>
);

export default OAuthCallbackWrapper;