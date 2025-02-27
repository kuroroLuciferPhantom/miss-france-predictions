import React, { useEffect, useRef } from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
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

  // Style en ligne pour positionner la modale en haut avec marge fixe
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
          Confirmer la validation
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Voulez-vous sauvegarder vos pronostics ? Vous pourrez les modifier jusqu'au début de l'émission.
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-pink-500 dark:bg-pink-600 text-white rounded hover:bg-pink-600 dark:hover:bg-pink-700 transition-colors"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;