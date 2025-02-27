import React, { useEffect, useRef } from "react";

const SaveSuccessModal = ({ isOpen, onClose, onShare, onDashboard }) => {
  const modalRef = useRef(null);
  
  // Effet pour gérer le comportement de la modale
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Force le positionnement en haut de l'écran
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Gestionnaire pour fermer en cliquant en dehors
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose();
        }
      };
      
      // Ajouter l'écouteur d'événement
      document.addEventListener('mousedown', handleClickOutside);
      
      // Nettoyage
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 overflow-y-auto" 
      style={{ paddingTop: '4rem' }}
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto"
        style={{ marginTop: '0', marginBottom: '4rem' }}
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Pronostics sauvegardés !
        </h3>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={onShare}
            className="w-full px-4 py-2 bg-pink-500 dark:bg-pink-600 text-white rounded hover:bg-pink-600 dark:hover:bg-pink-700 transition-colors"
          >
            Partager mes pronostics
          </button>
          
          <button
            onClick={onDashboard}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveSuccessModal;