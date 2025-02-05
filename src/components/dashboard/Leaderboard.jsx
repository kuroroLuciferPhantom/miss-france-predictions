// Components/dashboard/Leaderboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../../config/firebase';

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
        orderBy('score', 'desc'),
        limit(pageSize)
      );

      if (isNextPage && lastDoc) {
        q = query(
          collection(db, 'users'),
          orderBy('score', 'desc'),
          startAfter(lastDoc),
          limit(pageSize)
        );
      }

      const snapshot = await getDocs(q);
      const newPlayers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setHasMore(newPlayers.length === pageSize);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

      if (isNextPage) {
        setPlayers(prev => [...prev, ...newPlayers]);
      } else {
        setPlayers(newPlayers);
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

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Classement général</h2>
        
        {/* Filtres */}
        <div className="mt-4 flex gap-4">
          <input
            type="text"
            placeholder="Rechercher un joueur..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="px-4 py-2 rounded-lg border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          />
          <select
            value={filters.region}
            onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
            className="px-4 py-2 rounded-lg border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
          >
            <option value="all">Toutes les régions</option>
            <option value="nord">Nord</option>
            <option value="sud">Sud</option>
            {/* Ajouter les autres régions */}
          </select>
        </div>
      </div>

      {/* Table des scores */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joueur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pronostics corrects
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {players.map((player, index) => (
              <tr key={player.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {index + 1}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {player.username || player.email}
                      </div>
                      {player.region && (
                        <div className="text-sm text-gray-500">
                          {player.region}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {player.score || 0} pts
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">
                    {player.correctPredictions || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer avec pagination */}
      {hasMore && (
        <div className="px-4 py-3 border-t border-gray-200">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            {loading ? 'Chargement...' : 'Charger plus'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;