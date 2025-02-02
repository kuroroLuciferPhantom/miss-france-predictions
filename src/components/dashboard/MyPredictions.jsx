import React from 'react';
import { Link } from 'react-router-dom';

const MyPredictions = ({ groups }) => {
  // Grouper les prédictions par statut
  const groupedPredictions = groups.reduce((acc, group) => {
    const prediction = group.prediction;
    const total = (prediction?.top3?.length || 0) + (prediction?.top5?.length || 0) + (prediction?.qualified?.length || 0);
    const status = total === 0 ? 'notStarted' : total === 15 ? 'completed' : 'inProgress';
    
    acc[status].push({
      groupId: group.id,
      groupName: group.name,
      prediction: prediction || null,
      completionRate: Math.round((total / 15) * 100)
    });
    
    return acc;
  }, { completed: [], inProgress: [], notStarted: [] });

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Mes pronostics</h2>

      {/* Groupes avec pronostics complets */}
      {groupedPredictions.completed.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-green-600 mb-3">Pronostics complétés</h3>
          <div className="space-y-3">
            {groupedPredictions.completed.map(({ groupId, groupName }) => (
              <Link
                key={groupId}
                to={`/group/${groupId}/prediction`}
                className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{groupName}</span>
                  <span className="text-sm text-green-600">Complété</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Groupes avec pronostics en cours */}
      {groupedPredictions.inProgress.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-orange-600 mb-3">En cours</h3>
          <div className="space-y-3">
            {groupedPredictions.inProgress.map(({ groupId, groupName, completionRate }) => (
              <Link
                key={groupId}
                to={`/group/${groupId}/prediction`}
                className="block p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{groupName}</span>
                  <span className="text-sm text-orange-600">{completionRate}%</span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-1.5">
                  <div 
                    className="bg-orange-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Groupes sans pronostics */}
      {groupedPredictions.notStarted.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">À compléter</h3>
          <div className="space-y-3">
            {groupedPredictions.notStarted.map(({ groupId, groupName }) => (
              <Link
                key={groupId}
                to={`/group/${groupId}/prediction`}
                className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">{groupName}</span>
                  <span className="text-sm text-gray-500">Non commencé</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Message si aucun groupe */}
      {groups.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Rejoignez un groupe pour commencer vos pronostics !
        </div>
      )}
    </div>
  );
};

export default MyPredictions;