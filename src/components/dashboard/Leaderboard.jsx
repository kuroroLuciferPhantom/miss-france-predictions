import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit, startAfter, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Trophy } from 'lucide-react';

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [pageSize] = useState(10);

  // Filtres
  const [filters, setFilters] = useState({
    search: '',
    region: 'all'
  });

  const fetchPlayers = async (isNextPage = false) => {
    try {
      let q = query(
        collection(db, 'users'),
        limit(pageSize)
      );

      if (isNextPage && lastDoc) {
        q = query(
          collection(db, 'users'),
          startAfter(lastDoc),
          limit(pageSize)
        );
      }

      const snapshot = await getDocs(q);

      // Récupérer les scores de chaque utilisateur
      const playersWithScores = await Promise.all(
        snapshot.docs.map(async (userDoc) => {
          const userData = userDoc.data();
          // Récupérer le score depuis la sous-collection years
          const scoreDoc = await getDoc(doc(db, 'userScores', userDoc.id, 'years', '2026'));
          const scoreData = scoreDoc.exists() ? scoreDoc.data() : { totalScore: 0 };

          return {
            id: userDoc.id,
            ...userData,
            score: scoreData.totalScore || 0,
            qualifiedCorrect: scoreData.qualifiedCorrect || 0,
            top5Correct: scoreData.top5Correct || 0,
            top3Correct: scoreData.top3Correct || 0
          };
        })
      );

      // Trier les joueurs par score
      const sortedPlayers = playersWithScores.sort((a, b) => b.score - a.score);

      setHasMore(snapshot.docs.length === pageSize);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

      if (isNextPage) {
        setPlayers(prev => {
          const newPlayers = [...prev, ...sortedPlayers];
          return newPlayers.sort((a, b) => b.score - a.score);
        });
      } else {
        setPlayers(sortedPlayers);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du classement:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleLoadMore = () => {
    fetchPlayers(true);
  };

  const filteredPlayers = players.filter(player => {
    const searchTerm = filters.search.toLowerCase();
    return (
      player.username?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Classement général</h2>

        {/* Filtres */}
        <div className="mt-4 flex gap-4">
          <input
            type="text"
            placeholder="Rechercher un joueur..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="px-4 py-2 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:border-pink-500 dark:focus:border-pink-400 focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900"
          />
        </div>
      </div>

      {/* Table des scores */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {['Position', 'Joueur', 'Score', 'Pronostics corrects'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredPlayers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Aucun joueur trouvé pour "{filters.search}"
                </td>
              </tr>
            ) : (
              filteredPlayers.map((player, index) => (
                <tr key={player.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index < 3 && (
                        <Trophy className={`w-5 h-5 mr-2 ${index === 0 ? 'text-yellow-400 dark:text-yellow-300' :
                            index === 1 ? 'text-gray-400 dark:text-gray-300' :
                              'text-amber-600 dark:text-amber-500'
                          }`} />
                      )}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {player.username || player.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {player.score} pts
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <div>Qualifiées: {player.qualifiedCorrect}/15</div>
                      <div>Top 5: {player.top5Correct}/5</div>
                      <div>Top 3: {player.top3Correct}/3</div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer avec pagination */}
      {hasMore && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 hover:from-pink-600 hover:to-purple-600 dark:hover:from-pink-700 dark:hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-pink-400 disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Charger plus'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;