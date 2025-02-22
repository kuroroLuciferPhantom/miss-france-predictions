// src/pages/auth/ResetPasswordPage.jsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '../../config/firebase';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const actionCode = location.state?.actionCode;
    
    if (!actionCode) {
      setError('Code de réinitialisation manquant');
      return;
    }

    try {
      await confirmPasswordReset(auth, actionCode, newPassword);
      navigate('/login', { 
        state: { message: 'Mot de passe mis à jour avec succès!' } 
      });
    } catch (error) {
      setError('Erreur lors de la réinitialisation du mot de passe');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Réinitialiser le mot de passe</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Nouveau mot de passe"
        className="w-full p-2 border rounded mb-4"
      />
      <button 
        type="submit"
        className="w-full bg-pink-500 text-white p-2 rounded"
      >
        Confirmer
      </button>
    </form>
  );
};

export default ResetPasswordPage;