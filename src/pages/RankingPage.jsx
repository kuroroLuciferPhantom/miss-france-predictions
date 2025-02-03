import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MissCard from '../components/MissCard';
import GameRules from '../components/GameRules';
import PreviewModal from '../components/PreviewModal';
import ConfirmationModal from '../components/ConfirmationModal';
import PointsSystem from '../components/PointsSystem';
import MissGalleryModal from '../components/MissGalleryModal';
import { missData, titles } from '../data/missData';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuthContext } from '../contexts/AuthContext';


const RankingPage = () => {
  const { user } = useAuthContext();
  const { groupId } = useParams();
  const [top3, setTop3] = useState([]);
  const [top5, setTop5] = useState([]);
  const [qualified, setQualified] = useState([]);
  const [availableMisses, setAvailableMisses] = useState(missData);
  const [selectionStep, setSelectionStep] = useState('top3');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('selection');
  const [isPublic, setIsPublic] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user && groupId) {
      loadExistingPredictions();
    }
  }, [user, groupId]);

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

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const predictionData = {
        userId: user.uid,
        groupId,
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
  
      const predictionsRef = collection(db, 'predictions');
      const q = query(
        predictionsRef,
        where('userId', '==', user.uid),
        where('groupId', '==', groupId)
      );
      const querySnapshot = await getDocs(q);

      // Mettre à jour les stats du groupe
      const groupRef = doc(db, 'groups', groupId);
      const groupDoc = await getDoc(groupRef);
      const groupData = groupDoc.data();
      
      // Si c'est une nouvelle prédiction
      if (!existingPrediction) {
        await updateDoc(groupRef, {
          'predictionStats.totalPredictions': (groupData.predictionStats?.totalPredictions || 0) + 1,
          'predictionStats.completedPredictions': isComplete 
            ? (groupData.predictionStats?.completedPredictions || 0) + 1 
            : (groupData.predictionStats?.completedPredictions || 0)
        });
      } 
      // Si c'est une mise à jour et que la prédiction devient complète
      else if (isComplete && !existingPrediction.isComplete) {
        await updateDoc(groupRef, {
          'predictionStats.completedPredictions': (groupData.predictionStats?.completedPredictions || 0) + 1
        });
      }
  
      if (!querySnapshot.empty) {
        await updateDoc(doc(db, 'predictions', querySnapshot.docs[0].id), predictionData);
        setSuccessMessage('Vos pronostics ont été mis à jour !');
      } else {
        await setDoc(doc(collection(db, 'predictions')), predictionData);
        setSuccessMessage('Vos pronostics ont été enregistrés !');
      }
  
      setIsConfirmationOpen(false);
      setTimeout(() => {
        navigate(`/group/${groupId}`);
      }, 2000); // Délai pour voir le message de succès
  
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };
  
  const loadExistingPredictions = async () => {
    try {
      const predictionsRef = collection(db, 'predictions');
      const q = query(
        predictionsRef,
        where('userId', '==', user.uid),
        where('groupId', '==', groupId)
      );
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const predictionData = querySnapshot.docs[0].data();
        
        // Fonction pour récupérer les données complètes d'une miss
        const getFullMissData = (missBasic) => {
          const fullMiss = missData.find(m => m.id === missBasic.id);
          return fullMiss || missBasic; // Fallback sur les données basiques si non trouvée
        };
  
        // Mettre à jour les états avec les données enrichies
        setTop3(predictionData.top3.map(getFullMissData));
        setTop5(predictionData.top5.map(getFullMissData));
        setQualified(predictionData.qualified.map(getFullMissData));
        setIsPublic(predictionData.isPublic);
        
        // Mettre à jour les Miss disponibles
        const selectedMissIds = [
          ...predictionData.top3.map(m => m.id),
          ...predictionData.top5.map(m => m.id),
          ...predictionData.qualified.map(m => m.id)
        ];
        setAvailableMisses(missData.filter(miss => !selectedMissIds.includes(miss.id)));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des prédictions:', error);
      setError('Impossible de charger vos prédictions existantes');
    }
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
        <div>
          {/* Navigation mobile */}
          <div className="md:hidden mb-4">
            <div className="bg-white rounded-lg p-2 flex space-x-2">
              <button
                onClick={() => setActiveTab('selection')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors
                  ${activeTab === 'selection' 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Sélectionner
              </button>
              <button
                onClick={() => setActiveTab('selections')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors relative
                  ${activeTab === 'selections' 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Vos sélections
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {top3.length + top5.length + qualified.length}
                </span>
              </button>
            </div>
          </div>

          {/* Contenu principal - Desktop et Mobile */}
          <div className="block md:grid md:grid-cols-12 md:gap-8">
            {/* Colonne gauche - Selection des candidates */}
            <div className={`md:col-span-8 ${activeTab === 'selections' ? 'hidden md:block' : 'block'}`}>
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                  {/* Header avec titre et bouton galerie */}
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

                {/* Grille des candidates avec scroll */}
                <div className="p-4 overflow-y-auto max-h-[calc(100vh-300px)]">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredAvailableMisses.length > 0 ? (
                      filteredAvailableMisses.map(miss => (
                        <MissCard
                          key={miss.id}
                          miss={miss}
                          onSelect={() => handleMissSelect(miss)}
                        />
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-8 text-gray-500">
                        Aucune candidate ne correspond à votre recherche
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Système de points */}
              <div className="mt-8">
                <PointsSystem />
              </div>

              {/* Messages de succès/erreur */}
              {(error || successMessage) && (
                <div className="mb-8 mt-8">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}
                  {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                      {successMessage}
                    </div>
                  )}
                </div>
              )}

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
                  disabled={isSaving}
                  className={`px-6 py-2 rounded-lg shadow-sm flex items-center justify-center ${
                    isSaving
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                  }`}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sauvegarde en cours...
                    </>
                  ) : (
                    'Valider mes pronostics'
                  )}
                </button>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-500"></div>
                      <span className="ml-3 text-sm text-gray-600">
                        Rendre mes pronostics publics
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite - Sélections (4/12 = ~1/3) */}
            <div className={`md:col-span-4 space-y-6 ${activeTab === 'selection' ? 'hidden md:block' : 'block'}`}>
              {/* Règles du jeu */}
              <GameRules />
              {/* Top 5 */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Votre Top 5</h2>
                </div>
                <div className="p-4 space-y-4">
                  {titles.map((title, index) => (
                    <div key={title} className="relative">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">{title}</h3>
                      {index < 3 ? (
                        top3[index] ? (
                          <MissCard
                            miss={top3[index]}
                            isSelected
                            selectionType="top3"
                            showRemoveButton
                            onRemove={() => handleRemove(top3[index], 'top3')}
                            rank={title}
                          />
                        ) : (
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex justify-center items-center text-gray-400 h-24">
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
                            rank={title}
                          />
                        ) : (
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex justify-center items-center text-gray-400 h-24">
                            Sélectionnez une Miss
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualifiées */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Autres Miss qualifiées
                    <span className="ml-2 text-sm text-gray-500">
                      ({qualified.length}/10)
                    </span>
                  </h2>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
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
                    {qualified.length < 10 && (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex justify-center items-center text-gray-400 h-24">
                        Sélectionnez encore {10 - qualified.length} Miss
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
    </div>
  );
};

export default RankingPage;