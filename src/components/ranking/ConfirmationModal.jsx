import React, { useEffect, useRef } from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  const modalRef = useRef(null);
  
  // Effet pour faire défiler et se concentrer sur la modale quand elle s'ouvre
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Défiler vers le haut de la page
      window.scrollTo(0, 0);
      
      // Désactiver le défilement du corps
      document.body.style.overflow = 'hidden';
      
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
        document.body.style.overflow = 'auto';
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 my-20"
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