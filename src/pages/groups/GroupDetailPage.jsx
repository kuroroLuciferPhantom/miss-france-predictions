import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LeaderboardTable from '../../components/groups/LeaderboardTable';
import PredictionsList from '../../components/groups/PredictionsList';
import GroupStats from '../../components/groups/GroupStats';
import { db } from '../../config/firebase';
import { useAuthContext } from '../../contexts/AuthContext';
import UserPredictionSummary from '../../components/groups/UserPredictionSummary';
import QuizLeaderboard from '../../components/groups/QuizLeaderboard';
import Chat from '../../components/groups/Chat';
import QuizSection from '../../components/dashboard/QuizSection';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
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
    <div className="bg-pink-50 dark:bg-pink-950/30 p-6 rounded-lg">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-pink-700 dark:text-pink-400">
          Code d'invitation
        </h3>
        <p className="text-sm text-pink-600 dark:text-pink-300">
          Partagez ce code avec vos amis pour qu'ils puissent rejoindre votre groupe
        </p>
      </div>
      <div className="flex items-center gap-3">
        <code className="flex-grow px-4 py-2 bg-white dark:bg-gray-800 rounded border border-pink-200 dark:border-pink-900 text-lg font-mono text-center dark:text-white">
          {code}
        </code>
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-pink-500 dark:bg-pink-600 text-white rounded hover:bg-pink-600 dark:hover:bg-pink-700 transition-colors"
        >
          {copied ? 'Copié !' : 'Copier'}
        </button>
      </div>
    </div>
  );
};

