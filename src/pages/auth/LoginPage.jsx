import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import { toast } from 'react-hot-toast';
import { useSeo } from '../../hooks/useSeo';


const GoogleButton = ({ onClick, isLoading }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={isLoading}
    className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isLoading ? (
      <>
        <svg className="animate-spin h-5 w-5 text-gray-700 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Connexion en cours...</span>
      </>
    ) : (
      <>
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span>Continuer avec Google</span>
      </>
    )}
  </button>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);

      if (!userCredential.user.emailVerified) {
        setError("📧 Veuillez vérifier votre email avant de vous connecter");
        navigate('/check-email');
        return;
      }

      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
      sessionStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath);
    } catch (err) {
      console.error('❌ Erreur connexion:', err.code);
      setError(getFirebaseErrorMessage(err.code));
    } finally {
      setIsLoading(false);
    }
  };

  const getFirebaseErrorMessage = (errorCode) => {
    const messages = {
      "auth/invalid-credential": "❌ Email ou mot de passe incorrect.",
      "auth/user-not-found": "❌ Aucun compte trouvé avec cet email.",
      "auth/too-many-requests": "⚠️ Trop de tentatives. Réessayez plus tard.",
      "auth/invalid-email": "❌ Format d'email invalide.",
      "auth/network-request-failed": "⚠️ Problème de connexion internet.",
      "auth/internal-error": "⚠️ Erreur interne. Réessayez plus tard.",
      "email-not-verified": "📧 Veuillez vérifier votre email avant de vous connecter."
    };

    return messages[errorCode] || "⚠️ Une erreur est survenue. Veuillez réessayer.";
  };

  const handleGoogleSignIn = async () => {
    console.log('Début de handleGoogleSignIn'); // Log pour vérifier le début de l'exécution
    try {
      setIsLoading(true);
      console.log('Loading activé'); // Log pour vérifier que setIsLoading est appelé
  
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
      console.log('Appel de loginWithGoogle'); // Log avant l'appel de loginWithGoogle
  
      // Appeler la fonction loginWithGoogle mais avec une gestion d'erreur explicite
      await loginWithGoogle().catch(error => {
        console.log('Erreur capturée dans loginWithGoogle'); // Log pour vérifier la capture de l'erreur
        // Relancer l'erreur pour être traitée dans le bloc catch externe
        throw error;
      });
  
      console.log('Connexion réussie'); // Log pour vérifier la réussite de la connexion
  
      if (sessionStorage.getItem('redirectAfterLogin')) {
        sessionStorage.removeItem('redirectAfterLogin');
      }
  
      navigate(redirectPath);
    } catch (err) {
      console.error('❌ Erreur dans handleGoogleSignIn:', err);
  
      // Gestion spécifique des erreurs courantes
      if (err.code === 'auth/popup-closed-by-user') {
        console.log('Popup fermée par l\'utilisateur');
      } else if (err.code === 'auth/cancelled-popup-request') {
        console.log('Requête popup annulée');
      } else {
        console.log('Autre erreur de connexion');
      }
    } finally {
      console.log('Exécution du bloc finally'); // Log pour vérifier l'exécution du bloc finally
      setIsLoading(false); // S'assurer que le loading est toujours désactivé
    }
  };
  

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success("Email de réinitialisation envoyé !");
      setIsResetModalOpen(false);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de l'envoi de l'email de réinitialisation");
    }
  };

  useSeo({
    title: 'Miss\'Prono - Connexion',
    description: 'Connectez-vous à votre compte Miss\'Prono pour accéder à vos groupes et pronostics.',
  });

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen message="Connexion en cours..." />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoading ? 0.6 : 1 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col py-12 px-6 lg:px-8"
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Connectez-vous
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Retrouvez vos groupes et vos pronostics
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow rounded-lg sm:px-10">
            <div className="mb-6">
              <GoogleButton onClick={handleGoogleSignIn} isLoading={isLoading} />

            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Ou avec votre email
                </span>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-pink-500 dark:focus:border-pink-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mot de passe
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-pink-500 dark:focus:border-pink-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Se souvenir de moi
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    onClick={() => setIsResetModalOpen(true)}
                    className="font-medium text-pink-600 dark:text-pink-400 hover:text-pink-500 dark:hover:text-pink-300"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 dark:bg-pink-600 hover:bg-pink-600 dark:hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-pink-400"
                >
                  Se connecter
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Pas encore de compte ?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => window.location.href = '/signup'}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Créer un compte
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal de réinitialisation */}
      {isResetModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Réinitialiser le mot de passe
            </h3>
            <form onSubmit={handlePasswordReset}>
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Entrez votre email"
                className="w-full p-2 border dark:border-gray-600 rounded mb-4 dark:bg-gray-700 dark:text-white"
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;