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
  const [calculatingBadges, setCalculatingBadges] = useState(false);

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

  const calculateScores = async (type = 'top15') => {
    setCalculating(true);
    setUsersProcessed(0);

    try {
      const predictionsSnapshot = await getDocs(collection(db, 'predictions'));
      const predictions = predictionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const finalBatch = writeBatch(db);
      const batchSize = 500;

      for (let i = 0; i < predictions.length; i += batchSize) {
        const batch = writeBatch(db);
        const currentBatch = predictions.slice(i, i + batchSize);

        for (const prediction of currentBatch) {
          const scores = calculateUserScores(prediction, eventStatus, type);
          const userScoreRef = doc(db, 'userScores', prediction.userId, 'years', '2026');

          // Pour le top5, on met à jour les scores existants
          if (type === 'top5') {
            const existingScores = await getDoc(userScoreRef);
            const currentScores = existingScores.exists() ? existingScores.data() : {};

            batch.set(userScoreRef, {
              ...currentScores,
              ...scores,
              calculatedAt: new Date().toISOString()
            }, { merge: true });
          } else {
            // Pour le top15, on crée un nouveau document
            batch.set(userScoreRef, {
              ...scores,
              calculatedAt: new Date().toISOString()
            });
          }

          setUsersProcessed(prev => prev + 1);
        }

        await batch.commit();
      }

      finalBatch.set(doc(db, 'calculationStatus', 'lastCalculation'), {
        timestamp: new Date().toISOString(),
        [type]: true
      }, { merge: true });

      await finalBatch.commit();

      showToast.success(`Scores ${type} calculés avec succès ! ${usersProcessed} utilisateurs traités.`);
    } catch (error) {
      console.error('Erreur lors du calcul des scores:', error);
      showToast.error('Erreur lors du calcul des scores');
    } finally {
      setCalculating(false);
    }
  };

  // Modifier aussi la fonction calculateUserScores pour prendre en compte le type
  const calculateUserScores = (prediction, results, type = 'top15') => {
    const scores = {
      qualifiedCorrect: 0,
      top5Correct: 0,
      top5PositionCorrect: 0,
      top3Correct: 0,
      top3PositionCorrect: 0,
      totalScore: 0,
      foundMissFrance: false
    };

    if (!prediction || !results) return scores;

    // Pour le Top 15, on ne calcule que les qualifiées
    if (type === 'top15' && Array.isArray(results.qualified) && Array.isArray(prediction.qualified)) {
      scores.qualifiedCorrect = prediction.qualified.filter(
        p => p?.id && results.qualified.some(r => r?.id === p.id)
      ).length;

      scores.totalScore = scores.qualifiedCorrect * 2; // 2 points par qualifiée
      return scores;
    }

    // Pour le Top 5, on calcule tout le reste
    if (type === 'top5') {
      if (Array.isArray(results.top5) && Array.isArray(prediction.top5)) {
        scores.top5Correct = prediction.top5.filter(
          (p) => p?.id && results.top5.some(r => r?.id === p.id)
        ).length;

        scores.top5PositionCorrect = prediction.top5.filter(
          (p, index) => p?.id && results.top5[index]?.id === p.id
        ).length;
      }

      if (Array.isArray(results.top5) && Array.isArray(prediction.top3)) {
        const top3Results = results.top5.slice(0, 3);
        scores.top3Correct = prediction.top3.filter(
          p => p?.id && top3Results.some(r => r?.id === p.id)
        ).length;

        scores.top3PositionCorrect = prediction.top3.filter(
          (p, index) => p?.id && top3Results[index]?.id === p.id
        ).length;
      }

      if (results.top5?.[0]?.id && prediction.top3?.[0]?.id) {
        scores.foundMissFrance = results.top5[0].id === prediction.top3[0].id;
      }

      scores.totalScore =
        scores.top5Correct * 3 +            // 3 points par Miss dans le top 5
        scores.top5PositionCorrect * 2 +    // 2 points bonus si bonne position top 5
        scores.top3Correct * 4 +            // 4 points par Miss dans le top 3
        scores.top3PositionCorrect * 3 +    // 3 points bonus si bonne position top 3
        (scores.foundMissFrance ? 10 : 0);  // 10 points pour Miss France
    }

    return scores;
  };

  const calculateBadges = async () => {
    setCalculatingBadges(true);
    setUsersProcessed(0);

    try {
      // Récupérer tous les scores
      const predictionsSnapshot = await getDocs(collection(db, 'predictions'));
      const userScoresRef = collection(db, 'userScores');

      const batchSize = 500;
      for (let i = 0; i < predictionsSnapshot.docs.length; i += batchSize) {
        const batch = writeBatch(db);
        const currentBatch = predictionsSnapshot.docs.slice(i, i + batchSize);

        for (const predictionDoc of currentBatch) {
          const prediction = predictionDoc.data();
          const scoreDoc = await getDoc(doc(userScoresRef, prediction.userId, 'years', '2026'));
          const score = scoreDoc.exists() ? scoreDoc.data().totalScore : 0;

          const badges = {
            // Badge Miss Irma
            missFound2026: eventStatus.top5?.[0]?.id === prediction.top3?.[0]?.id,

            // Badge Abusey (top 5 exact)
            abusey: prediction.top5?.every((miss, index) =>
              eventStatus.top5?.[index]?.id === miss?.id
            ),

            // Badge Miroir Magique (plus de 20 pts)
            miroirMagique: score > 20,

            // Badge Baraka (plus de 35 pts)
            baraka: score > 35,

            // Badge Miss Goût Discutable
            missGoutDiscutable: !prediction.qualified?.some(m => m.id === eventStatus.top5?.[0]?.id) &&
              !prediction.top5?.some(m => m.id === eventStatus.top5?.[0]?.id) &&
              !prediction.top3?.some(m => m.id === eventStatus.top5?.[0]?.id),

            // Badge Physio (moins de 15 pts)
            physio: score < 15
          };

          const userBadgesRef = doc(db, 'userBadges', prediction.userId);
          batch.set(userBadgesRef, {
            badges,
            updatedAt: new Date().toISOString()
          }, { merge: true });

          setUsersProcessed(prev => prev + 1);
        }

        await batch.commit();
      }

      showToast.success(`Badges attribués avec succès ! ${usersProcessed} utilisateurs traités.`);
    } catch (error) {
      console.error('Erreur lors du calcul des badges:', error);
      showToast.error('Erreur lors de l\'attribution des badges');
    } finally {
      setCalculatingBadges(false);
    }
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
          <div className="p-6 space-y-8">
            {/* Section calcul scores */}
            <div>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Calcul des scores</h3>
              {calculating ? (
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(usersProcessed / totalUsers) * 100}%` }}
                    />
                  </div>
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    Calcul en cours... {usersProcessed}/{totalUsers} utilisateurs traités
                  </p>
                </div>
              ) : (
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => calculateScores('top15')}
                    disabled={!eventStatus?.top15Completed}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Calculer scores Top 15
                  </button>
                  <button
                    onClick={() => calculateScores('top5')}
                    disabled={!eventStatus?.top5Completed}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Calculer scores Top 5
                  </button>
                </div>
              )}
            </div>

            {/* Section attribution badges */}
            <div>
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Attribution des badges</h3>
              {calculatingBadges ? (
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(usersProcessed / totalUsers) * 100}%` }}
                    />
                  </div>
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    Attribution des badges en cours... {usersProcessed}/{totalUsers} utilisateurs traités
                  </p>
                </div>
              ) : (
                <div className="flex justify-center">
                  <button
                    onClick={calculateBadges}
                    disabled={!eventStatus?.top5Completed}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Attribuer les badges
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScoresPage;