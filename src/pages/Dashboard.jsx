import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Dashboard = () => {
  console.log('Dashboard mounting...');
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Dashboard useEffect running');
    console.log('Current user:', auth.currentUser);
    
    const fetchGroups = async () => {
      if (!auth.currentUser) {
        console.log('No user found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        console.log('Fetching groups for user:', auth.currentUser.uid);
        const userGroupsQuery = query(
          collection(db, 'groups'),
          where('memberIds', 'array-contains', auth.currentUser.uid)
        );
        
        const querySnapshot = await getDocs(userGroupsQuery);
        console.log('Groups fetched:', querySnapshot.size);
        const groups = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log('Processed groups:', groups);
        
        setUserGroups(groups);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
    console.log('fetchGroups called');
  }, [navigate]);

  console.log('Dashboard rendering with state:', { userGroups, loading });

  if (!auth.currentUser) {
    console.log('No user in render, returning null');
    return null;
  }

  if (loading) {
    console.log('Still loading, showing loading state');
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
            onClick={() => navigate('/create-group')}
            className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600"
          >
            Créer un groupe
          </button>
          <button
            onClick={() => navigate('/join-group')}
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