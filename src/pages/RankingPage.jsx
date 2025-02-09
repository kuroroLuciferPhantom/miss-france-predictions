import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MissCard from '../components/ranking/MissCard';
import GameRules from '../components/GameRules';
import ConfirmationModal from '../components/ranking/ConfirmationModal';
import PointsSystem from '../components/PointsSystem';
import MissGalleryModal from '../components/ranking/MissGalleryModal';
import { missData, titles } from '../data/missData';
import { doc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuthContext } from '../contexts/AuthContext';
import { showToast } from '../components/ui/Toast';
import SaveSuccessModal from '../components/ranking/SaveSuccessModal';
import SharePredictions from '../components/ranking/SharePredictions';



const RankingPage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [predictionId, setPredictionId] = useState(null);
  const [top3, setTop3] = useState([]);
  const [top5, setTop5] = useState([]);
  const [qualified, setQualified] = useState([]);
  const [availableMisses, setAvailableMisses] = useState(missData);
  const [selectionStep, setSelectionStep] = useState('top3');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('selection');
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaveSuccessOpen, setIsSaveSuccessOpen] = useState(false);
  const [showShareComponent, setShowShareComponent] = useState(false);

  useEffect(() => {
    if (user) {
      loadExistingPredictions();
    }
  }, [user]);

  const handleMissSelect = (miss) => {
    // Déterminer l'étape en fonction des sélections actuelles
    const currentStep = top3.length < 3 ? 'top3' 
                     : top5.length < 2 ? 'top5'
                     : 'qualified';
  
    if (currentStep === 'top3' && top3.length < 3) {
      setTop3([...top3, miss]);
      setAvailableMisses(availableMisses.filter(m => m.id !== miss.id));
      if (top3.length === 2) setSelectionStep('top5');
    } else if (currentStep === 'top5' && top5.length < 2) {
      setTop5([...top5, miss]);
      setAvailableMisses(availableMisses.filter(m => m.id !== miss.id));
      if (top5.length === 1) setSelectionStep('qualified');
    } else if (currentStep === 'qualified' && qualified.length < 10) {
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

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const predictionData = {
        userId: user.uid,
        top3: top3.map(miss => ({
          id: miss.id,
          name: miss.name,
          region: miss.region
        })),
        top5: top5.map(miss => ({
          id: miss.id,
          name: miss.name,
          region: miss.region
        })),
        qualified: qualified.map(miss => ({
          id: miss.id,
          name: miss.name,
          region: miss.region
        })),
        lastUpdated: new Date().toISOString(),
        isPublic,
        isComplete: top3.length === 3 && top5.length === 2 && qualified.length === 10
      };

      if (predictionId) {
        // Update
        await updateDoc(doc(db, 'predictions', predictionId), predictionData);
        showToast.success('Vos pronostics ont été mis à jour !');
      } else {
        // Create
        const docRef = doc(collection(db, 'predictions'));
        await setDoc(docRef, predictionData);
        setPredictionId(docRef.id);
        showToast.success('Vos pronostics ont été enregistrés !');
      }

      setIsConfirmationOpen(false);
      setIsSaveSuccessOpen(true);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showToast.error('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };
  
  const loadExistingPredictions = async () => {
    try {
      const predictionsRef = collection(db, 'predictions');
      const q = query(
        predictionsRef,
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const prediction = querySnapshot.docs[0];
        const predictionData = prediction.data();
        setPredictionId(prediction.id);

        // Fonction pour récupérer les données complètes d'une miss
        const getFullMissData = (missBasic) => {
          const fullMiss = missData.find(m => m.id === missBasic.id);
          return fullMiss || missBasic;
        };

        setTop3(predictionData.top3?.map(getFullMissData) || []);
        setTop5(predictionData.top5?.map(getFullMissData) || []);
        setQualified(predictionData.qualified?.map(getFullMissData) || []);
        setIsPublic(predictionData.isPublic || false);

        // Mettre à jour les Miss disponibles
        const selectedMissIds = [
          ...(predictionData.top3 || []).map(m => m.id),
          ...(predictionData.top5 || []).map(m => m.id),
          ...(predictionData.qualified || []).map(m => m.id)
        ];
        setAvailableMisses(missData.filter(miss => !selectedMissIds.includes(miss.id)));

        showToast.success('Vos pronostics ont été chargés !');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des prédictions:', error);
      showToast.error('Impossible de charger vos pronostics existants');
    }
  };

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

  const location = useLocation();
  const handleBack = () => {
    if (location.state?.from === 'group') {
      navigate(`/group/${location.state.groupId}`);
    } else {
      navigate('/dashboard');
    }
  };

  const handleShare = () => {
    setIsSaveSuccessOpen(false);
    setShowShareComponent(true);
  };
  
  const handleDashboard = () => {
    navigate('/dashboard');
  };  


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={handleBack}
              className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {location.state?.from === 'group' ? 'Retour au groupe' : 'Retour au dashboard'}
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mes pronostics Miss France 2025
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sélectionnez votre top 5 et les 10 autres Miss qualifiées
          </p>
        </div>
  
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Progression de vos sélections
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {`${top3.length + top5.length + qualified.length}/15`}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${((top3.length + top5.length + qualified.length) / 15) * 100}%` }}
              />
            </div>
          </div>
        </div>
  
        {/* Onglets */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('selection')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors
                ${activeTab === 'selection' 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 text-white' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              Sélectionner
            </button>
            <button
              onClick={() => setActiveTab('selections')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors relative
                ${activeTab === 'selections' 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 text-white' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              Vos sélections
              <span className="absolute -top-1 -right-1 bg-pink-500 dark:bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {top3.length + top5.length + qualified.length}
              </span>
            </button>
          </div>
        </div>
  
        {/* Contenu basé sur l'onglet actif */}
        {activeTab === 'selection' ? (
          <>
            {/* Sélection des candidates */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Candidates disponibles
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      ({filteredAvailableMisses.length})
                    </span>
                  </h2>
                  <button
                    onClick={() => setIsGalleryOpen(true)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Voir toutes les Miss
                  </button>
                </div>
  
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher une Miss par nom ou région..."
                    className="w-full px-4 py-2 pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent dark:text-white dark:placeholder-gray-400"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
  
              <div className="p-4 overflow-y-auto max-h-[calc(100vh-500px)]">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {filteredAvailableMisses.length > 0 ? 
                    filteredAvailableMisses.map(miss => (
                      <MissCard
                        key={miss.id}
                        miss={miss}
                        onSelect={() => handleMissSelect(miss)}
                        isSelected={false}
                        onRemove={() => {}}
                      />
                    )) : (
                      <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                        Aucune candidate ne correspond à votre recherche
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Sélections */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Vos Sélections</h2>
              </div>
              
              <div className="p-4 space-y-6">
                {/* Top 5 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Top 5</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {titles.map((title, index) => (
                      <div key={title} className="relative">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{title}</div>
                        {index < 3 ? (
                          top3[index] ? (
                            <MissCard
                              miss={top3[index]}
                              isSelected
                              selectionType="top3"
                              showRemoveButton
                              onRemove={() => handleRemove(top3[index], 'top3')}
                              rank={title}
                              compact
                            />
                          ) : (
                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-2 flex justify-center items-center text-gray-400 dark:text-gray-500 h-16 text-xs">
                              À sélectionner
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
                              rank={title}
                              compact
                            />
                          ) : (
                            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-2 flex justify-center items-center text-gray-400 dark:text-gray-500 h-16 text-xs">
                              À sélectionner
                            </div>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                </div>
  
                {/* Qualifiées */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Autres Miss qualifiées ({qualified.length}/10)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {qualified.map(miss => (
                      <MissCard
                        key={miss.id}
                        miss={miss}
                        isSelected
                        selectionType="qualified"
                        showRemoveButton
                        onRemove={() => handleRemove(miss, 'qualified')}
                        compact
                      />
                    ))}
                    {qualified.length < 10 && (
                      <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-2 flex justify-center items-center text-gray-400 dark:text-gray-500 h-16 text-xs">
                        + {10 - qualified.length} à sélectionner
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
  
        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6 space-y-3 sm:space-y-0">
          {/* Switch Public/Privé */}
          <div className="flex items-center">
            <label className="inline-flex relative items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 dark:peer-focus:ring-pink-800 
                            rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                            after:border-gray-300 dark:after:border-gray-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all 
                            peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-500 dark:peer-checked:from-pink-600 dark:peer-checked:to-purple-600">
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Rendre mes pronostics publics
              </span>
            </label>
          </div>
  
          {/* Bouton Valider */}
          <div className="flex space-x-4">
            <button
              onClick={() => setIsConfirmationOpen(true)}
              disabled={isSaving}
              className={`px-4 py-1.5 sm:px-6 sm:py-2 rounded-lg flex items-center justify-center text-sm sm:text-base 
                ${isSaving 
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 text-white hover:from-pink-600 hover:to-purple-600 dark:hover:from-pink-700 dark:hover:to-purple-700'}
              `}
            >
              {isSaving ? 'Sauvegarde...' : 'Valider mes pronostics'}
            </button>
          </div>
        </div>
  
        {/* Footer section avec GameRules et PointsSystem toujours visibles */}
        <GameRules />
        <PointsSystem />
          
        <ConfirmationModal
          isOpen={isConfirmationOpen}
          onClose={() => setIsConfirmationOpen(false)}
          onConfirm={handleSubmit}
        />
        
        <SaveSuccessModal
          isOpen={isSaveSuccessOpen}
          onClose={() => setIsSaveSuccessOpen(false)}
          onShare={handleShare}
          onDashboard={handleDashboard}
        />

        {showShareComponent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
              <SharePredictions onClose={() => setShowShareComponent(false)} />
            </div>
          </div>
        )}

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