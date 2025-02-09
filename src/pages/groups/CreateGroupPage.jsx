import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';
import PointsSystem from '../../components/PointsSystem';
import toast from 'react-hot-toast';


const generateInviteCode = async () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  // Générer le code
  const code = Array.from(
    { length: 8 }, 
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('');

  // Vérifier s'il existe déjà
  const groupQuery = query(
    collection(db, 'groups'),
    where('inviteCode', '==', code)
  );
  const existingGroups = await getDocs(groupQuery);

  if (!existingGroups.empty) {
    throw new Error('Un groupe avec ce code existe déjà. Veuillez réessayer.');
  }

  return code;
};

const CreateGroupPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [groupData, setGroupData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    const checkGroupLimit = async () => {
      try {
        const membershipQuery = query(
          collection(db, 'groups'),
          where(`members.${user.uid}`, '!=', null)
        );
        const querySnapshot = await getDocs(membershipQuery);
        if (querySnapshot.size >= 15) {
          setError('Vous avez atteint la limite de 15 groupes. Veuillez quitter un groupe avant d\'en créer un nouveau.');
        }
      } catch (err) {
        console.error('Erreur lors de la vérification des groupes:', err);
        setError('Une erreur est survenue lors de la vérification de vos groupes.');
      }
    };

    checkGroupLimit();
  }, [user.uid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      // Vérifier le nombre de groupes
      const membershipQuery = query(
        collection(db, 'groups'),
        where(`members.${user.uid}`, '!=', null)
      );
      const userGroups = await getDocs(membershipQuery);
  
      if (userGroups.size >= 15) {
        setError('Vous avez atteint la limite de 15 groupes. Veuillez quitter un groupe avant d\'en créer un nouveau.');
        setIsLoading(false);
        return;
      }
  
      // Générer un code d'invitation unique
      const inviteCode = await generateInviteCode();
  
      // Créer le document du groupe
      const groupRef = doc(db, 'groups', inviteCode);
      await setDoc(groupRef, {
        name: groupData.name,
        description: groupData.description,
        inviteCode,
        admin: user.uid,
        createdAt: new Date().toISOString()
      });
  
      // Créer la sous-collection "members" pour le groupe
      const memberRef = doc(db, 'groups', inviteCode, 'members', user.uid);
      await setDoc(memberRef, {
        username: user.username || user.email.split('@')[0],
        role: 'admin',
        joinedAt: new Date().toISOString()
      });

      toast.success('Groupe créé avec succès !');
  
      // Rediriger vers la page du groupe
      navigate(`/group/${inviteCode}`);
    } catch (err) {
      console.error('Error creating group:', err);
      setError('Une erreur est survenue lors de la création du groupe. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
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
              Créer un groupe
            </h1>
          </div>
        </div>
      </header>
  
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded">
              {error}
              {error.includes('limite de 15 groupes') && (
                <div className="mt-2">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-medium"
                  >
                    Retourner au tableau de bord
                  </button>
                </div>
              )}
            </div>
          )}
  
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-lg">
            {/* En-tête du formulaire */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Informations du groupe</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Renseignez les informations de votre groupe pour commencer
              </p>
            </div>
  
            {/* Corps du formulaire */}
            <div className="px-6 py-4 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nom du groupe
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={groupData.name}
                    onChange={(e) => setGroupData({ ...groupData, name: e.target.value })}
                    placeholder="Ex: Les experts Miss France"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-pink-500 dark:focus:border-pink-400 dark:placeholder-gray-400"
                  />
                </div>
              </div>
  
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description du groupe
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={groupData.description}
                    onChange={(e) => setGroupData({ ...groupData, description: e.target.value })}
                    placeholder="Décrivez votre groupe en quelques mots..."
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-pink-500 dark:focus:border-pink-400 dark:placeholder-gray-400"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Une brève description pour présenter votre groupe aux autres participants
                </p>
              </div>
  
              {/* Informations supplémentaires */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                <h3 className="font-medium text-gray-900 dark:text-white">Une fois le groupe créé :</h3>
                <ul className="mt-2 text-sm text-gray-600 dark:text-gray-300 list-disc pl-5 space-y-1">
                  <li>Vous deviendrez automatiquement administrateur du groupe</li>
                  <li>Un code d'invitation unique sera généré</li>
                  <li>Vous pourrez l'envoyer à vos amis pour qu'ils rejoignent le groupe</li>
                </ul>
              </div>
            </div>
  
            {/* Pied du formulaire */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-lg flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading || !groupData.name.trim()}
                className={`px-4 py-2 bg-pink-500 dark:bg-pink-600 text-white rounded hover:bg-pink-600 dark:hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-pink-400 ${
                  (isLoading || !groupData.name.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Création...' : 'Créer le groupe'}
              </button>
            </div>
          </form>
  
          {/* Information sur le système de points */}
          <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <PointsSystem />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateGroupPage;