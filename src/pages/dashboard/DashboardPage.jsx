import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import MyPredictions from '../../components/dashboard/MyPredictions';

const StatCard = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow">
    <h3 className="text-gray-500 font-medium text-sm tracking-wide uppercase">{title}</h3>
    <p className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mt-2">
      {value}
    </p>
  </div>
);

const DashboardPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    document.title = "Dashboard - Miss France Predictions";
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Récupérer les groupes de l'utilisateur
        const groupsSnapshot = await getDocs(collection(db, 'groups'));
        const userGroups = groupsSnapshot.docs
          .filter(doc => doc.data().members.some(member => member.userId === user.uid));

        // Pour chaque groupe, récupérer les prédictions
        // Dans fetchGroups, modifier la partie qui récupère les prédictions
        const groupsWithDetails = await Promise.all(userGroups.map(async (groupDoc) => {
        const groupData = groupDoc.data();

        // Ne récupérer que les prédictions de l'utilisateur
        const predictionsQuery = query(
          collection(db, 'predictions'),
          where('groupId', '==', groupDoc.id),
          where('userId', '==', user.uid)  // Ajout de cette condition
        );
        const predictionsSnapshot = await getDocs(predictionsQuery);
        const userPrediction = predictionsSnapshot.empty ? null : predictionsSnapshot.docs[0].data();

        // Calculer les statistiques uniquement sur la prédiction de l'utilisateur
        const total = userPrediction ? 
          (userPrediction.top3?.length || 0) + 
          (userPrediction.top5?.length || 0) + 
          (userPrediction.qualified?.length || 0) : 0;

        return {
          id: groupDoc.id,
          ...groupData,
          userPrediction,
          predictionProgress: Math.round((total / 15) * 100),
          predictionStats: {
            totalPredictions: 0,  // nombre de membres ayant fait des prédictions
            completedPredictions: 0,  // nombre de prédictions complètes
          }
        };
      }));

        setGroups(groupsWithDetails);
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
          return group.admin === user.uid;
        case 'member':
          return group.admin !== user.uid;
        default:
          return true;
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Bonjour {user?.displayName || user?.username || user?.email?.split('@')[0]}
            </p>
          </div>

          <div className="flex mt-4 md:mt-0 space-x-3">
            <button
              onClick={() => navigate('/group/join')}
              className="inline-flex items-center px-4 py-2 border border-pink-200 shadow-sm text-sm font-medium rounded-md text-pink-500 bg-white hover:bg-pink-50 transition-colors"
            >
              Rejoindre un groupe
            </button>
            <button
              onClick={() => navigate('/group/create')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-colors"
            >
              Créer un groupe
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Vos groupes" 
            value={groups.length}
          />
          <StatCard 
            title="Pronostics réalisés" 
            value={`${groups.filter(g => g.userPrediction && g.predictionProgress === 100).length}/${groups.length}`}
          />
          <StatCard 
            title="Meilleur score" 
            value={groups.reduce((max, group) => {
              const score = group.userPrediction?.score || 0;
              return Math.max(max, score);
            }, 0)}
          />
        </div>

        {/* Section Mes Pronostics */}
        <div className="mb-8">
          <MyPredictions groups={groups} />
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher un groupe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-shadow"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>

          <select
            className="px-4 py-2 rounded-lg border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-shadow"
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
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            {searchTerm || filter !== 'all' ? (
              <p className="text-lg text-gray-600">
                Aucun groupe ne correspond à votre recherche
              </p>
            ) : (
              <div>
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  Commencez l'aventure !
                </p>
                <p className="text-gray-600 mb-6">
                  Créez votre premier groupe ou rejoignez-en un pour commencer à pronostiquer !
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => navigate('/group/create')}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors"
                  >
                    Créer un groupe
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map(group => (
              <div
                key={group.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{group.name}</h2>
                      <p className="text-sm text-gray-500">
                        {group.members?.length || 0} membres
                      </p>
                    </div>
                    {group.admin === user.uid && (
                      <span className="px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-medium rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-6 line-clamp-2">
                    {group.description || 'Aucune description'}
                  </p>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>Pronostics</span>
                      <span>
                        {`${group.predictionStats?.completedPredictions || 0}/${group.members?.length || 0} complétés`}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/group/${group.id}`)}
                    className="w-full bg-gray-50 text-gray-700 font-medium px-4 py-2.5 rounded-lg group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-500 group-hover:text-white transition-colors"
                  >
                    Voir le groupe
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;