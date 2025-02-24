import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import {  useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { auth } from '../../config/firebase';
import { sendEmailVerification } from "firebase/auth";

const CheckEmailPage = () => {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(30);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let timer;
        if (countdown > 0 && !canResend) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
        }

        return () => clearInterval(timer);
    }, [countdown]);

    const sendVerificationEmail = async (user) => {
        await sendEmailVerification(user, {
          url: window.location.origin + '/login',
          handleCodeInApp: true,
        });
      };

    const handleSignOut = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    };

    const handleResendEmail = async () => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                await sendVerificationEmail(currentUser);
                setCanResend(false);
                setCountdown(30);
                toast.success("✉️ Email de vérification renvoyé !");
            } else {
                toast.error("❌ Aucun utilisateur connecté");
                navigate('/login');
            }
        } catch (error) {
            console.error('Erreur lors du renvoi:', error);
            if (error.code === 'auth/too-many-requests') {
                toast.error("⚠️ Trop de tentatives, réessayez plus tard");
            } else {
                toast.error("❌ Erreur lors de l'envoi de l'email");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Vérifiez votre email
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Un email de vérification vous a été envoyé.
                        Cliquez sur le lien dans l'email pour activer votre compte.
                    </p>
                </div>

                <div className="mt-4 space-y-4">
                    {!canResend ? (
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                            Renvoyer l'email dans {countdown} secondes
                        </p>
                    ) : (
                        <button
                            onClick={handleResendEmail}
                            className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white p-3 rounded-lg transition-all duration-200"
                        >
                            Renvoyer l'email de vérification
                        </button>
                    )}

                    <button
                        onClick={handleSignOut}
                        className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white p-3 rounded-lg transition-all duration-200"
                    >
                        Retour à la connexion
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckEmailPage;