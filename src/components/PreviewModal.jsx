import React from 'react';

const PreviewModal = ({ isOpen, onClose, selections }) => {
  if (!isOpen) return null;

  const titles = [
    "Miss France 2025",
    "1ère Dauphine",
    "2ème Dauphine",
    "3ème Dauphine",
    "4ème Dauphine"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Aperçu de vos sélections</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <h4 className="text-xl font-semibold mb-4">Votre Top 5</h4>
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => (
                <div key={index} className={`relative bg-gray-50 rounded-lg p-4 ${index === 1 ? 'col-start-2' : ''}`}>
                  <div className="absolute top-2 right-2 bg-pink-500 text-white px-3 py-1 rounded-full text-sm">
                    {titles[index]}
                  </div>
                  {selections.top5[index] && (
                    <>
                      <img 
                        src={selections.top5[index].photo}
                        alt={selections.top5[index].name}
                        className="w-full h-48 object-cover rounded-lg mb-2"
                      />
                      <h5 className="font-semibold">{selections.top5[index].name}</h5>
                      <p className="text-gray-600">Miss {selections.top5[index].region}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[3, 4].map((index) => (
                <div key={index} className="relative bg-gray-50 rounded-lg p-4">
                  <div className="absolute top-2 right-2 bg-pink-500 text-white px-3 py-1 rounded-full text-sm">
                    {titles[index]}
                  </div>
                  {selections.top5[index] && (
                    <>
                      <img 
                        src={selections.top5[index].photo}
                        alt={selections.top5[index].name}
                        className="w-full h-48 object-cover rounded-lg mb-2"
                      />
                      <h5 className="font-semibold">{selections.top5[index].name}</h5>
                      <p className="text-gray-600">Miss {selections.top5[index].region}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Autres Miss qualifiées</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {selections.qualified.map((miss) => (
                <div key={miss.id} className="bg-gray-50 rounded-lg p-4">
                  <img 
                    src={miss.photo}
                    alt={miss.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <h5 className="font-semibold">{miss.name}</h5>
                  <p className="text-gray-600">Miss {miss.region}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;