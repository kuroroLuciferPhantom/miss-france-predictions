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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Récupérer les données utilisateur supplémentaires depuis Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setUser({
          uid: user.uid,
          email: user.email,
          ...userDoc.data()
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, username) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Créer le profil utilisateur dans Firestore
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
      
      // Vérifier si l'utilisateur existe déjà dans Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Créer le profil utilisateur s'il n'existe pas
        await setDoc(doc(db, 'users', user.uid), {
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
