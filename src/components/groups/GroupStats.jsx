import React, { useMemo } from 'react';
import { Users, Crown, Percent, ChevronUp, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const GroupStats = ({ predictions, members }) => {
  const stats = useMemo(() => {
    // Calcul du taux de participation
    const participationRate = (predictions.filter(p => p.top5.length > 0).length / members.length) * 100;

    // Calcul des Miss favorites
    const missVotes = {};
    predictions.forEach(prediction => {
      prediction.top5.forEach((miss, index) => {
        const points = 5 - index; // 5 points pour la 1ère, 4 pour la 2ème, etc.
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
      participationRate,
      topMiss
    };
  }, [predictions, members]);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900">Statistiques du groupe</h2>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {/* Indicateurs clés */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-pink-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Membres</p>
                <p className="text-2xl font-semibold text-gray-900">{members.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Percent className="w-8 h-8 text-purple-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Participation</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(stats.participationRate)}%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Crown className="w-8 h-8 text-yellow-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Miss Favorite</p>
                <p className="text-2xl font-semibold text-gray-900">
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
              <h3 className="text-base font-medium text-gray-900 mb-4">Top 5 des Miss favorites</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topMiss}>
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="votes" fill="#EC4899" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tendances */}
            <div className="mt-8">
              <h3 className="text-base font-medium text-gray-900 mb-4">Tendances récentes</h3>
              <ul className="space-y-3">
                {stats.topMiss.slice(0, 3).map((miss, index) => (
                  <li key={miss.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{miss.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">{miss.votes} points</span>
                      {index === 0 ? (
                        <ChevronUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-red-500" />
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