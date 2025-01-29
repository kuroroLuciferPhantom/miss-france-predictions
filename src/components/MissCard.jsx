import React from 'react';

const MissCard = ({ miss, onSelect, isSelected, selectionType, showRemoveButton, onRemove, rank }) => {
  const borderColor = {
    top3: 'ring-pink-500',
    top5: 'ring-purple-500',
    qualified: 'ring-blue-500'
  };

  return (
    <div className="relative">
      <div 
        className={`relative rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-300 ${
          isSelected ? `ring-2 ${borderColor[selectionType] || ''}` : 'hover:shadow-xl'
        }`}
        onClick={onSelect}
      >
        <img 
          src={miss.photo} 
          alt={`Miss ${miss.region}`} 
          className="w-full h-48 object-cover" 
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{miss.name}</h3>
          <p className="text-gray-600">Miss {miss.region}</p>
          <div className="mt-2 flex space-x-3">
            {miss.socialMedia?.instagram && (
              <a href={miss.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0z"/>
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
      {showRemoveButton && (
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 z-10"
        >
          ×
        </button>
      )}
      {rank && (
        <div className="absolute top-2 left-2 bg-pink-500 text-white rounded-full px-3 py-1 text-sm font-bold z-10">
          {rank}
        </div>
      )}
    </div>
  );
};

export default MissCard;