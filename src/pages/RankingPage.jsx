import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MissCard from '../components/MissCard';
import GameRules from '../components/GameRules';
import PreviewModal from '../components/PreviewModal';
import ConfirmationModal from '../components/ConfirmationModal';
import PointsSystem from '../components/PointsSystem';
import MissGalleryModal from '../components/MissGalleryModal';
import { missData, titles } from '../data/missData';


const RankingPage = () => {
  const { groupId } = useParams();
  // États existants
  const [top3, setTop3] = useState([]);
  const [top5, setTop5] = useState([]);
  const [qualified, setQualified] = useState([]);
  const [availableMisses, setAvailableMisses] = useState(missData);
  const [selectionStep, setSelectionStep] = useState('top3');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


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

  const getAllMisses = () => {
    const selectedMisses = [...top3, ...top5, ...qualified];
    return missData.map(miss => {
      let selectionStatus = null;
      let rank = null;
  
      // Vérifier top3
      const top3Index = top3.findIndex(m => m.id === miss.id);
      if (top3Index !== -1) {
        selectionStatus = 'top3';
        rank = titles[top3Index]; // "Miss France 2025", "1ère Dauphine", "2ème Dauphine"
      } 
      // Vérifier top5
      const top5Index = top5.findIndex(m => m.id === miss.id);
      if (top5Index !== -1) {
        selectionStatus = 'top5';
        rank = titles[top5Index + 3]; // "3ème Dauphine", "4ème Dauphine"
      }
      // Vérifier qualifiées
      if (qualified.find(m => m.id === miss.id)) {
        selectionStatus = 'qualified';
      }
  
      return {
        ...miss,
        isSelected: !!selectionStatus,
        selectionStatus,
        rank
      };
    });
  };

  const filteredAvailableMisses = availableMisses.filter(miss => {
    const search = searchTerm.toLowerCase();
    return (
      miss.name.toLowerCase().includes(search) ||
      miss.region.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link 
              to={`/group/${groupId}`}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Retour au groupe
            </Link>
            
            <Link 
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 text-sm text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors"
            >
              Mon dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mes pronostics Miss France 2025
          </h1>
          <p className="mt-2 text-gray-600">
            Sélectionnez votre top 5 et les 10 autres Miss qualifiées
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progression de vos sélections
              </span>
              <span className="text-sm font-medium text-gray-700">
                {`${top3.length + top5.length + qualified.length}/15`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all"
                style={{ width: `${((top3.length + top5.length + qualified.length) / 15) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Colonne de gauche : Sélections actuelles */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top 5 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Votre Top 5</h2>
              </div>
              <div className="p-4 space-y-4">
                {titles.map((title, index) => (
                  <div key={title} className="relative bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
                    {index < 3 ? (
                      top3[index] ? (
                        <MissCard
                          miss={top3[index]}
                          isSelected
                          selectionType="top3"
                          showRemoveButton
                          onRemove={() => handleRemove(top3[index], 'top3')}
                        />
                      ) : (
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex justify-center items-center text-gray-400">
                          Sélectionnez une Miss
                        </div>
                      )
                    ) : (
                      top5[index - 3] ? (
                        <MissCard
                          miss={top5[index - 3]}
                          isSelected
                          selectionType="top5"
                          showRemoveButton
                          onRemove={() => handleRemove(top5[index - 3], 'top5')}
                        />
                      ) : (
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex justify-center items-center text-gray-400">
                          Sélectionnez une Miss
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Autres qualifiées */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Les 10 autres Miss qualifiées
                  <span className="ml-2 text-sm text-gray-500">
                    ({qualified.length}/10)
                  </span>
                </h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {qualified.map(miss => (
                    <MissCard
                      key={miss.id}
                      miss={miss}
                      isSelected
                      selectionType="qualified"
                      showRemoveButton
                      onRemove={() => handleRemove(miss, 'qualified')}
                    />
                  ))}
                  {Array.from({ length: 10 - qualified.length }).map((_, index) => (
                    <div
                      key={`empty-${index}`}
                      className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex justify-center items-center text-gray-400"
                    >
                      Sélectionnez une Miss
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Colonne de droite : Candidates disponibles et règles */}
          <div className="lg:col-span-5 space-y-6">
            {/* Candidates disponibles */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    Candidates disponibles
                    <span className="ml-2 text-sm text-gray-500">
                      ({filteredAvailableMisses.length})
                    </span>
                  </h2>
                  <button
                    onClick={() => setIsGalleryOpen(true)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Voir toutes les Miss
                  </button>
                </div>

                {/* Barre de recherche */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher une Miss par nom ou région..."
                    className="w-full px-4 py-2 pl-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {filteredAvailableMisses.length > 0 ? (
                    filteredAvailableMisses.map(miss => (
                      <MissCard
                        key={miss.id}
                        miss={miss}
                        onSelect={() => handleMissSelect(miss)}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      Aucune candidate ne correspond à votre recherche
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Règles du jeu */}
            <GameRules />

            {/* Système de points */}
            <div className="mb-8">
              <PointsSystem />
            </div>
          </div>
        </div>

        {/* Actions footer */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
          >
            Aperçu
          </button>
          <button
            onClick={() => setIsConfirmationOpen(true)}
            disabled={!isSelectionComplete}
            className={`px-6 py-2 rounded-lg shadow-sm ${
              isSelectionComplete
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Valider mes pronostics
          </button>
        </div>

        {/* Modals */}
        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          selections={{
            top5: [...top3, ...top5],
            qualified
          }}
        />
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={() => setIsConfirmationOpen(false)}
          onConfirm={handleSubmit}
        />

        <MissGalleryModal
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          misses={getAllMisses()}
        />
      </div>
    </div>
  );
};

export default RankingPage;