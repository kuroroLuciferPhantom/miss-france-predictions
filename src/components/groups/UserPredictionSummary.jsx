import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const UserPredictionSummary = ({ prediction, groupId, eventStarted }) => {
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

  const isEliminated = (miss) => {
    if (!eventResults?.qualified) return false;
    return !eventResults.qualified.some(m => m.id === miss.id);
  };

  if (!prediction) {
    // ... code inchangé pour l'état sans prédiction ...
  }

  const total = (prediction.top3?.length || 0) + 
                (prediction.top5?.length || 0) + 
                (prediction.qualified?.length || 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-medium text-gray-900 dark:text-white">Vos pronostics</h3>
        <div className="flex items-center gap-2">
          {total === 15 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
              Complété ✓
            </span>
          ) : !eventStarted && (
            <>
              <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                {total}/15 sélections
              </span>
              <Link 
                to={`/predictions`}
                className="text-sm text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 font-medium"
              >
                Continuer →
              </Link>
            </>
          )}
        </div>
      </div>
  
      <div className="p-4 space-y-4">
        {/* Paramètres - ne s'affichent que si l'événement n'a pas commencé */}
        {!eventStarted && (
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Visibilité: {prediction.isPublic ? 'Public' : 'Privé'}
            </span>
            <Link 
              to={`/group/${groupId}/prediction`}
              className="text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 font-medium"
            >
              Modifier
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPredictionSummary;