import React, {  useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { showToast } from '../components/ui/Toast';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthContext();
  const [showLoading, setShowLoading] = useState(false);
  const toastShown = useRef(false); // Ref pour éviter les multiples affichages
 
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setShowLoading(true), 300);
    }
    return () => clearTimeout(timer);
  }, [loading]);
 
  if (loading) {
    if (!showLoading) return null;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }
 
  if (!user) {
    if (!toastShown.current) {
      showToast.error("🔒 Vous devez être connecté pour accéder à cette page.");
      toastShown.current = true; // Marque le toast comme affiché
    }
    return <Navigate to="/login" replace />;
  }
 
  return children;
 };

 export default PrivateRoute;