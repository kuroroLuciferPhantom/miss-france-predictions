import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4">Confirmer la validation</h3>
        <p className="mb-6">
          Attention, une fois validé, votre pronostic ne pourra plus être modifié et restera caché jusqu'à 21h15 le jour de l'élection. Êtes-vous sûr(e) de vouloir valider définitivement ?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
          >
            Valider définitivement
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;