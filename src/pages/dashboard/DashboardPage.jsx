import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const DashboardPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupsQuery = query(
          collection(db, 'groups'),
          where('memberIds', 'array-contains', user.uid)
        );
        
        const querySnapshot = await getDocs(groupsQuery);
        const groupsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchGroups();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">
          Bienvenue {user?.username || 'Utilisateur'}
        </h1>
        
        <div className="space-x-4">
          <button
            onClick={() => navigate('/group/create')}
            className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600"
          >
            Créer un groupe
          </button>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-lg text-gray-600 mb-4">
            Vous n'avez pas encore de groupe
          </p>
          <p className="text-gray-500">
            Créez votre premier groupe pour commencer à pronostiquer !
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <div
              key={group.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{group.name}</h2>
                <span className="text-sm text-gray-500">
                  {group.members?.length || 0} membres
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">
                {group.description || 'Aucune description'}
              </p>
              
              <button
                onClick={() => navigate(`/group/${group.id}`)}
                className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
              >
                Voir le groupe
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;