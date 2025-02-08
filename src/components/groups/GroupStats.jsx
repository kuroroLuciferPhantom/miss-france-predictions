import React, { useMemo } from 'react';
import { Users, Crown, Percent, ChevronUp, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const GroupStats = ({ predictions, members, group, eventStarted }) => {
  const stats = useMemo(() => {
    // Filtre pour n'utiliser que les prédictions valides
    const validPredictions = predictions.filter(p => 
      p.isComplete && (p.isPublic || eventStarted)
    );
  
    // Le reste du calcul utilise validPredictions au lieu de predictions
    const missVotes = {};
    validPredictions.forEach(prediction => {
      prediction.top5.forEach((miss, index) => {
        const points = 5 - index;
        missVotes[miss.name] = (missVotes[miss.name] || 0) + points;
      });
      prediction.qualifiees?.forEach(miss => {
        missVotes[miss.name] = (missVotes[miss.name] || 0) + 1;
      });
    });
  
    // Trier les Miss par nombre de points
    const topMiss = Object.entries(missVotes)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, votes]) => ({ name, votes }));
  
    return {
      topMiss
    };
  }, [predictions, eventStarted]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Statistiques du groupe</h2>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {/* Indicateurs clés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Carte Membres */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-pink-500 dark:text-pink-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Membres</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{members.length}</p>
              </div>
            </div>
          </div>
  
          {/* Carte Participation */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-lg">
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
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Crown className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Miss Favorite</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.topMiss[0]?.name || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
  
        {stats.topMiss && stats.topMiss.length > 0 && (
          <>
            {/* Graphique des Miss favorites */}
            <div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Top 5 des Miss favorites</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topMiss}>
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                      tick={{ fill: 'currentColor' }} 
                      className="text-gray-600 dark:text-gray-400" 
                    />
                    <YAxis 
                      tick={{ fill: 'currentColor' }} 
                      className="text-gray-600 dark:text-gray-400" 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgb(31, 41, 55)', 
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: 'white' 
                      }} 
                    />
                    <Bar dataKey="votes" fill="#EC4899" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
  
            {/* Tendances */}
            <div className="mt-8">
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">Tendances récentes</h3>
              <ul className="space-y-3">
                {stats.topMiss.slice(0, 3).map((miss, index) => (
                  <li key={miss.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {miss.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                        {miss.votes} points
                      </span>
                      {index === 0 ? (
                        <ChevronUp className="w-4 h-4 text-green-500 dark:text-green-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-red-500 dark:text-red-400" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GroupStats;