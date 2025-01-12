// // hooks/useProtectRoutes.js
// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';

// const useProtectRoutes = () => {
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const token = localStorage.getItem("accessToken");

//       // If there's no token, redirect to login
//       if (!token) {
//         // $1.log("No access token found. Redirecting to login...");
//         router.push('/'); // Adjust this to your login route
//         return;
//       }

//       try {
//         const response = await axios.get("http://localhost:9003/account/profile/", {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         // Handle the successful response as needed
//         // $1.log(response.data);
//       } catch (error) {
//         if (error.response) {
//           // Check for 401 status
//           if (error.response.status === 401) {
//             // $1.log("Unauthorized access. Redirecting to login...");
//             router.push('/'); // Adjust this to your login route
//           } else {
//             // $1.log("An error occurred:", error.response.data);
//           }
//         } else {
//           // $1.log("Error connecting to the server:", error.message);
//         }
//       }
//     };

//     fetchProfile();
//   }, [router]);
// };

// export default useProtectRoutes;
