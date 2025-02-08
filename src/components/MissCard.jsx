import React, { useState } from 'react';
import PhotoPreviewModal from './PhotoPreviewModal';
import instagramIcon from '../assets/images/icons/instagram.png';
import tiktokIcon from '../assets/images/icons/tiktok.png';

const MissCard = ({ miss, compact, onSelect, isSelected, selectionType, showRemoveButton, onRemove, rank }) => {
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);

  const borderColor = {
    top3: 'ring-pink-500 dark:ring-pink-400',
    top5: 'ring-purple-500 dark:ring-purple-400',
    qualified: 'ring-blue-500 dark:ring-blue-400'
  };
  
  if (compact) {
    return (
      <div 
        className={`relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm ${
          isSelected ? `ring-2 ${borderColor[selectionType] || ''}` : ''
        }`}
      >
        <div className="relative h-48">
          <img 
            src={miss.photo} 
            alt={`Miss ${miss.region}`} 
            className="w-full h-full object-contain bg-gray-50 dark:bg-gray-700" 
          />
          {/* Preview button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPhotoPreview(true);
            }}
            className="absolute top-2 right-2 bg-black/50 dark:bg-black/70 text-white p-1.5 rounded-full hover:bg-black/70 dark:hover:bg-black/90"
            title="Voir la photo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </button>
        </div>
        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm font-medium truncate text-gray-900 dark:text-white">{miss.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">Miss {miss.region}</div>
        </div>
        {showRemoveButton && (
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="absolute top-2 left-2 bg-red-500 dark:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 dark:hover:bg-red-700 z-10 shadow-lg"
          >
            ×
          </button>
        )}
        <PhotoPreviewModal
          isOpen={showPhotoPreview}
          onClose={() => setShowPhotoPreview(false)}
          photo={miss.photo}
          name={`Miss ${miss.region} - ${miss.name}`}
        />
      </div>
    );
  }
  
  return (
    <div className="relative">
      <div 
        className={`relative rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ${
          isSelected ? `ring-2 ${borderColor[selectionType] || ''}` : 'hover:shadow-xl'
        }`}
        onClick={onSelect}
      >
        {/* Photo container */}
        <div className="relative group">
          <img 
            src={miss.photo} 
            alt={`Miss ${miss.region}`} 
            className="w-full h-64 object-contain bg-gray-50 dark:bg-gray-700" 
          />
          {/* Bouton aperçu qui apparaît au hover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPhotoPreview(true);
            }}
            className="absolute top-2 right-2 bg-black/50 dark:bg-black/70 text-white p-2 rounded-full 
                     md:opacity-0 md:group-hover:opacity-100 transition-opacity
                     opacity-100 sm:opacity-100
                     hover:bg-black/70 dark:hover:bg-black/90"
            title="Voir la photo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>
          </button>
        </div>
  
        <div className="p-4 bg-white dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">{miss.name}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Miss {miss.region}</p>
          
          {/* Réseaux sociaux */}
          <div className="flex items-center space-x-3">
            {miss.socialMedia?.instagram && (
              <a 
                href={`https://instagram.com/${miss.socialMedia.instagram}`}
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
              >
                <img src={instagramIcon} alt="Instagram" className="w-5 h-5" />
              </a>
            )}
            {miss.socialMedia?.tiktok && (
              <a 
                href={`https://tiktok.com/${miss.socialMedia.tiktok}`}
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 transition-colors"
              >
                <img src={tiktokIcon} alt="Tiktok" className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
  
      {/* Badge de rang */}
      {rank && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 text-white rounded-full px-3 py-1 text-sm font-bold z-10 shadow-lg">
          {rank}
        </div>
      )}
  
      {/* Bouton de suppression */}
      {showRemoveButton && (
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-2 right-2 bg-red-500 dark:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 dark:hover:bg-red-700 z-10 shadow-lg transition-colors"
        >
          ×
        </button>
      )}
  
      <PhotoPreviewModal
        isOpen={showPhotoPreview}
        onClose={() => setShowPhotoPreview(false)}
        photo={miss.photo}
        name={`Miss ${miss.region} - ${miss.name}`}
      />
    </div>
  );
};

export default MissCard;