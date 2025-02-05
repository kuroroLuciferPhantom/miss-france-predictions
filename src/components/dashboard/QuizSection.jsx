import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const QuizSection = ({ user }) => {
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizResult = async () => {
      if (!user) return;
      const quizRef = doc(db, 'quizResults', user.uid);
      const quizDoc = await getDoc(quizRef);
      if (quizDoc.exists()) {
        setQuizResult(quizDoc.data());
      }
      setLoading(false);
    };

    fetchQuizResult();
  }, [user]);

  if (loading) return null;

  if (quizResult) {
    return (
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
              Test de culture générale complété !
            </h2>
            <p className="text-gray-600 mb-2">
              Score obtenu : <span className="font-bold">{quizResult.score}/{quizResult.totalQuestions}</span>
            </p>
            <p className="text-gray-600">
              Comparez votre score avec les membres de vos groupes !
            </p>
          </div>
          <div className="bg-white rounded-full p-3 shadow-md">
            <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-8 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-20" />
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-gradient-to-tr from-pink-200 to-purple-200 rounded-full opacity-20" />
        
        <div className="relative">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Le test de culture générale des Miss
          </h2>
          
          <div className="prose text-gray-600 max-w-3xl mb-8">
            <p className="text-lg">
              Les 30 candidates représentant leurs régions respectives ont participé au test de culture générale. 
              Politique, géographie, sport et mathématiques, ... : toutes les thématiques ont été abordées pour évaluer leurs connaissances. 
              Et vous, seriez-vous capable de répondre correctement à l'ensemble de ces questions ?
            </p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mesurez votre connaissance par rapport aux candidates
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Comparez vos réponses avec celles de votre groupe
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Juste pour le fun
              </li>
            </ul>
            <p className="mt-4 text-sm">
              Testez vos connaissances avec 20 questions sélectionnées parmi les 52 questions officielles du concours !
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate('/quiz-miss')}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-md"
            >
              Commencer le test
            </button>
            <p className="text-sm text-gray-500">
              Durée estimée : 7 minutes • Test pour le fun, n'affecte pas le classement général
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 py-4 bg-gray-50 border-t">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Une fois complété, le test ne pourra plus être modifié. Comparez vos résultats dans vos groupes !
        </div>
      </div>
    </div>
  );
};

export default QuizSection;