import React from 'react';
import { Card } from '@/components/ui/card';

const PredictionDetails = ({ prediction, user, showPrivate = false }) => {
  if (!prediction.isPublic && !showPrivate) {
    return (
      <Card className="p-4">
        <p className="text-gray-500 text-center">
          Ce pronostic est privé et sera révélé lors du début de l'émission
        </p>
      </Card>
    );
  }

  const rankings = [
    "Miss France 2025",
    "1ère Dauphine",
    "2ème Dauphine",
    "3ème Dauphine",
    "4ème Dauphine"
  ];

  return (
    <Card className="divide-y">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">
            Pronostics de {user.username}
          </h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            prediction.isPublic 
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {prediction.isPublic ? 'Public' : 'Privé'}
          </span>
        </div>

        <div className="space-y-4">
          <section>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Top 5</h4>
            <div className="space-y-2">
              {prediction.selections.top5.map((selection, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm font-medium">
                    {rankings[index]}
                  </span>
                  <span>
                    {selection.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Miss qualifiées
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {prediction.selections.qualified.map((miss) => (
                <div 
                  key={miss.id}
                  className="p-2 bg-gray-50 rounded text-sm"
                >
                  {miss.name}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Card>
  );
};

export default PredictionDetails;