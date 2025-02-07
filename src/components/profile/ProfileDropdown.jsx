import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';

const ProfileDropdown = ({ isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (isMobile) {
    return (
      <div className="space-y-1 py-2" ref={dropdownRef}>
        <div className="px-4 py-2 text-sm text-gray-700">
          <div className="font-medium mb-1">{user?.username || user?.email?.split('@')[0]}</div>
          <div className="text-gray-500 text-xs">{user?.email}</div>
        </div>
        <Link
          to="/profile"
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <User className="w-4 h-4 mr-3" />
          Mon profil
        </Link>
        <div className="pt-1 mt-1 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Déconnexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <User className="w-5 h-5" />
        <span className="hidden md:inline font-medium">
          {user?.username || user?.email?.split('@')[0]}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-4 h-4 mr-3" />
            Mon profil
          </Link>
          <hr className="my-1" />
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;