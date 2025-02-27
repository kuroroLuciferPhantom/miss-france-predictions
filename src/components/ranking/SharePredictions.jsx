import React, { useEffect, useRef } from 'react';
import { FacebookIcon, XIcon } from 'react-share';
import { useNavigate } from 'react-router-dom';

const SharePredictions = ({ onClose }) => {
  const navigate = useNavigate();
  const pageUrl = window.location.href;
  const shareText = "Je viens de faire mes pronostics pour Miss France 2026 ! Viens faire les tiens sur Miss'Prono 👑";
  const componentRef = useRef(null);

  // Faire défiler vers le haut de la page quand le composant est monté
  useEffect(() => {
    if (componentRef.current) {
      // Forcer un scroll tout en haut
      window.scrollTo(0, 0);
      // Puis s'assurer que le composant est visible
      componentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Miss'Prono - Mes pronostics",
          text: shareText,
          url: pageUrl,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Erreur lors du partage:', error);
        }
      }
    }
  };

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  // URLs de partage pour les réseaux sociaux
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(shareText)}`;
  const twitterShareUrl = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`;

  return (
    <div ref={componentRef} className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Partagez vos pronostics !
      </h3>

      {/* Bouton de partage natif (mobile) */}
      {navigator.share && (
        <button
          onClick={handleShare}
          className="w-full mb-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
        >
          <span>Partager</span>
        </button>
      )}

      {/* Boutons réseaux sociaux */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Facebook */}
        <a href={fbShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
        >
          <FacebookIcon size={20} />
          <span>Facebook</span>
        </a>

        {/* Twitter/X */}
        <a href={twitterShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
        >
          <XIcon size={20} />
          <span>Twitter</span>
        </a>
      </div>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
        Invitez vos amis à faire leurs pronostics et comparez vos résultats !
      </p>

      {/* Nouveau bouton Retour au Dashboard */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleReturnToDashboard}
          className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-lg flex items-center justify-center gap-2"
        >
          Retour au Dashboard
        </button>
      </div>
    </div>
  );
};

export default SharePredictions;