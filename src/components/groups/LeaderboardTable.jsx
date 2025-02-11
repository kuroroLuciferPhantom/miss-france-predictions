import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const LeaderboardTable = ({ members, eventStarted }) => {
  // Trier les membres par points
  const [membersWithScores, setMembersWithScores] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const membersScores = await Promise.all(
          members.map(async (member) => {
            const scoreDoc = await getDoc(doc(db, 'userScores', member.userId, 'years', '2026'));
            return {
              ...member,
              points: scoreDoc.exists() ? scoreDoc.data().totalScore : 0
            };
          })
        );
        setMembersWithScores(membersScores);
      } catch (error) {
        console.error('Erreur lors de la récupération des scores:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [members]);

  const sortedMembers = [...membersWithScores].sort((a, b) => (b.points || 0) - (a.points || 0));

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Classement</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {/* En-têtes de colonnes */}
              {['Position', 'Membre', 'Points', 'Statut', 'Évolution'].map((header) => (
                <th 
                  key={header}
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedMembers.map((member, index) => (
              <tr key={member.userId}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {index < 3 && (
                      <Trophy className={`w-5 h-5 mr-2 ${
                        index === 0 ? 'text-yellow-400 dark:text-yellow-300' :
                        index === 1 ? 'text-gray-400 dark:text-gray-300' :
                        'text-amber-600 dark:text-amber-500'
                      }`} />
                    )}
                    <span className="text-sm text-gray-900 dark:text-gray-100">{index + 1}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.username}
                      {member.isAdmin && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {member.points || 0}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {!eventStarted ? (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.hasSubmitted
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                    }`}>
                      {member.hasSubmitted ? 'Pronostics soumis' : 'En attente'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                      Verrouillé
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    {getTrendIcon(member.trend)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;