import React from 'react';

const PredictionStatusBanner = ({ eventStarted, predictionsOpen }) => {
  // Si les pronostics sont ouverts et que l'événement n'a pas commencé
  if (predictionsOpen && !eventStarted) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-lg overflow-hidden">
        <div className="p-4 flex items-start">
          <div className="flex-shrink-0 bg-green-500 dark:bg-green-400 rounded-full p-1">
            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
              Les pronostics sont ouverts !
            </h3>
            <div className="mt-1 text-sm text-green-700 dark:text-green-200">
              <p>Vous pouvez dès maintenant faire vos pronostics pour Miss France 2026. N'hésitez pas à les partager avec vos amis !</p>
            </div>
          </div>
        </div>
        
        {/* Barre de progression */}
        <div className="h-1 w-full bg-green-100 dark:bg-green-800">
          <div className="h-1 bg-green-500 dark:bg-green-400 animate-pulse" style={{ width: '100%' }}></div>
        </div>
      </div>
    );
  }
  
  // Si les pronostics ne sont pas ouverts
  if (!predictionsOpen && !eventStarted) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-800 rounded-lg overflow-hidden">
        <div className="p-4 flex items-start">
          <div className="flex-shrink-0 bg-yellow-500 dark:bg-yellow-400 rounded-full p-1">
            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
              Pronostics bientôt disponibles
            </h3>
            <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-200">
              <p>La saisie des pronostics pour Miss France 2026 n'est pas encore ouverte. Revenez bientôt !</p>
            </div>
          </div>
        </div>
        
        {/* Barre de progression */}
        <div className="h-1 w-full bg-yellow-100 dark:bg-yellow-800">
          <div className="h-1 bg-yellow-500 dark:bg-yellow-400 animate-pulse" style={{ width: '30%' }}></div>
        </div>
      </div>
    );
  }
  
  // Si l'événement a commencé
  if (eventStarted) {
    return (
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 border border-pink-200 dark:border-pink-800 rounded-lg overflow-hidden">
        <div className="p-4 flex items-start">
          <div className="flex-shrink-0 bg-pink-500 dark:bg-pink-400 rounded-full p-1">
            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-pink-800 dark:text-pink-300">
              L'élection Miss France a commencé !
            </h3>
            <div className="mt-1 text-sm text-pink-700 dark:text-pink-200">
              <p>Les pronostics sont maintenant fermés. Suivez l'événement et découvrez si vos prédictions étaient justes !</p>
            </div>
          </div>
        </div>
        
        {/* Barre de progression */}
        <div className="h-1 w-full bg-pink-100 dark:bg-pink-800">
          <div className="h-1 bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400" style={{ width: '100%' }}></div>
        </div>
      </div>
    );
  }
  
  // Par défaut, ne rien afficher
  return null;
};

export default PredictionStatusBanner;