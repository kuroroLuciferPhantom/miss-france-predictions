import React from 'react';

const PointsSystem = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Système de points</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-pink-50 rounded">
          <div className="text-2xl font-bold text-pink-500">10 pts</div>
          <p className="text-sm text-gray-600 mt-1">Pour avoir deviné Miss France</p>
        </div>
        <div className="text-center p-4 bg-pink-50 rounded">
          <div className="text-2xl font-bold text-pink-500">3+2 pts</div>
          <p className="text-sm text-gray-600 mt-1">Pour chaque Miss dans le top 5 (+2 si bien placée)</p>
        </div>
        <div className="text-center p-4 bg-pink-50 rounded">
          <div className="text-2xl font-bold text-pink-500">2 pts</div>
          <p className="text-sm text-gray-600 mt-1">Pour chaque Miss qualifiée identifiée</p>
        </div>
      </div>
    </div>
  );
};

export default PointsSystem;