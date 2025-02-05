import React, { useState, useEffect } from 'react';
import { db } from '@/config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

const GroupQuizLeaderboard = ({ groupId }) => {
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        // Récupérer les membres du groupe
        const groupDoc = await getDocs(doc(db, 'groups', groupId));
        const members = groupDoc.data().members;

        // Récupérer les résultats du quiz pour les membres du groupe
        const quizQuery = query(
          collection(db, 'quizResults'),
          where('userId', 'in', members)
        );
        
        const quizSnapshot = await getDocs(quizQuery);
        const results = [];

        // Récupérer les noms d'utilisateur
        const userDocs = await Promise.all(
          members.map(memberId => 
            getDocs(doc(db, 'users', memberId))
          )
        );
        const usernames = Object.fromEntries(
          userDocs.map(doc => [doc.id, doc.data().username])
        );

        quizSnapshot.forEach(doc => {
          const data = doc.data();
          results.push({
            userId: data.userId,
            username: usernames[data.userId],
            score: data.score,
            completedAt: data.completedAt?.toDate(),
            isCurrentUser: data.userId === user.uid
          });
        });

        // Tri par score décroissant
        setQuizResults(results.sort((a, b) => b.score - a.score));
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des résultats:', error);
        setLoading(false);
      }
    };

    if (groupId) {
      fetchQuizResults();
    }
  }, [groupId, user]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Classement Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classement Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        {quizResults.length > 0 ? (
          <div className="space-y-3">
            {quizResults.map((result, index) => (
              <div
                key={result.userId}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  result.isCurrentUser
                    ? 'bg-gradient-to-r from-pink-500/10 to-purple-500/10'
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold">{index + 1}</span>
                  <span className="font-medium">{result.username}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold">{result.score}/20</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Aucun membre n'a encore complété le quiz
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupQuizLeaderboard;