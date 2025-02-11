import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const PredictionsList = ({ predictions, eventStarted }) => {
  const { user } = useAuthContext();
  const [openPredictionId, setOpenPredictionId] = useState(null);
  const [eventResults, setEventResults] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const resultsDoc = await getDoc(doc(db, 'eventResults', 'missfranceEventStatus'));
        if (resultsDoc.exists() && resultsDoc.data().top15Completed) {
          setEventResults(resultsDoc.data());
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des résultats:', error);
      }
    };

    if (eventStarted) {
      fetchResults();
    }
  }, [eventStarted]);

  if (!predictions) {
    return (
      <div className="animate-pulse space-y-6">
        {[1, 2].map((n) => (
          <div key={n} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400">Aucune prédiction pour le moment</p>
      </div>
    );
  }

  const isEliminated = (miss) => {
    if (!eventResults?.qualified) return false;
    return !eventResults.qualified.some(m => m.id === miss.id);
  };

  const renderPredictionContent = (prediction) => {
    const canView = eventStarted || prediction.isPublic || prediction.userId === user.uid;
    const isPending = !prediction.isComplete;

    if (isPending) {
      return (
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-gray-500 dark:text-gray-400">
            En attente des prédictions...
          </div>
        </div>
      );
    }

    if (!canView) {
      return (
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <Lock size={16} />
            <span>Prédictions privées</span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Top 3</h4>
          <div className="space-y-2">
            {prediction.top3?.map((miss, index) => (
              <div key={miss.id} className="flex items-center justify-between bg-pink-50 dark:bg-pink-900/20 p-2 rounded">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-pink-600 dark:text-pink-400">#{index + 1}</span>
                  <span className="text-gray-900 dark:text-gray-100">{miss.name}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">({miss.region})</span>
                </div>
                {eventResults?.qualified && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    isEliminated(miss)
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {isEliminated(miss) ? 'Éliminée' : 'Qualifiée'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Top 5</h4>
          <div className="space-y-2">
            {prediction.top5?.map((miss, index) => (
              <div key={miss.id} className="flex items-center justify-between bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-purple-600 dark:text-purple-400">#{index + 4}</span>
                  <span className="text-gray-900 dark:text-gray-100">{miss.name}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">({miss.region})</span>
                </div>
                {eventResults?.qualified && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    isEliminated(miss)
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {isEliminated(miss) ? 'Éliminée' : 'Qualifiée'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Qualifiées</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {prediction.qualified?.map((miss) => (
              <div key={miss.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 dark:text-gray-100">{miss.name}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">({miss.region})</span>
                </div>
                {eventResults?.qualified && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    isEliminated(miss)
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {isEliminated(miss) ? 'Éliminée' : 'Qualifiée'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {!eventStarted && (
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg mb-6">
          <p className="text-amber-700 dark:text-amber-400">
            Les prédictions privées seront visibles par tous les membres du groupe
            dès le lancement de l'émission Miss France.
          </p>
        </div>
      )}

      {predictions.map((prediction) => (
        <div key={prediction.userId} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {/* En-tête cliquable */}
        <button 
          onClick={() => setOpenPredictionId(openPredictionId === prediction.userId ? null : prediction.userId)}
          className="w-full px-6 py-4 flex items-center justify-between border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {prediction.username}
                {prediction.userId === user.uid && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">(Vous)</span>
                )}
              </h3>
            </div>
            {/* N'afficher la visibilité que si l'émission n'a PAS commencé */}
            {!eventStarted && (
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                {prediction.isPublic ? (
                  <Eye size={16} />
                ) : (
                  <EyeOff size={16} />
                )}
                <span className="text-sm">
                  {prediction.isPublic ? 'Public' : 'Privé'}
                </span>
              </div>
            )}
            <svg
              className={`w-5 h-5 ml-4 text-gray-500 transform transition-transform ${openPredictionId === prediction.userId ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {/* Contenu de l'accordéon */}
          {openPredictionId === prediction.userId && (
            <div className="p-6">
              {renderPredictionContent(prediction)}
              {prediction.lastUpdated && (
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Dernière mise à jour : {new Date(prediction.lastUpdated).toLocaleDateString()}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PredictionsList;