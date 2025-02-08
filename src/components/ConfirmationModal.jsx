import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Confirmer la validation
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Voulez-vous sauvegarder vos pronostics ? Vous pourrez les modifier jusqu'au début de l'émission.
        </p>
  
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-pink-500 dark:bg-pink-600 text-white rounded hover:bg-pink-600 dark:hover:bg-pink-700 transition-colors"
        >
          Sauvegarder
        </button>
      </div>
    </div>
  );
};

export default ConfirmationModal;