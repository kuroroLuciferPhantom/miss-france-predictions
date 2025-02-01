import React from 'react';

const PhotoPreviewModal = ({ isOpen, onClose, photo, name }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="max-w-4xl w-full bg-white rounded-lg overflow-hidden shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-3 sm:p-4 border-b flex justify-between items-center">
          <h3 className="text-base sm:text-lg font-medium truncate">{name}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 text-xl p-2"
          >
            ×
          </button>
        </div>
        <div className="p-2 sm:p-4">
          <img 
            src={photo} 
            alt={name}
            className="w-full h-[50vh] sm:h-[80vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoPreviewModal;