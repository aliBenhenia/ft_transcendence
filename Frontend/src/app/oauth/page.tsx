"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

const OAuthCallback = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const code = searchParams.get('code'); 
    console.log(code)

    if (code) {
      axios
        .post('/api/auth/42/register', { code }) 
        .then((response) => {
          console.log('OAuth successful:', response.data);
        
        })
        .catch((error) => {
          console.error('OAuth error:', error);
         
        })
        .finally(() => {
          setLoading(false);  
        });
    } else {
   
      console.error('OAuth code is missing or invalid');
      setLoading(false); 
    }
  }, [searchParams]); 

  if (loading) {
    return <div>Loading...</div>;  
  }

  return null;  
};

export default OAuthCallback;
