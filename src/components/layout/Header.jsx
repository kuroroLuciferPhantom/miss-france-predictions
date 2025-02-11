import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ShieldCheck } from 'lucide-react';
import ProfileDropdown from '../profile/ProfileDropdown';
import { useAuthContext } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import useTheme from '../../hooks/useTheme';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  // Effet pour vérifier si l'utilisateur est admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user?.uid) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setIsAdmin(userDoc.exists() && userDoc.data().isAdmin === true);
      }
    };

    checkAdminStatus();
  }, [user]);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Titre - pas besoin de dark mode car c'est déjà un gradient */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src={isDark ? "/logo_misspronos_white.svg" : "/logo_misspronos.svg"}
              alt="Miss'Pronos Logo"
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Miss'Pronos
            </span>
          </Link>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <div className="relative">
                    <button
                      onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                      className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ShieldCheck className="h-5 w-5" />
                      <span>Admin</span>
                    </button>
                    {adminMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50">
                        <div className="py-1">
                          <Link
                            to="/admin/results"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
                            onClick={() => setAdminMenuOpen(false)}
                          >
                            Résultats Miss France
                          </Link>
                          <Link
                            to="/admin/scores"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
                            onClick={() => setAdminMenuOpen(false)}
                          >
                            Calcul des scores
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <ProfileDropdown />
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-white bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 rounded-lg hover:from-pink-600 hover:to-purple-600 dark:hover:from-pink-700 dark:hover:to-purple-700 transition-colors shadow-sm text-sm font-medium"
                >
                  Inscription
                </Link>
              </>
            )}
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </div>

          {/* Bouton Menu Mobile */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 shadow-lg">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <>
                    <Link
                      to="/admin/results"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Résultats Miss France
                    </Link>
                    <Link
                      to="/admin/scores"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Calcul des scores
                    </Link>
                  </>
                )}
                <div className="px-3 py-2">
                  <ProfileDropdown isMobile />
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 text-white hover:from-pink-600 hover:to-purple-600 dark:hover:from-pink-700 dark:hover:to-purple-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;