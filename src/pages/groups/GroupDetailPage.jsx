import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LeaderboardTable from '../../components/groups/LeaderboardTable';
import PredictionsList from '../../components/groups/PredictionsList';
import GroupStats from '../../components/groups/GroupStats';
import { db } from '../../config/firebase';
import { useAuthContext } from '../../contexts/AuthContext';
import UserPredictionSummary from '../../components/groups/UserPredictionSummary';
import QuizLeaderboard from '../../components/groups/QuizLeaderboard';
import QuizSection from '../../components/dashboard/QuizSection';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  orderBy,
  limit,
  addDoc, 
  onSnapshot,
  getDocs,
  serverTimestamp,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';



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

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    // Si c'est un timestamp Firestore
    if (timestamp && timestamp.toDate) {
      return timestamp.toDate().toLocaleTimeString();
    }
    // Si c'est déjà une date
    if (timestamp instanceof Date) {
      return timestamp.toLocaleTimeString();
    }
    // Si c'est un timestamp en string
    return new Date(timestamp).toLocaleTimeString();
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
                {formatTimestamp(message.timestamp)}
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
        <div key={member.userId} className="flex items-center justify-between border-b pb-2 last:border-b-0">
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
  const [currentTab, setCurrentTab] = useState('stats'); // Ajout du nouvel état
  const { user } = useAuthContext(); // Ajout de l'import AuthContext
  const [predictions, setPredictions] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // Initialiser à false par défaut
  const [userHasPredicted, setUserHasPredicted] = useState(false);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        // Récupérer le groupe
        const groupRef = doc(db, 'groups', groupId);
        const groupSnapshot = await getDoc(groupRef);
        console.log("Group Data:", groupSnapshot.data());
        
        if (groupSnapshot.exists()) {
          const groupData = groupSnapshot.data();
          setGroup({
            id: groupSnapshot.id,
            ...groupData,
          });
          setIsAdmin(groupData.admin === user.uid);
  
          // Récupérer les prédictions de l'utilisateur
          const predictionsRef = collection(db, 'predictions');
          const q = query(
            predictionsRef,
            where('groupId', '==', groupId),
            where('userId', '==', user.uid)
          );
          const predictionsSnapshot = await getDocs(q);
          
          if (!predictionsSnapshot.empty) {
            const prediction = predictionsSnapshot.docs[0].data();
            setUserHasPredicted(true);
            // Mettre à jour les prédictions avec la prédiction de l'utilisateur
            setPredictions([prediction]);
          } else {
            setUserHasPredicted(false);
            setPredictions([]);
          }

          const quizDoc = await getDoc(doc(db, 'quizResults', user.uid));
            setHasCompletedQuiz(quizDoc.exists());
          }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };
  
    if (groupId) {
      fetchGroupData();
    }
  }, [groupId, user]);

  useEffect(() => {
    if (!groupId) {
      console.log("No groupId");
      return;
    }
    
    console.log("Setting up chat listener for group:", groupId);
    
    const chatRef = collection(db, 'groups', groupId, 'chat');
    const q = query(chatRef, orderBy('timestamp', 'desc'), limit(50));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Chat snapshot received:", snapshot.size, "messages");
      const newMessages = [];
      snapshot.forEach((doc) => {
        console.log("Message data:", doc.data());
        newMessages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(newMessages.reverse());
    }, (error) => {
      console.error("Erreur détaillée lors de l'écoute des messages:", error);
      if (error.code) console.log('Error code:', error.code);
      if (error.message) console.log('Error message:', error.message);
    });
  
    return () => unsubscribe();
  }, [groupId]);

  const handleSendMessage = async (text) => {
    try {
      const messagesRef = collection(db, 'groups', groupId, 'chat');
      console.log("Sending message:", {
        userId: user.uid,
        username: user.displayName || user.email.split('@')[0],
        text,
        timestamp: serverTimestamp()
      });
      await addDoc(messagesRef, {
        userId: user.uid,
        username: user.displayName || user.email.split('@')[0],
        text,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Erreur détaillée:', error);
      // Log plus détaillé de l'erreur
      if (error.code) console.log('Error code:', error.code);
      if (error.message) console.log('Error message:', error.message);
    }
  };

  if (!group) {
    return <div>Chargement...</div>;
  }

  // Fonction pour renommer le groupe
  const handleRenameGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        name: newGroupName.trim()
      });

      // Mettre à jour le state local
      setGroup(prev => ({
        ...prev,
        name: newGroupName.trim()
      }));

      setShowRenameModal(false);
      toast.success('Nom du groupe modifié avec succès');
    } catch (error) {
      console.error('Erreur lors du renommage du groupe:', error);
      toast.error('Erreur lors de la modification du nom du groupe');
    }
  };

  // Fonction pour supprimer le groupe
  const handleDeleteGroup = async () => {
    try {
      await deleteDoc(doc(db, 'groups', groupId));
      toast.success('Groupe supprimé avec succès');
      navigate('/dashboard');  // Rediriger vers le dashboard
    } catch (error) {
      console.error('Erreur lors de la suppression du groupe:', error);
      toast.error('Erreur lors de la suppression du groupe');
    }
  };

  const renderContent = () => {
    switch(currentTab) {
      case 'stats':
        return (
          <>
            <LeaderboardTable 
              members={group.members}
              eventStarted={eventStarted}
            />
            <GroupStats 
              predictions={predictions}
              members={group.members}
            />
          </>
        );
      case 'predictions':
        return (
          <PredictionsList 
            groupId={groupId}
          />
        );
      case 'chat':
        return (
          <Chat 
            messages={messages} 
            onSendMessage={handleSendMessage}
          />
        );
        case 'quiz':
          return (
            <div>
              {hasCompletedQuiz ? (
                <QuizLeaderboard groupMembers={group.members} />
              ) : (
                <div>
                  <QuizSection user={user} />
                </div>
              )}
            </div>
          );
        default:
          return null;
      }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête du groupe simplifié */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="px-6 py-5">
            {/* Titre et description */}
            <h1 className="text-2xl font-bold text-gray-900">{group?.name}</h1>
            {group?.description && (
              <p className="mt-2 text-gray-500">{group.description}</p>
            )}

            {/* Infos supplémentaires */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Créé par :</span>{' '}
                {group?.adminUsername || 'Administrateur'}
              </div>
              <div>
                <span className="font-medium">Créé le :</span>{' '}
                {group?.createdAt ? new Date(group.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : ''}
              </div>
              <div>
                <span className="font-medium">Membres :</span>{' '}
                {group?.members?.length || 0} participant{group?.members?.length !== 1 ? 's' : ''}
              </div>
              <div>
                <span className="font-medium">Prédictions complètes :</span>{' '}
                {group?.members?.filter(m => m.hasSubmitted)?.length || 0} / {group?.members?.length || 0}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche */}
          <div className="lg:col-span-1 space-y-6">
            <MembersList members={group.members} />
            <ShareInviteCode code={group.inviteCode} />
            <GroupSettings 
              isAdmin={isAdmin}
              onRename={() => {
                setNewGroupName(group.name);
                setShowRenameModal(true);
              }}
              onDelete={() => setShowDeleteConfirm(true)}
            />

             {/* Modal de renommage */}
            <Dialog open={showRenameModal} onClose={() => setShowRenameModal(false)}>
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
                  <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                    Modifier le nom du groupe
                  </Dialog.Title>

                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Nouveau nom du groupe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  />

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowRenameModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleRenameGroup}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-md hover:from-pink-600 hover:to-purple-600"
                    >
                      Confirmer
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>

            {/* Modal de confirmation de suppression */}
            <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6">
                  <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                    Supprimer le groupe
                  </Dialog.Title>

                  <p className="text-gray-600 mb-6">
                    Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible.
                  </p>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleDeleteGroup}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Supprimer
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Dialog>
          </div>

          {/* Colonne droite - Pronostics, Classement et Chat */}
          <div className="lg:col-span-2 space-y-6">
            {/* Résumé des pronostics de l'utilisateur */}
            <div className="mb-6">
              <UserPredictionSummary 
                prediction={predictions.find(p => p.userId === user.uid)}
                groupId={groupId}
              />
            </div>

            {/* Navigation par onglets */}
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                {['stats', 'predictions', 'chat', 'quiz'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setCurrentTab(tab)}
                    className={`py-4 px-6 font-medium text-sm border-b-2 ${
                      currentTab === tab
                        ? 'border-pink-500 text-pink-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab === 'quiz' ? 'QCM Miss' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
              </div>
              
              <div className="p-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;