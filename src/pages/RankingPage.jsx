import React, { useState } from 'react';
import MissCard from '../components/MissCard';
import GameRules from '../components/GameRules';
import PreviewModal from '../components/PreviewModal';
import ConfirmationModal from '../components/ConfirmationModal';

// Données de test (à remplacer par les vraies données)
const testMisses = [
  {
    id: 1,
    name: "Eve Martin",
    region: "Île-de-France",
    photo: "/api/placeholder/300/400",
    socialMedia: {
      instagram: "https://instagram.com"
    }
  },
  {
    id: 2,
    name: "Sophie Dubois",
    region: "Normandie",
    photo: "/api/placeholder/300/400",
    socialMedia: {
      instagram: "https://instagram.com"
    }
  },
  {
    id: 3,
    name: "Marie Lambert",
    region: "Bretagne",
    photo: "/api/placeholder/300/400",
    socialMedia: {
      instagram: "https://instagram.com"
    }
  },
  {
    id: 4,
    name: "Julie Petit",
    region: "Provence",
    photo: "/api/placeholder/300/400",
    socialMedia: {
      instagram: "https://instagram.com"
    }
  }
];

const titles = [
  "Miss France 2025",
  "1ère Dauphine",
  "2ème Dauphine",
  "3ème Dauphine",
  "4ème Dauphine"
];

const RankingPage = () => {
  const [top3, setTop3] = useState([]);
  const [top5, setTop5] = useState([]);
  const [qualified, setQualified] = useState([]);
  const [availableMisses, setAvailableMisses] = useState(testMisses);
  const [selectionStep, setSelectionStep] = useState('top3');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleMissSelect = (miss) => {
    if (selectionStep === 'top3' && top3.length < 3) {
      setTop3([...top3, miss]);
      setAvailableMisses(availableMisses.filter(m => m.id !== miss.id));
      if (top3.length === 2) setSelectionStep('top5');
    } else if (selectionStep === 'top5' && top5.length < 2) {
      setTop5([...top5, miss]);
      setAvailableMisses(availableMisses.filter(m => m.id !== miss.id));
      if (top5.length === 1) setSelectionStep('qualified');
    } else if (selectionStep === 'qualified' && qualified.length < 10) {
      setQualified([...qualified, miss]);
      setAvailableMisses(availableMisses.filter(m => m.id !== miss.id));
    }
  };

  const handleRemove = (miss, section) => {
    setAvailableMisses([...availableMisses, miss]);
    if (section === 'top3') {
      setTop3(top3.filter(m => m.id !== miss.id));
      setSelectionStep('top3');
    } else if (section === 'top5') {
      setTop5(top5.filter(m => m.id !== miss.id));
      if (selectionStep === 'qualified') setSelectionStep('top5');
    } else {
      setQualified(qualified.filter(m => m.id !== miss.id));
    }
  };

  const handleSubmit = () => {
    // À implémenter : sauvegarde des sélections
    setIsConfirmationOpen(false);
  };

  const isSelectionComplete = top3.length === 3 && top5.length === 2 && qualified.length === 10;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Miss France - Faites vos pronostics !</h1>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Colonne de gauche : Règles et barème */}
        <div className="col-span-12 lg:col-span-3">
          <GameRules />
        </div>

        {/* Colonne centrale : Sélections */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          {/* Section Top 5 */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Votre Top 5</h2>
            <div className="space-y-4">
              {top3.map((miss, index) => (
                <MissCard 
                  key={miss.id}
                  miss={miss}
                  isSelected
                  selectionType="top3"
                  showRemoveButton
                  onRemove={() => handleRemove(miss, 'top3')}
                  rank={titles[index]}
                />
              ))}
              {top5.map((miss, index) => (
                <MissCard 
                  key={miss.id}
                  miss={miss}
                  isSelected
                  selectionType="top5"
                  showRemoveButton
                  onRemove={() => handleRemove(miss, 'top5')}
                  rank={titles[index + 3]}
                />
              ))}
            </div>
          </div>

          {/* Section Qualifiées */}
          {top5.length === 2 && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Autres Miss qualifiées</h2>
              <div className="grid grid-cols-2 gap-4">
                {qualified.map((miss) => (
                  <MissCard 
                    key={miss.id}
                    miss={miss}
                    isSelected
                    selectionType="qualified"
                    showRemoveButton
                    onRemove={() => handleRemove(miss, 'qualified')}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Colonne de droite : Candidates disponibles */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Candidates disponibles</h2>
            <div className="grid grid-cols-2 gap-4">
              {availableMisses.map(miss => (
                <MissCard 
                  key={miss.id}
                  miss={miss}
                  onSelect={() => handleMissSelect(miss)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-center gap-4 mt-8">
        <button 
          onClick={() => setIsPreviewOpen(true)}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Aperçu des sélections
        </button>
        <button 
          className={`px-6 py-3 bg-pink-500 text-white rounded-lg transition-colors ${
            isSelectionComplete ? 'hover:bg-pink-600' : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!isSelectionComplete}
          onClick={() => setIsConfirmationOpen(true)}
        >
          Valider définitivement
        </button>
      </div>

      {/* Modals */}
      <ConfirmationModal 
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleSubmit}
      />

      <PreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        selections={{
          top5: [...top3, ...top5],
          qualified
        }}
      />
    </div>
  );
};

export default RankingPage;