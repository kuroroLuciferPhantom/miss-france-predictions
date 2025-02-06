import React, { useState, useEffect } from 'react';
import { db } from '../../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthContext } from '../../../contexts/AuthContext';

const BADGES_CONFIG = [
  {
    id: 'missFound2024',
    title: 'Miss France 2024',
    description: 'A deviné Miss France 2024',
    image: '/badges/miss2024.svg',
    category: 'predictions'
  },
  {
    id: 'missFound2025',
    title: 'Miss France 2025',
    description: 'A deviné Miss France 2025',
    image: '/badges/miss2025.svg',
    category: 'predictions'
  },
  {
    id: 'missFound2026',
    title: 'Miss France 2026',
    description: 'A deviné Miss France 2026',
    image: '/badges/miss2026.svg',
    category: 'predictions'
  },
  {
    id: 'quizPerfect',
    title: 'Expert Miss France',
    description: '20/20 au quiz culture Miss France',
    image: '/badges/quiz-perfect.svg',
    category: 'quiz'
  }
];

const Badge = ({ badge, isUnlocked }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className="relative flex flex-col items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div 
        className={`w-24 h-24 rounded-full flex items-center justify-center ${
          isUnlocked 
            ? 'bg-gradient-to-br from-pink-500 to-purple-500' 
            : 'bg-gray-200'
        } p-1`}
      >
        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
          <img 
            src={badge.image} 
            alt={badge.title}
            className={`w-16 h-16 ${!isUnlocked && 'opacity-40 grayscale'}`}
          />
        </div>
      </div>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full mb-2 w-48 bg-gray-900 text-white text-sm rounded-lg py-2 px-3 shadow-lg z-10">
          <div className="font-medium mb-1">{badge.title}</div>
          <div className="text-gray-300 text-xs">{badge.description}</div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="border-8 border-transparent border-t-gray-900" />
          </div>
        </div>
      )}
      
      <div className="mt-2 text-center">
        <div className="font-medium text-sm">{badge.title}</div>
        <div className={`text-xs ${isUnlocked ? 'text-green-600' : 'text-gray-500'}`}>
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
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-200 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">Mes badges</h2>
      
      {/* Section Prédictions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-pink-600">Badges Prédictions</h3>
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
        <h3 className="text-lg font-semibold mb-4 text-purple-600">Badges Quiz</h3>
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