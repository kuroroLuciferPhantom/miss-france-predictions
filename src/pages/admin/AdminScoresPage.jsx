import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { useAuthContext } from '../../contexts/AuthContext';
import { showToast } from '../../components/ui/Toast';

const AdminScoresPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [eventStatus, setEventStatus] = useState(null);
  const [usersProcessed, setUsersProcessed] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [lastCalculation, setLastCalculation] = useState(null);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists() || !userDoc.data().isAdmin) {
        navigate('/');
      }
    };

    checkAdmin();
  }, [user, navigate]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Charger le statut de l'événement
        const eventDoc = await getDoc(doc(db, 'eventResults', 'missfranceEventStatus'));
        if (eventDoc.exists()) {
          setEventStatus(eventDoc.data());
        }

        // Charger la dernière date de calcul
        const scoresDoc = await getDoc(doc(db, 'calculationStatus', 'lastCalculation'));
        if (scoresDoc.exists()) {
          setLastCalculation(scoresDoc.data());
        }

        // Compter le nombre total d'utilisateurs
        const usersSnapshot = await getDocs(collection(db, 'users'));
        setTotalUsers(usersSnapshot.size);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const calculateScores = async () => {
    setCalculating(true);
    setUsersProcessed(0);
  
    try {
      // Récupérer toutes les prédictions
      const predictionsSnapshot = await getDocs(collection(db, 'predictions'));
      const predictions = predictionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      // Créer un nouveau batch pour le statut final
      const finalBatch = writeBatch(db);
  
      // Traiter les prédictions par lots de 500
      const batchSize = 500;
      for (let i = 0; i < predictions.length; i += batchSize) {
        const batch = writeBatch(db);
        const currentBatch = predictions.slice(i, i + batchSize);
  
        for (const prediction of currentBatch) {
          const scores = calculateUserScores(prediction, eventStatus);
          const userScoreRef = doc(db, 'userScores', prediction.userId, 'years', '2026');
          batch.set(userScoreRef, {
            ...scores,
            calculatedAt: new Date().toISOString()
          });
  
          // Gérer les badges si top5Completed est true
          if (eventStatus.top5Completed) {
            const userBadgesRef = doc(db, 'userBadges', prediction.userId);
            const badgeData = {
              badges: {
                [`missFound${scores.year}`]: scores.foundMissFrance
              },
              updatedAt: new Date().toISOString()
            };
            batch.set(userBadgesRef, badgeData, { merge: true });
          }
  
          setUsersProcessed(prev => prev + 1);
        }
  
        await batch.commit();
      }
  
      // Mettre à jour le statut du calcul avec le finalBatch
      finalBatch.set(doc(db, 'calculationStatus', 'lastCalculation'), {
        timestamp: new Date().toISOString(),
        top15: eventStatus.top15Completed,
        top5: eventStatus.top5Completed
      });
  
      await finalBatch.commit();

       // Ajouter le toast de succès ici
      showToast.success(`Scores calculés avec succès ! ${usersProcessed} utilisateurs traités.`);
    } catch (error) {
      console.error('Erreur lors du calcul des scores:', error);
      showToast.error('Erreur lors du calcul des scores');
    } finally {
      setCalculating(false);
    }
  };

  const calculateUserScores = (prediction, results) => {
    const scores = {
      qualifiedCorrect: 0,
      top5Correct: 0,
      top5PositionCorrect: 0,
      top3Correct: 0,
      top3PositionCorrect: 0,
      totalScore: 0,
      foundMissFrance: false
    };
  
    // Vérification que toutes les propriétés nécessaires existent
    if (!prediction || !results) return scores;
  
    // Calcul pour les qualifiées
    if (Array.isArray(results.qualified) && Array.isArray(prediction.qualified)) {
      scores.qualifiedCorrect = prediction.qualified.filter(
        p => p?.id && results.qualified.some(r => r?.id === p.id)
      ).length;
    }
  
    // Calcul pour le top 5
    if (Array.isArray(results.top5) && Array.isArray(prediction.top5)) {
      scores.top5Correct = prediction.top5.filter(
        (p) => p?.id && results.top5.some(r => r?.id === p.id)
      ).length;
  
      scores.top5PositionCorrect = prediction.top5.filter(
        (p, index) => p?.id && results.top5[index]?.id === p.id
      ).length;
    }
  
    // Calcul pour le top 3
    if (Array.isArray(results.top5) && Array.isArray(prediction.top3)) {
      const top3Results = results.top5.slice(0, 3);
      scores.top3Correct = prediction.top3.filter(
        p => p?.id && top3Results.some(r => r?.id === p.id)
      ).length;
  
      scores.top3PositionCorrect = prediction.top3.filter(
        (p, index) => p?.id && top3Results[index]?.id === p.id
      ).length;
    }
  
    // Vérification Miss France
    if (results.top5?.[0]?.id && prediction.top3?.[0]?.id) {
      scores.foundMissFrance = results.top5[0].id === prediction.top3[0].id;
    }
  
    // Calcul du score total
    scores.totalScore = 
      scores.qualifiedCorrect * 2 +       // 2 points par qualifiée
      scores.top5Correct * 3 +            // 3 points par Miss dans le top 5
      scores.top5PositionCorrect * 2 +    // 2 points bonus si bonne position top 5
      scores.top3Correct * 4 +            // 4 points par Miss dans le top 3
      scores.top3PositionCorrect * 3 +    // 3 points bonus si bonne position top 3
      (scores.foundMissFrance ? 10 : 0);  // 10 points pour Miss France
  
    return scores;
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden dark:bg-gray-800">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Calcul des scores
            </h1>
          </div>

          {/* Statut actuel */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">État actuel</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium dark:text-white">Top 15 :</span>{' '}
                <span className={eventStatus?.top15Completed ? 'text-green-600' : 'text-amber-600'}>
                  {eventStatus?.top15Completed ? 'Complété' : 'En attente'}
                </span>
              </p>
              <p>
                <span className="font-medium dark:text-white">Top 5 :</span>{' '}
                <span className={eventStatus?.top5Completed ? 'text-green-600' : 'text-amber-600'}>
                  {eventStatus?.top5Completed ? 'Complété' : 'En attente'}
                </span>
              </p>
              {lastCalculation && (
                <p className='dark:text-white'>
                  <span className="font-medium dark:text-white">Dernier calcul :</span>{' '}
                  {new Date(lastCalculation.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          {/* Section calcul */}
          <div className="p-6">
            {calculating ? (
              <div className="space-y-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(usersProcessed / totalUsers) * 100}%` }}
                  />
                </div>
                <p className="text-center text-gray-600">
                  Calcul en cours... {usersProcessed}/{totalUsers} utilisateurs traités
                </p>
              </div>
            ) : (
              <div className="flex justify-center">
                <button
                  onClick={calculateScores}
                  disabled={!eventStatus?.top15Completed}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Lancer le calcul des scores
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScoresPage;