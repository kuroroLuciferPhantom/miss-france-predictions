import React from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

const PredictionsList = ({ predictions, eventStarted }) => {
  // Fonction pour déterminer si on peut voir les pronostics
  const canViewPrediction = (prediction) => {
    return eventStarted || prediction.isPublic;
  };

  // Fonction pour formater le top 5
  const formatTopFive = (top5) => {
    return top5.map((miss, index) => `${index + 1}. ${miss.name}`).join('\n');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900">Pronostics du groupe</h2>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {predictions.map((prediction) => (
            <li key={prediction.userId} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {prediction.userAvatar ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={prediction.userAvatar}
                        alt={prediction.username}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-medium">
                        {prediction.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {prediction.username}
                    </div>
                    <div className="text-sm text-gray-500">
                      {canViewPrediction(prediction) ? (
                        <>
                          <div className="mt-1">
                            <span className="font-medium">Top 5:</span>
                            <pre className="mt-1 text-xs whitespace-pre-line">
                              {formatTopFive(prediction.top5)}
                            </pre>
                          </div>
                          {prediction.qualifiees && (
                            <div className="mt-2">
                              <span className="font-medium">Autres qualifiées:</span>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {prediction.qualifiees.map((miss) => (
                                  <span
                                    key={miss.id}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                                  >
                                    {miss.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="inline-flex items-center text-gray-500">
                          <EyeOff className="w-4 h-4 mr-1" />
                          Pronostics privés
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  {eventStarted ? (
                    <Lock className="w-5 h-5 text-purple-500" />
                  ) : prediction.isPublic ? (
                    <Eye className="w-5 h-5 text-green-500" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PredictionsList;