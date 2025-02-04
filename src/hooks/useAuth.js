//src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { showToast } from '../components/ui/Toast';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔄 Initialisation de l'écouteur d'authentification");
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("🔄 Changement d'état d'authentification:", firebaseUser?.email);
      setLoading(true);

      try {
        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...userDoc.exists() ? userDoc.data() : {}
          };

          console.log("✅ Données utilisateur synchronisées:", userData);
          setUser(userData);
        } else {
          console.log("ℹ️ Aucun utilisateur connecté");
          setUser(null);
        }
      } catch (error) {
        console.error("❌ Erreur de synchronisation:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      console.log("🧹 Nettoyage de l'écouteur d'authentification");
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    return showToast.promise(
      (async () => {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        return {
          uid: result.user.uid,
          email: result.user.email,
          ...userDoc.exists() ? userDoc.data() : {}
        };
      })(),
      {
        loading: 'Connexion en cours...',
        success: 'Connexion réussie !',
        error: 'Échec de la connexion'
      }
    );
  };

  const loginWithGoogle = async () => {
    return showToast.promise(
      (async () => {
        const provider = new GoogleAuthProvider();
        const { user: firebaseUser } = await signInWithPopup(auth, provider);
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            createdAt: new Date().toISOString()
          });
        }

        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...userDoc.exists() ? userDoc.data() : {}
        };
      })(),
      {
        loading: 'Connexion avec Google en cours...',
        success: 'Connexion réussie !',
        error: 'Échec de la connexion avec Google'
      }
    );
  };

  const logout = async () => {
    await showToast.promise(
      (async () => {
        await signOut(auth);
        setUser(null);
      })(),
      {
        loading: 'Déconnexion en cours...',
        success: 'À bientôt !',
        error: 'Échec de la déconnexion'
      }
    );
  };

  return {
    user,
    loading,
    login,
    loginWithGoogle,
    logout
  };
};