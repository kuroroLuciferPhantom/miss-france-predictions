import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MissCard from '../components/ranking/MissCard';
import GameRules from '../components/GameRules';
import ConfirmationModal from '../components/ranking/ConfirmationModal';
import PointsSystem from '../components/PointsSystem';
import MissGalleryModal from '../components/ranking/MissGalleryModal';
import { missData, titles } from '../data/missData';
import { doc, setDoc, updateDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
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
  const [eventStarted, setEventStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const SharePredictionsWithClose = ({ onClose, navigate }) => {
    const componentRef = useRef(null);
    const pageUrl = window.location.href;
    const shareText = "Je viens de faire mes pronostics pour Miss France 2026 ! Viens faire les tiens sur Miss'Prono 👑";
    const shareModalRef = useRef(null);

    useEffect(() => {
      if (showShareComponent && shareModalRef.current) {
        // Force le positionnement en haut de l'écran
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // Gestionnaire pour fermer en cliquant en dehors
        const handleClickOutside = (event) => {
          if (shareModalRef.current && !shareModalRef.current.contains(event.target)) {
            setShowShareComponent(false);
          }
        };
        
        // Ajouter l'écouteur d'événement
        document.addEventListener('mousedown', handleClickOutside);
        
        // Nettoyage
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [showShareComponent]);

    // Effet pour s'assurer que le document est scrollable
    useEffect(() => {
      document.body.style.overflow = 'auto';

      // Gestionnaire pour fermer en cliquant en dehors
      const handleClickOutside = (event) => {
        if (componentRef.current && !componentRef.current.contains(event.target)) {
          onClose();
        }
      };

      // Ajouter l'écouteur d'événement avec un délai pour éviter la fermeture immédiate
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      // Nettoyage
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [onClose]);

    const handleShare = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Miss'Prono - Mes pronostics",
            text: shareText,
            url: pageUrl,
          });
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error('Erreur lors du partage:', error);
          }
        }
      }
    };

    const handleReturnToDashboard = () => {
      navigate('/dashboard');
    };

    // URLs de partage pour les réseaux sociaux
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(shareText)}`;
    const twitterShareUrl = `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`;

    return (
      <div ref={componentRef}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Partagez vos pronostics !
        </h3>

        {/* Bouton de partage natif (mobile) */}
        {navigator.share && (
          <button
            onClick={handleShare}
            className="w-full mb-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
          >
            <span>Partager</span>
          </button>
        )}

        {/* Boutons réseaux sociaux */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Facebook */}
          <a href={fbShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
          >
            <span>Facebook</span>
          </a>

          {/* Twitter/X */}
          <a href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
          >
            <span>Twitter</span>
          </a>
        </div>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
          Invitez vos amis à faire leurs pronostics et comparez vos résultats !
        </p>

        {/* Bouton Retour au Dashboard */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleReturnToDashboard}
            className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-lg flex items-center justify-center gap-2"
          >
            Retour au Dashboard
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const checkEventStatus = async () => {
      try {
        const eventDoc = await getDoc(doc(db, 'events', 'missfranceEventStatus'));
        if (eventDoc.exists() && eventDoc.data().started) {
          setEventStarted(true);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du statut de l\'événement:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkEventStatus();

    if (user) {
      loadExistingPredictions().then(hasPronostics => {
        if (hasPronostics) {
          showToast.success('Vos pronostics ont été chargés !');
        }
      });
    }
  }, [user]);

  const handleMissSelect = (miss) => {
    // Vérifier le nombre total de sélections
    const totalSelected = top3.length + top5.length + qualified.length;
    if (totalSelected >= 15) {
      showToast.error('Vous avez déjà sélectionné 15 Miss. Retirez-en une pour en ajouter une nouvelle.');
      return;
    }

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

        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors du chargement des prédictions:', error);
      showToast.error('Impossible de charger vos pronostics existants');
      return false;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 dark:border-pink-400 border-t-transparent"></div>
      </div>
    );
  }

  if (eventStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 text-center">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-red-500 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              L'élection a commencé
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Il n'est plus possible de modifier ou d'ajouter des pronostics car l'élection Miss France 2026 a débuté.
            </p>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 dark:hover:from-pink-700 dark:hover:to-purple-700 transition-colors font-medium"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </div>
    );
  }

  const SelectionGuide = () => {
    return (
      <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
              Comment faire vos pronostics
            </h4>
            <div className="text-sm text-blue-700 dark:text-blue-200 space-y-2">
              <p>
                <span className="font-medium">1.</span> Cliquez sur une Miss dans la liste pour l'ajouter à votre sélection. Elles seront ajoutées dans cet ordre :
              </p>
              <ol className="list-decimal pl-8 space-y-1">
                <li>D'abord votre top 3 (Miss France et 1ère et 2ème dauphines)</li>
                <li>Puis votre top 5 (3ème et 4ème dauphines)</li>
                <li>Enfin, les 10 autres Miss qualifiées</li>
              </ol>
              <p>
                <span className="font-medium">2.</span> Consultez et modifiez votre sélection en cliquant sur l'onglet "Vos sélections"
              </p>
              <p>
                <span className="font-medium">3.</span> Pour retirer une Miss, cliquez sur la croix à côté de son nom dans l'onglet "Vos sélections"
              </p>
              <p>
                <span className="font-medium">4.</span> Une fois vos 15 Miss sélectionnées, validez vos pronostics !
              </p>
            </div>
          </div>
        </div>
      </div>
    );
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

        <div className="mb-8">
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-orange-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-orange-700 dark:text-orange-400">
                  Les photos des candidates Miss France sont la propriété exclusive de la Société Miss France / Sipa Press et ne peuvent être reproduites sans autorisation
                </p>
              </div>
            </div>
          </div>
        </div>

        <SelectionGuide />

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
                        onRemove={() => { }}
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
          <div
            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 overflow-y-auto"
            style={{ paddingTop: '4rem' }}
          >
            <div
              ref={shareModalRef} // Assurez-vous d'ajouter cette ref en haut du composant
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto"
              style={{ marginTop: '0', marginBottom: '4rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Partagez vos pronostics !
              </h3>

              {/* Bouton de partage natif (mobile) */}
              {navigator.share && (
                <button
                  onClick={handleShare}
                  className="w-full mb-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <span>Partager</span>
                </button>
              )}

              {/* Boutons réseaux sociaux */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Facebook */}
                <a href={fbShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <FacebookIcon size={20} />
                  <span>Facebook</span>
                </a>

                {/* Twitter/X */}
                <a href={twitterShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                >
                  <XIcon size={20} />
                  <span>Twitter</span>
                </a>
              </div>

              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                Invitez vos amis à faire leurs pronostics et comparez vos résultats !
              </p>

              {/* Bouton Retour au Dashboard */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleDashboard}
                  className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-lg flex items-center justify-center gap-2"
                >
                  Retour au Dashboard
                </button>
              </div>
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