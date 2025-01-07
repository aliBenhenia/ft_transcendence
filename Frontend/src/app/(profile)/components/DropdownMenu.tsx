import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface MenuItem {
  key: string;
  label: string;
  icon: JSX.Element;
  route: string | (() => void);
}

const DropdownMenu: React.FC = () => {
  const router = useRouter();
  const profileState = useSelector((state: RootState) => state.profile);
  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/');
  };

  const navigate = (route: any) => {
    router.push(route);
  };

  const menuItems: MenuItem[] = [
    {
      key: '1',
      label: 'Profile',
      icon: <FaUser className="text-gray-300 mr-2" />,
      route: '/profile',
    },
    {
      key: '2',
      label: 'Settings',
      icon: <FaCog className="text-gray-300 mr-2" />,
      route: '/setting',
    },
    {
      key: '3',
      label: 'Logout',
      icon: <FaSignOutAlt className="text-red-400 mr-2" />,
      route: handleLogout,
    },
  ];

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative hidden sm:block">
      <button
        type="button"
        className="w-8 h-8 rounded-full bg-gray-700 text-white flex justify-center items-center focus:outline-none"
        onClick={() => setIsOpen(!isOpen)} // Toggle dropdown visibility
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : 'false'}
      >
        <img
          src={profileState.picture}
          alt="Avatar"
          className="w-8 h-8 rounded-full"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-10 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-[99] mt-2"
        >
          <div className="py-2">
            {menuItems.map((item) => (
              <div
                key={item.key}
                onClick={item.key === '3' ? handleLogout : () => navigate(item.route)}
                className="flex items-center px-4 py-2 text-white cursor-pointer hover:bg-gray-600"
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
