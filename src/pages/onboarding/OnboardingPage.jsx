import React, { useState } from 'react';

const CreateGroupModal = ({ isOpen, onClose, onSubmit }) => {
  const [groupName, setGroupName] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold mb-4">Créer un groupe</h3>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          onSubmit(groupName);
        }}>
          <div className="mb-4">
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
              Nom du groupe
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Ex: Les experts Miss France"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
              Créer le groupe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const JoinGroupModal = ({ isOpen, onClose, onSubmit }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (inviteCode.length < 6) {
      setError('Code d\'invitation invalide');
      return;
    }

    onSubmit(inviteCode);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold mb-4">Rejoindre un groupe</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-2">
              Code d'invitation
            </label>
            <input
              type="text"
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="Entrez le code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 uppercase"
              required
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
              Rejoindre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const OnboardingPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const username = "Alice"; // À récupérer depuis le contexte d'authentification

  const handleCreateGroup = (groupName) => {
    console.log('Création du groupe:', groupName);
    setShowCreateModal(false);
  };

  const handleJoinGroup = (inviteCode) => {
    console.log('Rejoindre le groupe avec le code:', inviteCode);
    setShowJoinModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Message de bienvenue */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue {username} ! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Prête à commencer l'aventure Miss France 2025 ?
          </p>
        </div>

        {/* Options principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Créer un groupe */}
          <div 
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center cursor-pointer"
            onClick={() => setShowCreateModal(true)}
          >
            <div className="bg-pink-100 rounded-full p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Créer un groupe</h2>
            <p className="text-gray-600">
              Créez votre propre groupe et invitez vos amis à vous rejoindre
            </p>
          </div>

          {/* Rejoindre un groupe */}
          <div 
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center cursor-pointer"
            onClick={() => setShowJoinModal(true)}
          >
            <div className="bg-purple-100 rounded-full p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Rejoindre un groupe</h2>
            <p className="text-gray-600">
              Utilisez un code d'invitation pour rejoindre un groupe existant
            </p>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-12 bg-pink-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-pink-700 mb-2">À savoir</h3>
          <ul className="list-disc list-inside space-y-2 text-pink-600">
            <li>Vous pouvez créer ou rejoindre plusieurs groupes</li>
            <li>Les pronostics ne seront visibles qu'à 21h15 le jour de l'élection</li>
            <li>Chaque groupe dispose de son propre chat pour discuter</li>
          </ul>
        </div>
      </div>

      {/* Modales */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateGroup}
      />
      
      <JoinGroupModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onSubmit={handleJoinGroup}
      />
    </div>
  );
};

export default OnboardingPage;