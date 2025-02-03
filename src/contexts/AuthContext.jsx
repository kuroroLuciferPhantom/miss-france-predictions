import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export const updateUsername = async (newUsername) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      username: newUsername
    });
    // Mettre à jour le context avec le nouveau username
    setUser(currentUser => ({
      ...currentUser,
      username: newUsername
    }));
  } catch (error) {
    throw error;
  }
};

export const updateUserPassword = async (newPassword) => {
  try {
    await updatePassword(auth.currentUser, newPassword);
  } catch (error) {
    throw error;
  }
};

export const deleteUserAccount = async () => {
  try {
    // D'abord supprimer les données de l'utilisateur
    await deleteDoc(doc(db, 'users', user.uid));
    
    // Supprimer la participation aux groupes
    const groupsQuery = query(collection(db, 'groups'), where('members', 'array-contains', { userId: user.uid }));
    const groupsSnapshot = await getDocs(groupsQuery);
    
    for (const groupDoc of groupsSnapshot.docs) {
      await updateDoc(doc(db, 'groups', groupDoc.id), {
        members: arrayRemove({ userId: user.uid })
      });
    }
    
    // Supprimer les prédictions
    const predictionsQuery = query(collection(db, 'predictions'), where('userId', '==', user.uid));
    const predictionsSnapshot = await getDocs(predictionsQuery);
    
    for (const predDoc of predictionsSnapshot.docs) {
      await deleteDoc(doc(db, 'predictions', predDoc.id));
    }
    
    // Enfin supprimer le compte Firebase Auth
    await deleteUser(auth.currentUser);
    
  } catch (error) {
    throw error;
  }
};