import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const EVENT_DOC_ID = 'missfranceEventStatus';
const EVENT_COLLECTION = 'events';

// Créer ou mettre à jour le statut de l'événement
export const setEventStatus = async (started) => {
  try {
    const eventRef = doc(db, EVENT_COLLECTION, EVENT_DOC_ID);
    const eventDoc = await getDoc(eventRef);

    if (!eventDoc.exists()) {
      // Créer le document s'il n'existe pas
      await setDoc(eventRef, {
        started,
        lastUpdated: new Date().toISOString()
      });
    } else {
      // Mettre à jour le document existant
      await updateDoc(eventRef, {
        started,
        lastUpdated: new Date().toISOString()
      });
    }
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut de l\'événement:', error);
    throw error;
  }
};

// Récupérer le statut de l'événement
export const getEventStatus = async () => {
  try {
    const eventRef = doc(db, EVENT_COLLECTION, EVENT_DOC_ID);
    const eventDoc = await getDoc(eventRef);

    if (!eventDoc.exists()) {
      // Si le document n'existe pas, on considère que l'événement n'a pas commencé
      return false;
    }

    return eventDoc.data().started;
  } catch (error) {
    console.error('Erreur lors de la récupération du statut de l\'événement:', error);
    throw error;
  }
};
