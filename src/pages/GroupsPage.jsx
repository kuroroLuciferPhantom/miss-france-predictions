import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GroupCard = ({ group, onJoin }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xl font-semibold">{group.name}</h3>
        <p className="text-gray-600 mt-1">{group.memberCount} participants</p>
      </div>
      <button 
        onClick={() => onJoin(group.id)}
        className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
      >
        Accéder
      </button>
    </div>
  </div>
);

const CreateGroupModal = ({ isOpen, onClose, onCreate }) => {
  const [groupName, setGroupName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(groupName);
    setGroupName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Créer un nouveau groupe</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="groupName" className="block text-gray-700 mb-2">
              Nom du groupe
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Ex: Les experts Miss France"
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

const JoinGroupModal = ({ isOpen, onClose, onJoin }) => {
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onJoin(inviteCode);
    setInviteCode('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Rejoindre un groupe</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="inviteCode" className="block text-gray-700 mb-2">
              Code d'invitation
            </label>
            <input
              type="text"
              id="inviteCode"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Entrez le code d'invitation"
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
              Rejoindre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const GroupsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const navigate = useNavigate();

  const handleCreateGroup = async (name) => {
    // TODO: Implémenter la création de groupe avec Firebase
    console.log('Creating group:', name);
  };

  const handleJoinGroup = async (code) => {
    // TODO: Implémenter la rejoindre un groupe avec Firebase
    console.log('Joining group with code:', code);
  };

  const handleJoinExistingGroup = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mes Groupes</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowJoinModal(true)}
            className="px-4 py-2 border border-pink-500 text-pink-500 rounded hover:bg-pink-50 transition-colors"
          >
            Rejoindre un groupe
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
          >
            Créer un groupe
          </button>
        </div>
      </div>

      {/* Liste des groupes */}
      <div className="space-y-4">
        {/* Exemple de groupe, à remplacer par les données Firebase */}
        <GroupCard
          group={{
            id: '1',
            name: "Les experts Miss France",
            memberCount: 5
          }}
          onJoin={handleJoinExistingGroup}
        />
      </div>

      {/* Modals */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateGroup}
      />
      <JoinGroupModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={handleJoinGroup}
      />
    </div>
  );
};

export default GroupsPage;