import React, { useMemo } from 'react';
import { Users, Crown, Percent } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const GroupStats = ({ predictions, members, group, eventStarted }) => {
  const stats = useMemo(() => {
    // Ne compter que les prédictions où les Miss sont classées premières (Miss France)
    const missVotes = {};
    const predToUse = eventStarted ? predictions : predictions.filter(p => p.isPublic);

    predToUse.forEach(prediction => {
      // On ne regarde que la première position du top3
      const missFrance = prediction.top3?.[0];
      if (missFrance && missFrance.name) {
        missVotes[missFrance.name] = (missVotes[missFrance.name] || 0) + 1;
      }
    });

    // Trouver la Miss avec le plus de votes comme Miss France
    const sortedMiss = Object.entries(missVotes)
      .sort(([, a], [, b]) => b - a)
      .map(([name, votes]) => ({
        name,
        votes,
        // Calculer le pourcentage par rapport au total des prédictions
        percentage: Math.round((votes / predToUse.length) * 100)
      }));

    return {
      topMiss: sortedMiss[0] || { name: '-', votes: 0, percentage: 0 },
    };
  }, [predictions, eventStarted]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Statistiques du groupe</h2>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {/* Indicateurs clés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          {/* Carte Membres */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-lg h-32 flex items-center justify-center">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-pink-500 dark:text-pink-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Membres</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{members.length}</p>
              </div>
            </div>
          </div>

          {/* Carte Participation */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-lg h-32 flex items-center justify-center">
            <div className="flex items-center">
              <Percent className="w-8 h-8 text-purple-500 dark:text-purple-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Participation</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {Math.round(group?.stats?.participationRate || 0)}%
                </p>
              </div>
            </div>
          </div>

          {/* Carte Miss Favorite */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-lg h-32 flex items-center justify-center">
            <div className="flex items-center">
              <Crown className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Miss Favorite</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.topMiss.name}<br/>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    ({stats.topMiss.percentage}% des votes)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Texte informatif sous les cartes */}
        {!eventStarted && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-right">
            * La Miss favorite est uniquement basé sur les prédictions publiques du groupe
          </p>
        )}
      </div>
    </div >
  );
};

export default GroupStats;