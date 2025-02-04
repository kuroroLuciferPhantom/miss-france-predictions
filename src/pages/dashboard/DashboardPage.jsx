import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
  
const PredictionStatus = ({ prediction }) => {
  const [isSpinning, setIsSpinning] = useState(true);

  // Arrêter l'animation après 3 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSpinning(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!prediction) {
    return (
      <div className="flex items-center bg-yellow-50 text-yellow-600 px-4 py-3 rounded-lg">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Vous n'avez pas encore fait vos pronostics
      </div>
    );
  }

  // Calcul correct du total
  const totalPredicitions = (prediction.top3?.length || 0) + 
                          (prediction.top5?.length || 0) + 
                          (prediction.qualified?.length || 0);
  const isComplete = totalPredicitions === 15; // 3 + 2 + 10

  if (isComplete) {
    return (
      <div className="flex items-center bg-green-50 text-green-600 px-4 py-3 rounded-lg">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        Pronostics complétés
      </div>
    );
  }

  return (
    <div className="flex items-center bg-blue-50 text-blue-600 px-4 py-3 rounded-lg">
      <svg 
        className={`w-6 h-6 mr-2 ${isSpinning ? 'animate-spin' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
        />
      </svg>
      {totalPredicitions}/15 pronostics effectués
    </div>
  );
};

const PredictionSummary = ({ prediction }) => {
  if (!prediction) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Mes pronostics</h3>
        <button
          onClick={() => navigate('/predictions/edit')}
          className="text-pink-500 hover:text-pink-600 font-medium text-sm"
        >
          Modifier
        </button>
      </div>
      <div className="space-y-6">
        {/* Top 3 */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">TOP 3</h4>
          <div className="space-y-2">
            {prediction.top3?.map((miss, index) => (
              <div 
                key={miss.id} 
                className="flex items-center justify-between bg-pink-50 p-3 rounded-lg"
              >
                <div>
                  <div className="font-medium text-pink-700">{miss.name}</div>
                  <div className="text-sm text-pink-600">{miss.region}</div>
                </div>
                <div className="text-sm font-medium text-pink-500">
                  {index === 0 && "Miss France"}
                  {index === 1 && "1ère Dauphine"}
                  {index === 2 && "2ème Dauphine"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 */}
        <div>
          <h4 className="text-sm font-medium text-gray-500 mb-3">TOP 5</h4>
          <div className="space-y-2">
            {prediction.top5?.map((miss, index) => (
              <div 
                key={miss.id} 
                className="flex items-center justify-between bg-purple-50 p-3 rounded-lg"
              >
                <div>
                  <div className="font-medium text-purple-700">{miss.name}</div>
                  <div className="text-sm text-purple-600">{miss.region}</div>
                </div>
                <div className="text-sm font-medium text-purple-500">
                  {index === 0 && "3ème Dauphine"}
                  {index === 1 && "4ème Dauphine"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Qualifiées */}
        {prediction.qualified && prediction.qualified.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-3">
              Autres qualifiées ({prediction.qualified.length})
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {prediction.qualified?.map((miss) => (
                <div 
                  key={miss.id} 
                  className="bg-gray-50 p-3 rounded-lg"
                >
                  <div className="font-medium text-gray-700">{miss.name}</div>
                  <div className="text-sm text-gray-600">{miss.region}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const GroupCard = ({ group, userRank, user }) => (
  <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-bold text-gray-900">{group.name}</h3>
        <p className="text-sm text-gray-500">{group.members?.length || 0} participants</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm">
          #{userRank || '-'}
        </div>
        {group.admin === user.uid && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
            Admin
          </span>
        )}
      </div>
    </div>
    
    <div className="text-sm text-gray-600 mb-4">
      {group.description || 'Aucune description'}
    </div>

    <div className="border-t pt-4 mb-4">
      <div className="flex justify-between text-sm text-gray-500 mb-4">
        <span>Pronostics complétés</span>
        <span>
          {group.predictionStats?.completedPredictions || 0}/{group.members?.length || 0}
        </span>
      </div>
    </div>

    <button 
      onClick={() => window.location.href = `/group/${group.id}`}
      className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 hover:text-white transition-colors"
    >
      Voir le groupe
    </button>
  </div>
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [prediction, setPrediction] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer la prédiction de l'utilisateur
        const predictionQuery = query(
          collection(db, 'predictions'),
          where('userId', '==', user.uid)
        );
        const predictionSnap = await getDocs(predictionQuery);
        if (!predictionSnap.empty) {
          setPrediction(predictionSnap.docs[0].data());
        }

        // Récupérer les groupes de l'utilisateur
        const groupsSnap = await getDocs(collection(db, 'groups'));
        const userGroups = groupsSnap.docs
          .filter(doc => doc.data().members.some(member => member.userId === user.uid))
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        
        // Calculer le classement pour chaque groupe
        const groupsWithRanks = await Promise.all(userGroups.map(async (group) => {
          // Logique de calcul du classement à implémenter
          const userRank = Math.floor(Math.random() * group.members.length) + 1; // Pour l'exemple
          return { ...group, userRank };
        }));

        setGroups(groupsWithRanks);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sm:gap-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bienvenue {user?.username || user?.email?.split('@')[0]}
            </h1>
            <p className="text-gray-600 mt-1">Gérez vos pronostics et suivez vos groupes</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() => navigate('/predictions/edit')}
              className="px-4 py-2 border-2 border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50 transition-colors font-medium"
            >
              {prediction ? 'Modifier mes pronostics' : 'Faire mes pronostics'}
            </button>
            <button
              onClick={() => navigate('/group/create')}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors font-medium"
            >
              Créer un groupe
            </button>
            <button
              onClick={() => navigate('/group/join')}
              className="px-4 py-2 border-2 border-purple-500 text-purple-500 rounded-lg hover:bg-purple-50 transition-colors font-medium"
            >
              Rejoindre un groupe
            </button>
          </div>
        </div>

        {/* Status des pronostics */}
        <div className="mb-8">
          <PredictionStatus prediction={prediction} />
        </div>

        {/* Résumé des pronostics si existants */}
        {prediction && (
          <div className="mb-8">
            <PredictionSummary prediction={prediction} />
          </div>
        )}

        {/* Liste des groupes */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes groupes</h2>

          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
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

          {filteredGroups.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-8 text-center">
              <p className="text-xl font-semibold text-gray-800 mb-4">
                {searchTerm || filter !== 'all' ? 
                  'Aucun groupe ne correspond à votre recherche' : 
                  "Vous n'avez pas encore rejoint de groupe"}
              </p>
              {!searchTerm && filter === 'all' && (
                <>
                  <p className="text-gray-600 mb-6">
                    Créez votre propre groupe ou rejoignez-en un pour comparer vos pronostics !
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                    <button
                      onClick={() => navigate('/group/join')}
                      className="px-4 py-2 border-2 border-pink-500 text-pink-500 rounded-lg hover:bg-pink-50 transition-colors font-medium"
                    >
                      Rejoindre un groupe
                    </button>
                    <button
                      onClick={() => navigate('/group/create')}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors font-medium"
                    >
                      Créer un groupe
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map(group => (
                <GroupCard
                  key={group.id}
                  group={group}
                  userRank={group.userRank}
                  user={user}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;