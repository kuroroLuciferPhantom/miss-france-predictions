import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const QuizLeaderboard = ({ groupMembers }) => {
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        console.log("Group members reçus:", groupMembers);
        const results = [];

        // Pour chaque membre du groupe
        for (const member of groupMembers) {
          try {
            const quizDoc = await getDoc(doc(db, 'quizResults', member.userId));
            if (quizDoc.exists()) {
              const quizData = quizDoc.data();
              results.push({
                userId: member.userId,
                username: member.username,
                score: quizData.score,
                totalQuestions: quizData.totalQuestions || 20,
                completedAt: quizData.completedAt
              });
            }
          } catch (err) {
            console.log(`Pas de résultat pour l'utilisateur ${member.username}`);
          }
        }

        // Trier par score décroissant
        results.sort((a, b) => b.score - a.score);
        console.log("Résultats triés:", results);
        setQuizResults(results);

      } catch (error) {
        console.error('Erreur lors de la récupération des résultats du quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    if (groupMembers && groupMembers.length > 0) {
      fetchQuizResults();
    } else {
      setLoading(false);
    }
  }, [groupMembers]);

  if (loading) {
    return <div className="mt-6 bg-white rounded-lg shadow p-4">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>;
  }

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Classement Quiz</h2>
      </div>
      {quizResults.length > 0 ? (
        <div className="space-y-4">
          {quizResults.map((result, index) => (
            <div
              key={result.userId}
              className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r hover:from-pink-50 hover:to-purple-50"
            >
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold text-gray-500">
                  {index + 1}
                </span>
                <div>
                  <div className="font-medium">{result.username}</div>
                  <div className="text-sm text-gray-500">
                    {result.completedAt ? 
                      `Complété le ${new Date(result.completedAt).toLocaleDateString()}` :
                      'Date de complétion non disponible'}
                  </div>
                </div>
              </div>
              <div className="text-lg font-semibold">
                {result.score}/{result.totalQuestions}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">
          Aucun membre n'a encore complété le quiz
        </p>
      )}
    </div>
  );
};

export default QuizLeaderboard;