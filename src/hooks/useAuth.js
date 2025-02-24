//src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { showToast } from '../components/ui/Toast';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
  
      try {
        if (firebaseUser) {
          // Vérifier d'abord si l'email est vérifié
          if (!firebaseUser.emailVerified) {
            // Si l'email n'est pas vérifié, on stocke uniquement les infos de base
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              emailVerified: false
            });
            return;
          }
  
          // Si l'email est vérifié, on récupère les données Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
  
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: userDoc.username || firebaseUser.email.split('@')[0],
            emailVerified: true,
            ...userDoc.exists() ? userDoc.data() : {}
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("❌ Erreur de synchronisation:", error);
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified
          });
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  const login = async (email, password) => {
    return showToast.promise(
      signInWithEmailAndPassword(auth, email, password),
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

  const signup = async (email, password, username) => {
    return showToast.promise(
      (async () => {
        // Créer l'utilisateur dans Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Créer le document utilisateur dans Firestore
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        const userData = {
          username,
          email,
          createdAt: new Date().toISOString()
        };

        await setDoc(userDocRef, userData);

        // Retourner l'objet userCredential attendu
        return {
          user: userCredential.user,
          additionalUserInfo: {
            ...userData
          }
        };
      })(),
      {
        loading: 'Création du compte...',
        success: 'Compte créé avec succès !',
        error: 'Échec de la création du compte'
      }
    );
  };


  return {
    user,
    loading,
    login,
    loginWithGoogle,
    logout,
    signup
  };
};