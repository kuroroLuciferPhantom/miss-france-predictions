import React, { useState, useEffect } from 'react';
import { db } from '../../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthContext } from '../../../contexts/AuthContext';

//TODO être arrivé 1er dans un groupe
const BADGES_CONFIG = [
  {
    id: 'missFound2026',
    title: 'Miss Irma',
    description: 'A deviné Miss France 2026',
    image: '/badges/badge-voyante-min.png',
    category: 'predictions'
  },
  {
    id: 'quizPerfect',
    title: 'Expert Miss France',
    description: '20/20 au quiz culture Miss France',
    image: '/badges/badge-perfectQuiz-min.png',
    category: 'quiz'
  },
  {
    id: 'abusey',
    title: 'Abuseeeyyyy', 
    description: 'A deviné le Top 5 exact',
    image: '/badges/badge-missWin-min.png',
    category: 'predictions'
  },
  {
    id: 'miroirMagique',
    title: 'Possède le miroir magique',
    description: 'A marqué plus de 20 pts',
    image: '/badges/badge-miroirMagique-min.png',
    category: 'predictions'  
  },
  {
    id: 'baraka',
    title: 'La baraka !! (Va jouer au loto)',
    description: 'A marqué plus de 35 pts',
    image: '/badges/badge-bingo-min.png',
    category: 'predictions'  
  },
  {
    id: 'cancre',
    title: 'Bonnet d\'Âne',
    description: 'A eu moins de 10 au QCM Miss France',
    image: '/badges/badge-cancre-min.png',
    category: 'quiz'
  },
  {
    id: 'instruit',
    title: 'Le pinguin qui glisse le plus',
    description: 'A eu plus de 14 au QCM Miss France',
    image: '/badges/badge-instruit-min.png',
    category: 'quiz'
  },
  {
    id: 'missGoutDiscutable',
    title: "J'adore Desigual",
    description: 'A classé la Miss en dehors du Top 15',
    image: '/badges/badge-goutDiscutable-min.png',
    category: 'predictions'
  },
  {
    id: 'physio',
    title: 'La physio du groupe (non)',
    description: 'A marqué moins de 15 points',
    image: '/badges/badge-blind-min.png',
    category: 'predictions'  
  },
];

const Badge = ({ badge, isUnlocked }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className="relative flex flex-col items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
        <img 
          src={`/images/${badge.image}`} 
          alt={badge.title}
          className={`w-32 h-32 ${!isUnlocked && 'opacity-40 grayscale dark:opacity-30'}`}
        />
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full mb-2 w-48 bg-gray-900 dark:bg-gray-800 text-white rounded-lg py-2 px-3 shadow-lg dark:shadow-gray-900/50 z-10">
          <div className="font-medium mb-1">{badge.title}</div>
          <div className="text-gray-300 dark:text-gray-400 text-xs">{badge.description}</div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="border-8 border-transparent border-t-gray-900 dark:border-t-gray-800" />
          </div>
        </div>
      )}
      
      <div className="mt-2 text-center">
        <div className="font-medium text-sm text-gray-900 dark:text-white">{badge.title}</div>
        <div className={`text-xs ${
          isUnlocked 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {isUnlocked ? 'Débloqué' : 'À débloquer'}
        </div>
      </div>
    </div>
  );
};

const BadgesSection = () => {
  const { user } = useAuthContext();
  const [userBadges, setUserBadges] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBadges = async () => {
      try {
        const badgesDoc = await getDoc(doc(db, 'userBadges', user.uid));
        if (badgesDoc.exists()) {
          setUserBadges(badgesDoc.data().badges || {});
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des badges:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchUserBadges();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Mes badges</h2>
      
      {/* Section Prédictions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-pink-600 dark:text-pink-400">
          Badges Prédictions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BADGES_CONFIG.filter(badge => badge.category === 'predictions').map((badge) => (
            <Badge
              key={badge.id}
              badge={badge}
              isUnlocked={userBadges[badge.id] || false}
            />
          ))}
        </div>
      </div>
  
      {/* Section Quiz */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-purple-600 dark:text-purple-400">
          Badges Quiz
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BADGES_CONFIG.filter(badge => badge.category === 'quiz').map((badge) => (
            <Badge
              key={badge.id}
              badge={badge}
              isUnlocked={userBadges[badge.id] || false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgesSection;