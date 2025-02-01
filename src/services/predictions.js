import { db } from '@/config/firebase';
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

const PREDICTIONS_COLLECTION = 'predictions';
const CONTEST_SETTINGS_COLLECTION = 'contestSettings';

// Créer ou mettre à jour un pronostic
export const savePrediction = async (userId, groupId, predictionData) => {
  const predictionRef = doc(db, PREDICTIONS_COLLECTION, `${groupId}_${userId}`);
  await setDoc(predictionRef, {
    userId,
    groupId,
    ...predictionData,
    timestamp: new Date()
  });
};

// Récupérer un pronostic spécifique
export const getPrediction = async (userId, groupId) => {
  const predictionRef = doc(db, PREDICTIONS_COLLECTION, `${groupId}_${userId}`);
  const snapshot = await getDoc(predictionRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

// Écouter les pronostics d'un groupe
export const subscribeToPredictions = (groupId, callback) => {
  const q = query(
    collection(db, PREDICTIONS_COLLECTION),
    where('groupId', '==', groupId),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const predictions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(predictions);
  });
};

// Récupérer les paramètres du concours
export const getContestSettings = async () => {
  const settingsRef = doc(db, CONTEST_SETTINGS_COLLECTION, 'missfranceedition2025');
  const snapshot = await getDoc(settingsRef);
  if (snapshot.exists()) {
    return snapshot.data();
  }
  return null;
};

// Mettre à jour l'état du concours (admin uniquement)
export const updateContestSettings = async (settings) => {
  const settingsRef = doc(db, CONTEST_SETTINGS_COLLECTION, 'missfranceedition2025');
  await setDoc(settingsRef, {
    ...settings,
    lastUpdate: new Date()
  });
};

// Calculer les points d'un pronostic
export const calculatePoints = (prediction, results) => {
  let points = 0;

  // Points pour le top 5
  prediction.selections.top5.forEach((selection, index) => {
    if (results.top5[index]?.id === selection.id) {
      // Bonus pour la position exacte
      points += (5 - index) * 10;
    } else if (results.top5.some(r => r.id === selection.id)) {
      // Points réduits si dans le top 5 mais mauvaise position
      points += 5;
    }
  });

  // Points pour les qualifiées
  prediction.selections.qualified.forEach(missId => {
    if (results.qualified.includes(missId)) {
      points += 5;
    }
  });

  return points;
};

// Récupérer le classement d'un groupe
export const getGroupLeaderboard = async (groupId) => {
  const predictions = [];
  const q = query(
    collection(db, PREDICTIONS_COLLECTION),
    where('groupId', '==', groupId)
  );
  
  const snapshot = await getDocs(q);
  snapshot.forEach(doc => {
    predictions.push({
      id: doc.id,
      ...doc.data()
    });
  });

  // À implémenter : calcul des points une fois les résultats disponibles
  return predictions.map((prediction, index) => ({
    userId: prediction.userId,
    position: index + 1,
    points: 0, // À calculer avec les résultats
    hasPrediction: true,
    isPublic: prediction.isPublic
  }));
};