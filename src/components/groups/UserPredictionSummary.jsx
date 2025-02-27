import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const UserPredictionSummary = ({ prediction, groupId, eventStarted, predictionsOpen = true }) => {
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

  if (!prediction) {
    return (
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-xl p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Pas encore de pronostics ?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {!predictionsOpen
              ? "La saisie des pronostics n'est pas encore ouverte. Revenez bientôt !"
              : "Faites vos pronostics pour le concours Miss France et comparez vos résultats avec les autres membres du groupe !"}
          </p>
          <Link
            to="/predictions"
            className={`inline-flex items-center px-4 py-2 font-medium rounded-lg transition-colors ${!eventStarted && predictionsOpen
                ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                : "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
              }`}
            onClick={(e) => {
              if (eventStarted || !predictionsOpen) {
                e.preventDefault();
              }
            }}
          >
            {eventStarted
              ? "Pronostics fermés"
              : !predictionsOpen
                ? "Pronostics bientôt disponibles"
                : "Commencer mes pronostics"}
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  const total = (prediction.top3?.length || 0) +
    (prediction.top5?.length || 0) +
    (prediction.qualified?.length || 0);

  const isComplete = total === 15;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
            Vos pronostics
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Top 15 Miss France
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!eventStarted && (
            <div className="flex items-center gap-2 text-sm">
              <div className="flex h-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-500 transition-all"
                  style={{ width: `${(total / 15) * 100}%` }}
                />
              </div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                {total}/15
              </span>
            </div>
          )}

          {isComplete ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
              Complété ✓
            </span>
          ) : !eventStarted && predictionsOpen ? (
            <Link
              to="/predictions"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Continuer
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : !eventStarted && !predictionsOpen ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
              En attente d'ouverture
            </span>
          ) : null}
        </div>
      </div>

      {!eventStarted && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Visibilité :</span>
            <span className={`font-medium ${prediction.isPublic ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
              {prediction.isPublic ? 'Public' : 'Privé'}
            </span>
          </div>
          <Link
            to={`/predictions`}
            className="text-sm text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium"
          >
            Modifier votre prédiction
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserPredictionSummary;