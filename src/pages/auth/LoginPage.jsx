import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// ... (GoogleButton component reste inchangé)

const LoginPage = () => {
  // ... (reste du code inchangé jusqu'au bouton)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      {/* ... (reste du JSX inchangé jusqu'au bouton d'inscription) */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Créer un compte
        </button>
      </div>
    </div>
  );
};

export default LoginPage;