const MembersList = ({ members }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
      Participants ({members.length})
    </h2>
    <div className="space-y-3">
      {members.map((member) => (
        <div 
          key={member.userId} 
          className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2 last:border-b-0"
        >
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              member.isOnline ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
            }`} />
            <span className="font-medium text-gray-900 dark:text-white">
              {member.username}
            </span>
            {member.isAdmin && (
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                Admin
              </span>
            )}
          </div>
          <div>
            {member.hasSubmitted ? (
              <span className="text-green-500 dark:text-green-400 text-sm">
                Pronostic validé
              </span>
            ) : (
              <span className="text-gray-400 dark:text-gray-500 text-sm">
                En attente
              </span>
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Paramètres
      </h2>
      <div className="space-y-4">
        <button
          onClick={onRename}
          className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded flex items-center gap-2 transition-colors"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
            />
          </svg>
          Modifier le nom du groupe
        </button>
        
        <button
          onClick={onDelete}
          className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex items-center gap-2 transition-colors"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
            />
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
        const groupRef = doc(db, 'groups', groupId);
        const groupSnapshot = await getDoc(groupRef);
    
        if (groupSnapshot.exists()) {
          const groupData = groupSnapshot.data();
          const adminDoc = await getDoc(doc(db, 'users', groupData.admin));
          const adminData = adminDoc.data();
    
          // Récupérer les membres de la sous-collection 'members'
          const membersRef = collection(db, 'groups', groupId, 'members');
          const membersSnapshot = await getDocs(membersRef);
          const memberPromises = membersSnapshot.docs.map(async (doc) => {
            const memberData = doc.data();
            const predictionsQuery = query(
              collection(db, 'predictions'),
              where('userId', '==', doc.id)
            );

            const predictionsSnapshot = await getDocs(predictionsQuery);
            const prediction = predictionsSnapshot.docs[0]?.data();

            return {
              userId: doc.id,
              ...memberData,
              hasSubmitted: prediction?.isComplete || false,
              prediction: prediction || null,
              predictionVisibility: prediction?.isPublic ? 'public' : 'private'
            };
          });

          const updatedMembers = await Promise.all(memberPromises);

          // Une prédiction est valide pour les stats si elle est complète
          const completedPredictions = updatedMembers.filter(m => m.prediction?.isComplete).length;
          const participationRate = (completedPredictions / updatedMembers.length) * 100;

          // Pour l'affichage, on garde toutes les prédictions
          const allPredictions = updatedMembers
            .filter(m => m.prediction)
            .map(m => ({
              ...m.prediction,
              username: m.username,
              visibility: m.predictionVisibility
            }));

          // Une prédiction est valide pour les tendances/favorites si elle est publique ou si l'émission a commencé
          const validPredictionsForStats = allPredictions.filter(p => 
            p.isComplete && (p.isPublic || eventStarted)
          );

          setGroup({
            id: groupSnapshot.id,
            ...groupData,
            members: updatedMembers,
            adminUsername: adminData?.username,
            stats: {
              completedPredictions,
              participationRate: participationRate || 0,
              eventStarted,
              validPredictions: validPredictionsForStats
            }
          });

          setPredictions(allPredictions);
          setUserHasPredicted(allPredictions.some(p => p.userId === user.uid));
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
    if (!groupId || !user?.uid) {
      console.log("No groupId or user not authenticated");
      return;
    }
  
    const groupRef = doc(db, "groups", groupId);
  
    // Vérifier si l'utilisateur est membre du groupe avant de récupérer les messages
    getDoc(groupRef).then(async (groupSnap) => {
      if (!groupSnap.exists()) {
        console.log("Group does not exist");
        return;
      }

      const groupData = groupSnap.data();
      
      // Récupérer la sous-collection "members" pour vérifier si l'utilisateur en fait partie
      const membersRef = collection(db, "groups", groupId, "members");
      const memberSnap = await getDocs(membersRef);

      // Vérifier si l'utilisateur est dans la liste des membres
      const isMember = memberSnap.docs.some((doc) => doc.id === user.uid);

      if (groupData.admin !== user.uid && !isMember) {
        console.log("User is not a member of this group");
        return;
      }

      // Si l'utilisateur est membre, on récupère les messages
      const chatRef = collection(db, "groups", groupId, "chat");
      const q = query(chatRef, orderBy("timestamp", "desc"), limit(50));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const newMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(newMessages.reverse());
        },
        (error) => {
          console.error("Erreur détaillée lors de l'écoute des messages:", error);
          if (error.code) console.log("Error code:", error.code);
          if (error.message) console.log("Error message:", error.message);
        }
      );

    return () => unsubscribe();
});


  }, [groupId, user?.uid]);
  
  const handleSendMessage = async (text) => {
    if (!groupId || !user?.uid) {
      console.log("No groupId or user not authenticated");
      return;
    }
  
    try {
      const groupRef = doc(db, "groups", groupId);
      const groupSnap = await getDoc(groupRef);
  
      if (!groupSnap.exists()) {
        console.log("Group does not exist");
        return;
      }
  
      const groupData = groupSnap.data();
  
      // Vérifier si l'utilisateur est membre en vérifiant la sous-collection members
      const memberRef = doc(db, "groups", groupId, "members", user.uid);
      const memberSnap = await getDoc(memberRef);
  
      if (groupData.admin !== user.uid && !memberSnap.exists()) {
        console.log("User is not a member of this group");
        return;
      }
  
      const messagesRef = collection(db, "groups", groupId, "chat");
      await addDoc(messagesRef, {
        userId: user.uid,
        username: user.displayName || user.email.split("@")[0],
        text,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erreur détaillée:", error);
      if (error.code) console.log("Error code:", error.code);
      if (error.message) console.log("Error message:", error.message);
    }
  };
  

  if (!group) {
    return (
      <div className="flex justify-center items-center min-h-screen dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 dark:border-pink-400 border-t-transparent"></div>
      </div>
    );
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
              group={group}
              eventStarted={group.stats.eventStarted}
            />
          </>
        );
        case 'predictions':
          console.log("Rendering predictions tab with:", {
            predictions: predictions,
            eventStarted: group.stats.eventStarted,
            totalPredictions: predictions?.length
          });
          return (
            <PredictionsList 
              predictions={predictions}
              eventStarted={group.stats.eventStarted}
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête du groupe simplifié */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-8">
          <div className="px-6 py-5">
            {/* Titre et description */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{group?.name}</h1>
            {group?.description && (
              <p className="mt-2 text-gray-500 dark:text-gray-400">{group.description}</p>
            )}
  
            {/* Infos supplémentaires */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div>
                <span className="font-medium dark:text-gray-300">Créé par :</span>{' '}
                {group?.adminUsername || 'Administrateur'}
              </div>
              <div>
                <span className="font-medium dark:text-gray-300">Créé le :</span>{' '}
                {group?.createdAt ? new Date(group.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                }) : ''}
              </div>
              <div>
                <span className="font-medium dark:text-gray-300">Membres :</span>{' '}
                {group?.members?.length || 0} participant{group?.members?.length !== 1 ? 's' : ''}
              </div>
              <div>
                <span className="font-medium dark:text-gray-300">Prédictions complètes :</span>{' '}
                {group?.members?.filter(m => m.hasSubmitted)?.length || 0} / {group?.members?.length || 0}
              </div>
            </div>
          </div>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Les composants de colonnes sont déjà adaptés au mode sombre séparément */}
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
              <div className="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="mx-auto max-w-lg w-full rounded-lg bg-white dark:bg-gray-800 p-8">
                  <DialogTitle className="text-xl font-medium text-gray-900 dark:text-white mb-6">
                    Modifier le nom du groupe
                  </DialogTitle>
  
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Nouveau nom du groupe"
                    className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-pink-500 dark:focus:border-pink-400 dark:placeholder-gray-400"
                  />
  
                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      onClick={() => setShowRenameModal(false)} 
                      className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleRenameGroup}
                      className="px-6 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-600 dark:hover:from-pink-700 dark:hover:to-purple-700"
                    >
                      Confirmer
                    </button>
                  </div>
                </DialogPanel>
              </div>
            </Dialog>
  
            {/* Modal de confirmation de suppression */}
            <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
              <div className="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" />
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="mx-auto max-w-sm rounded-lg bg-white dark:bg-gray-800 p-6">
                  <DialogTitle className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Supprimer le groupe
                  </DialogTitle>
  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible.
                  </p>
  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleDeleteGroup}
                      className="px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-md hover:bg-red-600 dark:hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </DialogPanel>
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex -mb-px">
                  {['stats', 'predictions', 'chat', 'quiz'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setCurrentTab(tab)}
                      className={`py-4 px-6 font-medium text-sm border-b-2 ${
                        currentTab === tab
                          ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
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