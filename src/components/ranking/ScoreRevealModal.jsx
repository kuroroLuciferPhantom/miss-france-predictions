import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { Dialog } from '@headlessui/react';
import { Trophy } from 'lucide-react';

const ScoreRevealModal = ({ 
  isOpen, 
  onClose, 
  score, 
  rank, 
  totalParticipants,
  revealType // 'top15' ou 'top5'
}) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

      {/* Confetti en arrière-plan */}
      <ReactConfetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={200}
        recycle={false}
        colors={['#EC4899', '#A855F7', '#FEF3C7', '#FECACA']}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-xl bg-white dark:bg-gray-800 p-6 text-center shadow-xl">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>

          <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text mb-4">
            {revealType === 'top15' ? 'Résultats Top 15' : 'Résultats Top 5'}
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                {score} points
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {rank === 1 ? (
                  "🏆 Vous êtes en tête du classement !"
                ) : (
                  `🎯 Vous êtes ${rank}${rank === 1 ? 'er' : 'ème'} sur ${totalParticipants}`
                )}
              </p>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              {revealType === 'top15' 
                ? "Les qualifiées pour le top 5 vont bientôt être annoncées..." 
                : "Le classement final a été révélé !"}
            </p>

            <button
              onClick={onClose}
              className="w-full px-4 py-2 mt-4 bg-gradient-to-r from-pink-500 to-purple-500 
                       hover:from-pink-600 hover:to-purple-600 text-white rounded-lg 
                       transition-colors duration-200"
            >
              Continuer
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ScoreRevealModal;