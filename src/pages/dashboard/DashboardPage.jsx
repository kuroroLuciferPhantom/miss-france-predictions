import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const DashboardPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
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

  const filteredGroups = groups
    .filter(group => {
      if (searchTerm) {
        return group.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return true;
    })
    .filter(group => {
      switch (filter) {
        case 'owned':
          return group.ownerId === user.uid;
        case 'member':
          return group.ownerId !== user.uid;
        default:
          return true;
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">
          Bienvenue {user?.username || 'Utilisateur'}
        </h1>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Vos groupes</h3>
          <p className="text-2xl font-bold">{groups.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Pronostics réalisés</h3>
          <p className="text-2xl font-bold">0/15</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm mb-2">Meilleur score</h3>
          <p className="text-2xl font-bold">-</p>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button 
          onClick={() => navigate('/group/create')}
          className="flex items-center gap-2 px-6 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
        >
          <span>+</span> Créer un groupe
        </button>
        <button 
          onClick={() => navigate('/join-group')}
          className="flex items-center gap-2 px-6 py-2 bg-white rounded-md shadow hover:bg-gray-50"
        >
          <span>👥</span> Rejoindre un groupe
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Rechercher un groupe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md flex-1"
        />
        <select 
          className="px-4 py-2 border rounded-md"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tous les groupes</option>
          <option value="owned">Groupes que je gère</option>
          <option value="member">Groupes rejoints</option>
        </select>
      </div>

      {/* Liste des groupes */}
      {filteredGroups.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          {searchTerm || filter !== 'all' ? (
            <p className="text-lg text-gray-600 mb-4">
              Aucun groupe ne correspond à votre recherche
            </p>
          ) : (
            <>
              <p className="text-lg text-gray-600 mb-4">
                Vous n'avez pas encore de groupe
              </p>
              <p className="text-gray-500">
                Créez votre premier groupe ou rejoignez-en un pour commencer à pronostiquer !
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map(group => (
            <div
              key={group.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{group.name}</h2>
                    <p className="text-sm text-gray-500">
                      {group.members?.length || 0} membres
                    </p>
                  </div>
                  {group.ownerId === user.uid && (
                    <span className="px-2 py-1 bg-pink-100 text-pink-600 text-xs rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">
                  {group.description || 'Aucune description'}
                </p>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-4">
                    <span>Pronostics</span>
                    <span>0/15 complétés</span>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate(`/group/${group.id}`)}
                  className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
                >
                  Voir le groupe
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activité récente */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Activité récente</h2>
        <div className="bg-white rounded-lg shadow divide-y">
          <div className="p-4">
            <p className="text-gray-600">Pas encore d'activité</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;