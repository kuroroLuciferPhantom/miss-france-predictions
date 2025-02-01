import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LeaderboardTable from '../../components/groups/LeaderboardTable';

// Composants existants...
// ShareInviteCode, Chat, MembersList, GroupSettings...

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const isAdmin = true; // À gérer avec les droits utilisateur
  const [userHasPredicted, setUserHasPredicted] = useState(false);
  const [eventStarted, setEventStarted] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données du groupe
    setGroup({
      name: "Les experts Miss France",
      inviteCode: "MISSFR2025",
      members: [
        { 
          id: '1', 
          username: "Alice", 
          isAdmin: true, 
          isOnline: true, 
          hasSubmitted: true,
          points: 150,
          trend: 'up'
        },
        { 
          id: '2', 
          username: "Bob", 
          isAdmin: false, 
          isOnline: false, 
          hasSubmitted: false,
          points: 120,
          trend: 'down'
        },
        { 
          id: '3', 
          username: "Charlie", 
          isAdmin: false, 
          isOnline: true, 
          hasSubmitted: true,
          points: 135,
          trend: null
        }
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

    // TODO: Récupérer l'état de l'événement depuis Firebase
    setEventStarted(false);
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

            {/* Tableau de classement */}
            <LeaderboardTable 
              members={group.members}
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