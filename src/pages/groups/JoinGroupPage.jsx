import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { useAuthContext } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

const JoinGroupPage = () => {
  const [groupCode, setGroupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    document.title = "Rejoindre un groupe - Miss France Predictions";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
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
      if (groupData.memberIds?.includes(user.uid)) {
        setError('Vous êtes déjà membre de ce groupe');
        setLoading(false);
        return;
      }

      // Ajouter l'utilisateur au groupe
      await updateDoc(doc(db, 'groups', groupDoc.id), {
        members: [...(groupData.members || []), {
          userId: user.uid,
          username: user.username || user.email.split('@')[0],
          role: 'member',
          joinedAt: new Date().toISOString()
        }]
      });

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Rejoindre un groupe
            </h1>
            <p className="mt-2 text-gray-600">
              Entrez le code du groupe que vous souhaitez rejoindre
            </p>
          </div>
        </header>

        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="bg-white shadow rounded-xl p-6">
            {error && (
              <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label 
                htmlFor="groupCode" 
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-200 focus:border-pink-500 transition-shadow"
                disabled={loading}
              />
              <p className="mt-2 text-sm text-gray-500">
                Le code est composé de 8 caractères
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || groupCode.length !== 8}
                className={`flex-1 px-4 py-2 text-white rounded-lg 
                  ${loading || groupCode.length !== 8
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
                  } transition-colors`}
              >
                {loading ? 'Chargement...' : 'Rejoindre'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupPage;