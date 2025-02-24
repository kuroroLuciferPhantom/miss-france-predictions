import React, { useState, useEffect, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { showToast } from '../components/ui/Toast';
import { auth } from '../config/firebase';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  const [showLoading, setShowLoading] = useState(false);
  const toastShown = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setShowLoading(true), 300);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Force le rechargement des infos utilisateur
          await currentUser.reload();
          if (!currentUser.emailVerified) {
            showToast.error("📧 Veuillez vérifier votre email avant d'accéder à cette page");
            navigate('/check-email');
          }
        }
      } catch (error) {
        console.error('Erreur de vérification:', error);
      }
    };

    if (user && !loading) {
      verifyEmail();
    }
  }, [user, loading, navigate]);

  if (loading) {
    if (!showLoading) return null;
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 dark:border-pink-400 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    if (!toastShown.current) {
      showToast.error("🔒 Vous devez être connecté pour accéder à cette page.");
      toastShown.current = true;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;