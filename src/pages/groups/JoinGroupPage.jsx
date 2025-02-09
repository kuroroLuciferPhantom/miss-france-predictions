import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { useAuthContext } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const JoinGroupPage = () => {
  const [groupCode, setGroupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canJoinGroups, setCanJoinGroups] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    document.title = "Rejoindre un groupe - Miss'Pronos";
    checkGroupLimit();
  }, []);

  const checkGroupLimit = async () => {
    try {
      // Récupérer tous les groupes où l'utilisateur est membre
      const groups = await getDocs(collection(db, 'groups'));
      let memberCount = 0;

      // Vérifier chaque groupe
      for (const groupDoc of groups.docs) {
        const memberRef = doc(db, 'groups', groupDoc.id, 'members', user.uid);
        const memberSnap = await getDoc(memberRef);
        if (memberSnap.exists() || groupDoc.data().admin === user.uid) {
          memberCount++;
        }
      }

      if (memberCount >= 15) {
        setError('Vous avez atteint la limite de 15 groupes. Veuillez quitter un groupe avant d\'en rejoindre un nouveau.');
        setCanJoinGroups(false);
      } else {
        setCanJoinGroups(true);
      }
    } catch (err) {
      console.error('Erreur lors de la vérification des groupes:', err);
      setError('Une erreur est survenue lors de la vérification de vos groupes.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      // Vérifier le nombre de groupes
      const membershipQuery = query(
        collection(db, 'groups'),
        where(`members.${user.uid}`, '!=', null)
      );
      const userGroups = await getDocs(membershipQuery);
  
      if (userGroups.size >= 15) {
        setError('Vous avez atteint la limite de 15 groupes. Veuillez quitter un groupe avant d\'en rejoindre un nouveau.');
        setLoading(false);
        return;
      }
  
      // Recherche du groupe avec le code
      const groupQuery = query(
        collection(db, 'groups'),
        where('inviteCode', '==', groupCode.toUpperCase())
      );
  
      const querySnapshot = await getDocs(groupQuery);
  
      if (querySnapshot.empty) {
        setError('Code de groupe invalide');
        setLoading(false);
        return;
      }
  
      const groupDoc = querySnapshot.docs[0];
      const groupData = groupDoc.data();
  
      // Vérifier si l'utilisateur est déjà membre
      if (groupData.members?.[user.uid]) {
        setError('Vous êtes déjà membre de ce groupe');
        setLoading(false);
        return;
      }
  
      // Ajouter un membre à la sous-collection "members"
      const memberRef = doc(db, 'groups', groupDoc.id, 'members', user.uid);
      await setDoc(memberRef, {
        username: user.username || user.email.split('@')[0],
        role: 'member',
        joinedAt: new Date().toISOString()
      });

      toast.success('Groupe rejoins avec succès !');
  
      // Redirection vers le groupe
      navigate(`/group/${groupDoc.id}`);
    } catch (err) {
      console.error('Erreur lors de la tentative de rejoindre le groupe:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Rejoindre un groupe
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
            {error && (
              <div className="mb-4 p-4 text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20 rounded-lg">
                {error}
              </div>
            )}

            <div className="mb-6">
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Entrez le code du groupe que vous souhaitez rejoindre
              </p><br/>
              <label
                htmlFor="groupCode"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
              >
                Code du groupe
              </label>
              <input
                type="text"
                id="groupCode"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                maxLength={8}
                placeholder="Exemple : ABC123"
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900 focus:border-pink-500 dark:focus:border-pink-700 transition-shadow bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={loading || !canJoinGroups}
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Le code est composé de 8 caractères
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || groupCode.length !== 8 || !canJoinGroups}
                className={`flex-1 px-4 py-2 text-white rounded-lg 
                  ${loading || groupCode.length !== 8 || !canJoinGroups
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                  } transition-colors`}
              >
                {loading ? 'Chargement...' : 'Rejoindre'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default JoinGroupPage;