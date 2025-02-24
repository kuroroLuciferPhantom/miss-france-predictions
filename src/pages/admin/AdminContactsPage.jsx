import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, MailOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminContactsPage = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // Vérification des droits admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const userDoc = await doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDoc);
        
        if (!userSnap.exists() || !userSnap.data().isAdmin) {
          navigate('/');
          toast.error("Accès non autorisé");
        }
      } catch (error) {
        console.error("Erreur vérification admin:", error);
        navigate('/');
      }
    };

    checkAdminStatus();
  }, [user, navigate]);

  // Récupération des messages
  useEffect(() => {
    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setMessages(newMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Marquer comme lu/non lu
  const toggleRead = async (messageId, currentState) => {
    try {
      await updateDoc(doc(db, 'contacts', messageId), {
        read: !currentState
      });
      toast.success(currentState ? 'Marqué comme non lu' : 'Marqué comme lu');
    } catch (error) {
      console.error("Erreur mise à jour statut:", error);
      toast.error("Erreur lors de la mise à jour");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Messages de contact
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {messages.filter(m => !m.read).length} non lu(s)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des messages */}
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 cursor-pointer 
                       transition-all duration-200 hover:shadow-md
                       ${!message.read ? 'border-l-4 border-pink-500' : ''}
                       ${selectedMessage?.id === message.id ? 'ring-2 ring-pink-500' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {message.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {message.email}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleRead(message.id, message.read);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {message.read ? <MailOpen size={18} /> : <Mail size={18} />}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {message.message}
              </p>
              <p className="mt-2 text-xs text-gray-400">
                {message.createdAt?.toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">
                Aucun message reçu pour le moment
              </p>
            </div>
          )}
        </div>

        {/* Détail du message sélectionné */}
        <div className="lg:sticky lg:top-8 h-fit">
          {selectedMessage ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedMessage.name}
                  </h2>
                  <a 
                    href={`mailto:${selectedMessage.email}`}
                    className="text-pink-500 hover:text-pink-600 dark:hover:text-pink-400"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                <button
                  onClick={() => toggleRead(selectedMessage.id, selectedMessage.read)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {selectedMessage.read ? <MailOpen size={20} /> : <Mail size={20} />}
                </button>
              </div>

              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedMessage.message}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reçu le {selectedMessage.createdAt?.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Sélectionnez un message pour voir les détails
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContactsPage;