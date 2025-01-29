import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PlayersList = ({ players }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-xl font-semibold mb-4">Participants ({players.length})</h2>
    <div className="space-y-3">
      {players.map((player) => (
        <div 
          key={player.id} 
          className="flex items-center justify-between border-b pb-2 last:border-b-0"
        >
          <div className="flex items-center">
            <span className="font-medium">{player.username}</span>
            {player.isAdmin && (
              <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                Admin
              </span>
            )}
          </div>
          <div className="flex items-center">
            {player.hasSubmitted ? (
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
      
      {/* Messages */}
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

      {/* Input */}
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

const InviteSection = ({ inviteCode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Inviter des participants</h2>
      <div className="flex items-center space-x-2">
        <div className="flex-grow px-3 py-2 bg-gray-50 rounded font-mono">
          {inviteCode}
        </div>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors"
        >
          {copied ? 'Copié !' : 'Copier'}
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Partagez ce code avec vos amis pour qu'ils puissent rejoindre le groupe.
      </p>
    </div>
  );
};

const Leaderboard = ({ scores, isVisible }) => {
  if (!isVisible) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <h2 className="text-xl font-semibold mb-4">Classement</h2>
        <p className="text-gray-600">
          Le classement sera révélé à 21h15 le jour de l'élection
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Classement</h2>
      <div className="space-y-3">
        {scores.map((score, index) => (
          <div 
            key={score.userId} 
            className="flex items-center justify-between border-b pb-2 last:border-b-0"
          >
            <div className="flex items-center">
              <span className={`w-8 font-bold ${index < 3 ? 'text-pink-500' : ''}`}>
                {index + 1}.
              </span>
              <span className="font-medium">{score.username}</span>
            </div>
            <span className="font-bold text-lg">
              {score.points} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const isResultsTime = false; // À gérer avec la vraie date

  useEffect(() => {
    // TODO: Charger les données du groupe depuis Firebase
    // Pour l'instant, on utilise des données de test
    setGroup({
      name: "Les experts Miss France",
      inviteCode: "MISSFR2025",
      players: [
        { id: '1', username: "Alice", isAdmin: true, hasSubmitted: true },
        { id: '2', username: "Bob", isAdmin: false, hasSubmitted: false },
        { id: '3', username: "Charlie", isAdmin: false, hasSubmitted: true },
      ],
      scores: [
        { userId: '1', username: "Alice", points: 25 },
        { userId: '2', username: "Bob", points: 18 },
        { userId: '3', username: "Charlie", points: 15 },
      ]
    });

    setMessages([
      {
        id: '1',
        username: "Alice",
        text: "Qui a déjà fait ses pronostics ?",
        timestamp: new Date().toISOString()
      }
    ]);
  }, [groupId]);

  const handleSendMessage = (text) => {
    // TODO: Envoyer le message à Firebase
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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{group.name}</h1>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Colonne de gauche : Participants et Classement */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <PlayersList players={group.players} />
          <Leaderboard scores={group.scores} isVisible={isResultsTime} />
          <InviteSection inviteCode={group.inviteCode} />
        </div>

        {/* Colonne de droite : Chat */}
        <div className="col-span-12 lg:col-span-8">
          <Chat messages={messages} onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;