import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Dashboard = () => {
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userGroupsQuery = query(
            collection(db, 'groups'),
            where('memberIds', 'array-contains', user.uid)
          );
          
          const querySnapshot = await getDocs(userGroupsQuery);
          const groups = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setUserGroups(groups);
        } catch (error) {
          console.error('Erreur lors de la récupération des groupes:', error);
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleCreateGroup = () => {
    navigate('/create-group');
  };

  const handleJoinGroup = () => {
    navigate('/join-group');
  };

  if (!auth.currentUser) {
    return null;
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">
          Bienvenue, {auth.currentUser?.displayName || 'Utilisateur'}
        </h1>
        
        <div className="space-x-4">
          <button
            onClick={handleCreateGroup}
            className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600"
          >
            Créer un groupe
          </button>
          <button
            onClick={handleJoinGroup}
            className="bg-white text-gray-800 px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            Rejoindre un groupe
          </button>
        </div>
      </div>

      {userGroups.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 text-lg mb-4">Vous n'avez pas encore rejoint de groupe</p>
            <p className="text-gray-400">
              Créez un groupe ou rejoignez-en un pour commencer à pronostiquer !
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userGroups.map(group => (
            <Card key={group.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{group.name}</span>
                  <span className="text-sm text-gray-500">
                    {group.members ? group.members.length : 0} membres
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{group.description}</p>
                <button
                  onClick={() => navigate(`/group/${group.id}`)}
                  className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
                >
                  Voir le groupe
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;