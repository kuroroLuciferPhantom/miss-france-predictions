import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { useAuthContext } from '../../contexts/AuthContext';
import { Lock, Eye, EyeOff } from 'lucide-react';

const PredictionsList = ({ groupId }) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventStarted, setEventStarted] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        // Vérifier si l'événement a commencé
        const eventDoc = await getDoc(doc(db, 'events', 'missfranceEventStatus'));
        const isStarted = eventDoc.exists() ? eventDoc.data().started : false;
        setEventStarted(isStarted);

        // D'abord récupérer le groupe pour avoir la liste des membres
        const groupDoc = await getDoc(doc(db, 'groups', groupId));
        const members = groupDoc.data().members;

        // Ensuite récupérer les prédictions pour chaque membre individuellement
        const allPredictions = [];
        for (const member of members) {
          try {
            const memberPrediction = await getDoc(doc(db, 'predictions', member.userId));
            if (memberPrediction.exists()) {
              const predData = memberPrediction.data();
              // N'ajouter que si c'est le bon groupe
              if (predData.groupId === groupId) {
                allPredictions.push({
                  id: memberPrediction.id,
                  ...predData,
                  username: member.username,
                  isCurrentUser: member.userId === user.uid
                });
              }
            }
          } catch (err) {
            console.log(`Pas de prédiction pour ${member.username}`);
          }
        }
        
        setPredictions(allPredictions);
      } catch (error) {
        console.error('Erreur lors du chargement des prédictions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchPredictions();
    }
  }, [groupId, user]);

  const renderPredictionContent = (prediction) => {
    const canView = eventStarted || prediction.isPublic || prediction.isCurrentUser;
    const isPending = !prediction.isComplete;

    if (isPending) {
      return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="text-gray-500">
            En attente des prédictions...
          </div>
        </div>
      );
    }

    if (!canView) {
      return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 text-gray-500">
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
            <h4 className="font-medium text-gray-700 mb-2">Top 3</h4>
            <div className="space-y-2">
              {prediction.top3?.map((miss, index) => (
                <div key={index} className="flex items-center space-x-2 bg-pink-50 p-2 rounded">
                  <span className="font-bold text-pink-600">#{index + 1}</span>
                  <span>{miss.name}</span>
                  <span className="text-gray-500 text-sm">({miss.region})</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Top 5</h4>
            <div className="space-y-2">
              {prediction.top5?.map((miss, index) => (
                <div key={index} className="flex items-center space-x-2 bg-purple-50 p-2 rounded">
                  <span className="font-bold text-purple-600">#{index + 4}</span>
                  <span>{miss.name}</span>
                  <span className="text-gray-500 text-sm">({miss.region})</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Qualifiées</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {prediction.qualified?.map((miss, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                  <span>{miss.name}</span>
                  <span className="text-gray-500 text-sm">({miss.region})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        {[1, 2].map((n) => (
          <div key={n} className="bg-white rounded-lg shadow-sm p-6">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Aucune prédiction pour le moment</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {!eventStarted && (
        <div className="bg-amber-50 p-4 rounded-lg mb-6">
          <p className="text-amber-700">
            Les prédictions privées seront visibles par tous les membres du groupe 
            dès le lancement de l'émission Miss France.
          </p>
        </div>
      )}

      {predictions.map((prediction) => (
        <div key={prediction.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">
                {prediction.username}
                {prediction.isCurrentUser && (
                  <span className="ml-2 text-sm text-gray-500">(Vous)</span>
                )}
              </h3>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
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
            <div className="mt-4 text-sm text-gray-500">
              Dernière mise à jour : {new Date(prediction.lastUpdated).toLocaleDateString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PredictionsList;