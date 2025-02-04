import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const googleProvider = new GoogleAuthProvider();

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // 🔹 Évite une redirection prématurée
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("🔄 Mise à jour de l'utilisateur Firebase:", user); // 🔍 Debugging

      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          setUser({
            uid: user.uid,
            email: user.email,
            ...(userDoc.exists() ? userDoc.data() : {}) // 🔹 Évite les erreurs si l'user n'a pas de données Firestore
          });
        } catch (error) {
          console.error("❌ Erreur lors de la récupération des données Firestore:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false); // 🔹 Fin du chargement après traitement
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, username) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        createdAt: new Date().toISOString()
      });

      return user;
    } catch (error) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  const login = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          username: user.displayName || user.email.split('@')[0],
          email: user.email,
          createdAt: new Date().toISOString()
        });
      }

      return user;
    } catch (error) {
      throw new Error(getErrorMessage(error.code));
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Cette adresse email est déjà utilisée';
      case 'auth/invalid-email':
        return 'Adresse email invalide';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Email ou mot de passe incorrect';
      case 'auth/too-many-requests':
        return 'Trop de tentatives, veuillez réessayer plus tard';
      default:
        return 'Une erreur est survenue';
    }
  };

  return {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout
  };
};
