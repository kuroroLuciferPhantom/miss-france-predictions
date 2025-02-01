import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Générer un code d'invitation unique
      const inviteCode = generateInviteCode();

      // Créer le document du groupe
      const groupRef = doc(db, 'groups', inviteCode);
      await setDoc(groupRef, {
        name: groupData.name,
        description: groupData.description,
        inviteCode,
        admin: user.uid,
        createdAt: new Date().toISOString(),
        members: [{
          userId: user.uid,
          username: user.username || user.email.split('@')[0],
          role: 'admin',
          joinedAt: new Date().toISOString()
        }]
      });

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-600 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Créer un groupe
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-4 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
            {/* En-tête du formulaire */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Informations du groupe</h2>
              <p className="mt-1 text-sm text-gray-600">
                Renseignez les informations de votre groupe pour commencer
              </p>
            </div>

            {/* Corps du formulaire */}
            <div className="px-6 py-4 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
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
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Une brève description pour présenter votre groupe aux autres participants
                </p>
              </div>

              {/* Informations supplémentaires */}
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-medium text-gray-900">Une fois le groupe créé :</h3>
                <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
                  <li>Vous deviendrez automatiquement administrateur du groupe</li>
                  <li>Un code d'invitation unique sera généré</li>
                  <li>Vous pourrez l'envoyer à vos amis pour qu'ils rejoignent le groupe</li>
                </ul>
              </div>
            </div>

            {/* Pied du formulaire */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading || !groupData.name.trim()}
                className={`px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 ${
                  (isLoading || !groupData.name.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Création...' : 'Créer le groupe'}
              </button>
            </div>
          </form>

          {/* Information sur le système de points */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Comment fonctionne le système de points ?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-pink-50 rounded">
                <div className="text-2xl font-bold text-pink-500">10 pts</div>
                <p className="text-sm text-gray-600 mt-1">Pour avoir deviné Miss France</p>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded">
                <div className="text-2xl font-bold text-pink-500">3+2 pts</div>
                <p className="text-sm text-gray-600 mt-1">Pour chaque Miss dans le top 5 (+2 si bien placée)</p>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded">
                <div className="text-2xl font-bold text-pink-500">2 pts</div>
                <p className="text-sm text-gray-600 mt-1">Pour chaque Miss qualifiée identifiée</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateGroupPage;