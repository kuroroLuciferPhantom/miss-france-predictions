import React, { useEffect, useState } from 'react';

const StarBackground = ({ children }) => {
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    // Générer les étoiles avec des positions aléatoires
    const generateStars = () => {
      const newStars = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        animationDelay: Math.random() * 3
      }));
      setStars(newStars);
    };
    
    generateStars();
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Conteneur de fond avec dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 dark:from-purple-950 dark:to-pink-950" />
      
      {/* Étoiles */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: 0.6,
            animationDelay: `${star.animationDelay}s`
          }}
        />
      ))}
      
      {/* Overlay avec un léger effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5" />
      
      {/* Contenu */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

// Ajout de l'animation de scintillement personnalisée via une classe Tailwind
const style = document.createElement('style');
style.textContent = `
  @keyframes twinkle {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.8; }
  }
  .animate-twinkle {
    animation: twinkle 3s infinite ease-in-out;
  }
`;
document.head.appendChild(style);

export default StarBackground;