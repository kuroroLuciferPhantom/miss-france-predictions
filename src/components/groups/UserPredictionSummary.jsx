import React from 'react';
import { Link } from 'react-router-dom';

const UserPredictionSummary = ({ prediction, groupId }) => {
  if (!prediction) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 bg-orange-50 px-4 py-3 text-orange-700">
          Vous n'avez pas encore commencé vos pronostics dans ce groupe.
        </div>
        <div className="p-4 text-center">
          <Link 
            to={`/group/${groupId}/prediction`}
            className="inline-flex px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors"
          >
            Commencer mes pronostics
          </Link>
        </div>
      </div>
    );
  }
  const total = (prediction.top3?.length || 0) + 
                (prediction.top5?.length || 0) + 
                (prediction.qualified?.length || 0);
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium">Vos pronostics</h3>
        <div className="flex items-center gap-2">
          {total === 15 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Complété ✓
            </span>
          ) : (
            <>
              <span className="text-sm text-orange-600 font-medium">
                {total}/15 sélections
              </span>
              <Link 
                to={`/group/${groupId}/prediction`}
                className="text-sm text-pink-500 hover:text-pink-600 font-medium"
              >
                Continuer →
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Top 3 */}
        {prediction.top3?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Top 3</h4>
            <div className="space-y-2">
              {prediction.top3.map((miss, index) => (
                <div key={miss.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-sm">{miss.name}</span>
                  <span className="text-xs text-gray-500 font-medium">
                    {index === 0 ? 'Miss France 2025' :
                     index === 1 ? '1ère Dauphine' :
                     '2ème Dauphine'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top 5 */}
        {prediction.top5?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Dauphines</h4>
            <div className="space-y-2">
              {prediction.top5.map((miss, index) => (
                <div key={miss.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-sm">{miss.name}</span>
                  <span className="text-xs text-gray-500 font-medium">
                    {index === 0 ? '3ème Dauphine' : '4ème Dauphine'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Qualifiées */}
        {prediction.qualified?.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Qualifiées ({prediction.qualified.length}/10)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {prediction.qualified.map((miss) => (
                <div key={miss.id} className="bg-gray-50 p-2 rounded text-sm">
                  {miss.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paramètres */}
        <div className="flex justify-between items-center pt-4 border-t text-sm">
          <span className="text-gray-600">
            Visibilité: {prediction.isPublic ? 'Public' : 'Privé'}
          </span>
          <Link 
            to={`/group/${groupId}/prediction`}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Modifier
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserPredictionSummary;