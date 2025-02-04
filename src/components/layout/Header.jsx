import React from 'react';
import { Link } from 'react-router-dom';
import ProfileDropdown from '../profile/ProfileDropdown';
import { useAuthContext } from '../../contexts/AuthContext';

const Header = () => {
  const { user } = useAuthContext();

  return (
    <header className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Titre */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Miss France Predictions
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <nav className="flex space-x-4">
                  <Link 
                    to="/dashboard" 
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                </nav>
                <ProfileDropdown />
              </>
            ) : (
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link 
                  to="/signup" 
                  className="px-4 py-2 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors shadow-sm text-sm font-medium"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;