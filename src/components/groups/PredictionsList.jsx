import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Lock, Eye, EyeOff } from 'lucide-react';

const PredictionsList = ({ predictions, eventStarted }) => {
  const { user } = useAuthContext();

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
      <>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Top 3</h4>
            <div className="space-y-2">
              {prediction.top3?.map((miss, index) => (
                <div key={miss.id} className="flex items-center space-x-2 bg-pink-50 dark:bg-pink-900/20 p-2 rounded">
                  <span className="font-bold text-pink-600 dark:text-pink-400">#{index + 1}</span>
                  <span className="text-gray-900 dark:text-gray-100">{miss.name}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">({miss.region})</span>
                </div>
              ))}
            </div>
          </div>
  
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Top 5</h4>
            <div className="space-y-2">
              {prediction.top5?.map((miss, index) => (
                <div key={miss.id} className="flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                  <span className="font-bold text-purple-600 dark:text-purple-400">#{index + 4}</span>
                  <span className="text-gray-900 dark:text-gray-100">{miss.name}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">({miss.region})</span>
                </div>
              ))}
            </div>
          </div>
  
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Qualifiées</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {prediction.qualified?.map((miss) => (
                <div key={miss.id} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <span className="text-gray-900 dark:text-gray-100">{miss.name}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">({miss.region})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
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
        <div key={prediction.userId} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {prediction.username}
                {prediction.userId === user.uid && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">(Vous)</span>
                )}
              </h3>
            </div>
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
          </div>
          {renderPredictionContent(prediction)}
          {prediction.lastUpdated && (
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Dernière mise à jour : {new Date(prediction.lastUpdated).toLocaleDateString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PredictionsList;