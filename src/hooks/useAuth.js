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
      
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...userDoc.exists() ? userDoc.data() : {}
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("❌ Erreur de synchronisation:", error);
        setUser((prevUser) => prevUser || { uid: firebaseUser.uid, email: firebaseUser.email }); // 🔥 Garde au moins les infos Firebase
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
        const userDocRef = doc(db, 'users', result.user.uid);
        let userData;
  
        if (!(await getDoc(userDocRef)).exists()) {
          await setDoc(userDocRef, {
            email: result.user.email,
            createdAt: new Date().toISOString()
          });
        }
  
        const userDoc = await getDoc(userDocRef);
        userData = {
          uid: result.user.uid,
          email: result.user.email,
          ...userDoc.exists() ? userDoc.data() : {}
        };
  
        return userData;
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
        let userData;
  
        if (!(await getDoc(userDocRef)).exists()) {
          await setDoc(userDocRef, {
            username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            email: firebaseUser.email,
            createdAt: new Date().toISOString()
          });
        }
  
        // 🔥 On refait un getDoc() pour être sûr d'avoir les dernières données
        const newUserDoc = await getDoc(userDocRef);
        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...newUserDoc.exists() ? newUserDoc.data() : {}
        };
  
        return userData;
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
      signOut(auth),
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