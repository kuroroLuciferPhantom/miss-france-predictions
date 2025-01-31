import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider } from 'firebase/auth';

// ... (GoogleButton component reste inchangé)

const LoginPage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [error, setError] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('Tentative de', isCreatingAccount ? 'création de compte' : 'connexion');
    
    try {
      if (isCreatingAccount) {
        console.log('Création du compte avec:', formData.email);
        const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        console.log('Compte créé:', user);
        
        await updateProfile(user, {
          displayName: formData.email.split('@')[0]
        });
        console.log('Profil mis à jour');
        
        navigate('/onboard', { replace: true });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        console.log('Connecté:', userCredential.user);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Erreur complète:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email ou mot de passe incorrect');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé');
      } else if (err.code === 'auth/weak-password') {
        setError('Le mot de passe doit faire au moins 6 caractères');
      } else {
        setError(`${err.message}`);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      console.log('Connexion Google réussie:', user);
      
      // Si c'est la première connexion, on redirige vers onboard
      const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
      navigate(isNewUser ? '/onboard' : '/dashboard', { replace: true });
    } catch (err) {
      console.error('Erreur Google:', err);
      setError('Erreur lors de la connexion avec Google');
    }
  };

  // ... (reste du composant inchangé)
};

export default LoginPage;