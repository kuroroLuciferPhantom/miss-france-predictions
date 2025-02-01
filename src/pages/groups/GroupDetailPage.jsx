import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LeaderboardTable from '../../components/groups/LeaderboardTable';
import PredictionsList from '../../components/groups/PredictionsList';
import GroupStats from '../../components/groups/GroupStats';

const ShareInviteCode = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-pink-50 p-6 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-pink-700">Code d'invitation</h3>
        <p className="text-sm text-pink-600">Partagez ce code avec vos amis pour qu'ils puissent rejoindre votre groupe</p>
      </div>
      <div className="flex items-center gap-3">
        <code className="flex-grow px-4 py-2 bg-white rounded border border-pink-200 text-lg font-mono text-center">
          {code}
        </code>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
        >
          {copied ? 'Copié !' : 'Copier'}
        </button>
      </div>
    </div>
  );
};

const Chat = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col h-[600px]">
      <h2 className="text-xl font-semibold mb-4">Chat du groupe</h2>
      
      <div className="flex-grow overflow-y-auto space-y-4 mb-4">
        {messages.map((message) => (
          <div key={message.id} className="flex flex-col">
            <div className="flex items-baseline space-x-2">
              <span className="font-medium">{message.username}</span>
              <span className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="mt-1">{message.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-auto">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Votre message..."
          className="flex-grow px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
};

const MembersList = ({ members }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-xl font-semibold mb-4">Participants ({members.length})</h2>
    <div className="space-y-3">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
            <span className="font-medium">{member.username}</span>
            {member.isAdmin && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                Admin
              </span>
            )}
          </div>
          <div>
            {member.hasSubmitted ? (
              <span className="text-green-500 text-sm">Pronostic validé</span>
            ) : (
              <span className="text-gray-400 text-sm">En attente</span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const GroupSettings = ({ onRename, onDelete, isAdmin }) => {
  if (!isAdmin) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Paramètres</h2>
      <div className="space-y-4">
        <button
          onClick={onRename}
          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Modifier le nom du groupe
        </button>
        
        <button
          onClick={onDelete}
          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Supprimer le groupe
        </button>
      </div>
    </div>
  );
};

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [eventStarted, setEventStarted] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const isAdmin = true; // À gérer avec les droits utilisateur
  const [userHasPredicted, setUserHasPredicted] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données du groupe
    setGroup({
      name: "Les experts Miss France",
      inviteCode: "MISSFR2025",
      members: [...]
    });

    setMessages([...]);

    // TODO: Récupérer l'état de l'événement depuis Firebase
    setEventStarted(false);

    // Simuler les données de pronostics
    setPredictions([...]);
  }, [groupId]);

  const handleSendMessage = (text) => {
    const newMessage = {
      id: Date.now().toString(),
      username: "Vous",
      text,
      timestamp: new Date().toISOString()
    };
    setMessages([...messages, newMessage]);
  };

  if (!group) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header avec bouton retour */}
        <div className="mb-8">
          <Link 
            to="/dashboard"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour au dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche */}
          <div className="lg:col-span-1 space-y-6">
            <MembersList members={group.members} />
            <ShareInviteCode code={group.inviteCode} />
            <GroupSettings 
              isAdmin={isAdmin}
              onRename={() => console.log('Renommer le groupe')}
              onDelete={() => console.log('Supprimer le groupe')}
            />
          </div>

          {/* Colonne droite - Pronostics, Classement et Chat */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section Pronostics avec le bouton */}
            <div className="flex justify-end">
              <button
                onClick={() => console.log('Ouvrir le formulaire de pronostics')}
                disabled={eventStarted}
                className={`px-6 py-3 font-semibold rounded-lg shadow-sm transition-colors
                  ${eventStarted 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                  }`}
              >
                {eventStarted 
                  ? 'Pronostics verrouillés' 
                  : userHasPredicted 
                    ? 'Modifier mon pronostic' 
                    : 'Faire mon pronostic'
                }
              </button>
            </div>

            {/* Statistiques du groupe */}
            <GroupStats 
              predictions={predictions}
              members={group.members}
            />

            {/* Tableau de classement */}
            <LeaderboardTable 
              members={group.members}
              eventStarted={eventStarted}
            />

            {/* Liste des pronostics */}
            <PredictionsList 
              predictions={predictions}
              eventStarted={eventStarted}
            />

            {/* Chat existant */}
            <Chat messages={messages} onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;