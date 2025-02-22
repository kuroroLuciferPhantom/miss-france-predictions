// src/pages/auth/AuthActionPage.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { 
  verifyPasswordResetCode, 
  confirmPasswordReset,
  applyActionCode 
} from 'firebase/auth';

const AuthActionPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [mode, setMode] = useState(null);
  
  useEffect(() => {
    const mode = searchParams.get('mode');
    const actionCode = searchParams.get('oobCode');
    
    if (!actionCode) {
      setError('Code d\'action invalide');
      return;
    }

    setMode(mode);

    switch (mode) {
      case 'verifyEmail':
        handleVerifyEmail(actionCode);
        break;
      case 'resetPassword':
        handleResetPassword(actionCode);
        break;
      default:
        setError('Action non reconnue');
    }
  }, [searchParams, navigate]);

  const handleVerifyEmail = async (actionCode) => {
    try {
      await applyActionCode(auth, actionCode);
      // Email vérifié avec succès
      navigate('/dashboard', { 
        state: { message: 'Email vérifié avec succès!' } 
      });
    } catch (error) {
      setError('Erreur lors de la vérification de l\'email');
    }
  };

  const handleResetPassword = async (actionCode) => {
    try {
      // Vérifie si le code est valide
      await verifyPasswordResetCode(auth, actionCode);
      // Si valide, redirige vers la page de réinitialisation
      navigate('/reset-password', { 
        state: { actionCode } 
      });
    } catch (error) {
      setError('Code de réinitialisation invalide ou expiré');
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        {mode === 'verifyEmail' && (
          <p>Vérification de votre email en cours...</p>
        )}
        {mode === 'resetPassword' && (
          <p>Vérification du code de réinitialisation...</p>
        )}
      </div>
    </div>
  );
};

export default AuthActionPage;