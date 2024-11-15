import React from 'react';
import { FaTrophy } from 'react-icons/fa';
import { Row, Col } from 'antd';
import Level from './level';
import Link from 'next/link';
const picUrl2 = 'https://starryai.com/cdn-cgi/image/format=avif,quality=90/https://cdn.prod.website-files.com/61554cf069663530fc823d21/6369feceabcbabf851ebbc64_download-63-min.png';

const friendsList = Array.from({ length: 30 }, (_, index) => {
  return {
    id: index + 1,
    avatar: `https://randomuser.me/api/portraits/men/${index % 100}.jpg`, // Random user avatar URL
    username: `user_${index + 1}`,
    level: Math.floor(Math.random() * 50) + 1, // Random level between 1 and 50
    points: Math.floor(Math.random() * 5000) + 100, // Random points between 100 and 5100
    losses: Math.floor(Math.random() * 20), // Random losses between 0 and 19
    wins: Math.floor(Math.random() * 50) // Random wins between 0 and 49
  };
});

const ProfileCard = () => (
  <div className="relative bg-[#00152993]   rounded-lg shadow-lg overflow-hidden w-full mx-auto"
    style={{ height: '400px' }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-blue-500 h-32"></div>
    <div className="relative z-10 flex flex-col items-center p-6 pt-20">
      <div className="relative">
        <img
          className="w-28 h-28 rounded-full border-4 border-white shadow-lg transition-transform transform hover:scale-110"
          src={picUrl2}
          alt="Avatar"
        />
      </div>
      <div className="mt-4 text-center">
        <h2 className="text-2xl font-bold text-white">John Doe</h2>
      </div>
      <div className="mt-6 flex w-full justify-around text-white">
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold">10</span>
          <span className="text-sm">Loses</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold">20</span>
          <span className="text-sm">Wins</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold">50</span>
          <span className="text-sm">Points</span>
        </div>
      </div>
      <div className="mt-6 w-full px-4">
          <div className='text-white flex'>
          <Level percent={60} />
          </div>
      </div>
      <button className="absolute top-4 right-4 bg-white text-blue-700 font-semibold py-1 px-4 rounded-full shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50">
        Edit
      </button>
    </div>
  </div>
);


const AchievementsCard = () => (
  <div className=" bg-[#00152993] p-6 rounded-lg shadow-lg overflow-hidden w-full mx-auto"
  style={{ height: '300px' }}
  >
    <h3 className="text-2xl font-bold mb-4 text-white">Achievements</h3>
    <div className="flex flex-wrap gap-10 justify-center">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center text-yellow-500 transition-transform transform hover:scale-110"
        >
          <FaTrophy className="w-12 h-12" />
          <span className="mt-2 text-white text-sm">Achievement {index + 1}</span>
        </div>
      ))}
    </div>
  </div>
);

const FriendsListCard = () => (
  <div className="bg-[#00152993] p-6 rounded-lg shadow-lg overflow-hidden w-full mx-auto"
    style={{ height: '300px' }}
  >
    <h3 className="text-2xl font-bold mb-4 text-white">Friends List</h3>
    <ul className="max-h-60 overflow-y-auto space-y-4 pr-2 flex flex-wrap gap-7" 
  
    >
      {friendsList.map((item, index) => (
        <Link href={`/profile/${item.id}`} key={index}>
        <li  className="relative flex items-center transition-transform transform hover:scale-110">
        <div className="relative group">
          <img
            className="scale-86 w-16 h-16 rounded-full mr-3 border-4 border-white shadow-lg transition-transform transform group-hover:scale-110"
            src={item.avatar}
            alt={`Friend ${index + 1}`}
          />
          {/* <span className="absolute -inset-1 flex items-center justify-center text-lg text-white bg-blue-600 opacity-0 group-hover:opacity-100 bg-opacity-80 rounded-full p-2 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0 transform group-hover:scale-105">
            {item.username}
          </span> */}
        </div>
      </li>
      </Link>
      ))}
    </ul>
  </div>
);
const Cards = () => (
  <div className="p-6 w-full text-center">
  <Row gutter={[16, 16]}>
    <Col span={24}>
      <ProfileCard />
    </Col>
    <Col xs={24} md={12}>
      <AchievementsCard />
    </Col>
    <Col xs={24} md={12}>
      <FriendsListCard />
    </Col>
  </Row>
</div>
);

export default Cards;
