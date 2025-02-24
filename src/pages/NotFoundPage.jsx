import React from 'react';
import { Crown } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center px-6 py-16">
        <div className="relative mx-auto w-24 h-24 mb-8">
          {/* Couronne décorative en arrière-plan */}
          <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-xl" />
          <Crown className="w-full h-full text-pink-500 dark:text-pink-400" />
        </div>
        
        <p className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text mb-4">
          404
        </p>
        
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Cette page n'a pas été élue...
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Comme une Miss qui ne serait pas qualifiée pour les phases finales, 
          cette page n'existe pas ou n'est plus disponible.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg 
                     bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 
                     hover:to-purple-600 text-white font-medium transition-all 
                     duration-200 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40"
          >
            Retour à l'accueil
          </a>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg 
                     border border-gray-300 dark:border-gray-600 text-gray-700 
                     dark:text-gray-300 font-medium hover:bg-gray-50 
                     dark:hover:bg-gray-800 transition-colors"
          >
            Page précédente
          </button>
        </div>

        {/* Fiche de notation du jury 404 */}
        <div className="mt-16 max-w-sm mx-auto rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-pink-50 dark:bg-pink-900/20 px-4 py-2 text-sm font-medium text-pink-700 dark:text-pink-300 border-b border-gray-200 dark:border-gray-700">
            Fiche de notation - Erreur 404
          </div>
          <div className="p-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>✗ URL introuvable</p>
            <p>✗ Page non disponible</p>
            <p>✓ Redirection proposée</p>
            <p>✓ Esprit Miss France respecté</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;