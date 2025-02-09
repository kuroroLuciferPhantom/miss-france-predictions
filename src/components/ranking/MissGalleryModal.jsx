import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MissGalleryModal = ({ isOpen, onClose, misses }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMiss = misses[currentIndex];

  if (!isOpen) return null;

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === misses.length - 1 ? 0 : prev + 1));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? misses.length - 1 : prev - 1));
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const startX = touch.clientX;
    
    const handleTouchMove = (e) => {
      const deltaX = e.touches[0].clientX - startX;
      if (Math.abs(deltaX) > 50) { // Seuil de défilement
        if (deltaX > 0) {
          goToPrevious();
        } else {
          goToNext();
        }
        document.removeEventListener('touchmove', handleTouchMove);
      }
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', () => {
      document.removeEventListener('touchmove', handleTouchMove);
    }, { once: true });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Container principal */}
      <div 
        className="w-full h-full flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-semibold">
            {currentMiss.name} - Miss {currentMiss.region}
          </h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-300 p-2 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Zone principale avec l'image et les boutons */}
        <div 
          className="flex-1 relative flex items-center justify-center p-4"
          onTouchStart={handleTouchStart}
        >
          {/* Bouton précédent */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 p-2 text-white hover:text-gray-300 hidden md:block"
          >
            <ChevronLeft size={40} />
          </button>

          {/* Image */}
          <div className="relative max-h-full max-w-full flex flex-col items-center">
            <img
              src={currentMiss.photo}
              alt={currentMiss.name}
              className="max-h-[calc(100vh-200px)] max-w-full object-contain"
            />
            
            {/* Statut de sélection */}
            {currentMiss.isSelected && (
                <div className="mt-4">
                    <span className={`px-4 py-2 rounded-full text-white ${
                    currentMiss.selectionStatus === 'top3' ? 'bg-pink-500' :
                    currentMiss.selectionStatus === 'top5' ? 'bg-purple-500' :
                    'bg-blue-500'
                    }`}>
                    Votre sélection : {currentMiss.rank || 'Qualifiée'}
                    </span>
                </div>
                )}
          </div>

          {/* Bouton suivant */}
          <button
            onClick={goToNext}
            className="absolute right-4 p-2 text-white hover:text-gray-300 hidden md:block"
          >
            <ChevronRight size={40} />
          </button>
        </div>

        {/* Navigation mobile */}
        <div className="md:hidden flex justify-center gap-4 p-4">
          <button
            onClick={goToPrevious}
            className="px-6 py-2 bg-white/10 text-white rounded-lg"
          >
            Précédent
          </button>
          <button
            onClick={goToNext}
            className="px-6 py-2 bg-white/10 text-white rounded-lg"
          >
            Suivant
          </button>
        </div>

        {/* Indicateur de position */}
        <div className="p-4 text-center text-white">
          {currentIndex + 1} / {misses.length}
        </div>
      </div>
    </div>
  );
};

export default MissGalleryModal;