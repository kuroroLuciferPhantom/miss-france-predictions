import React from 'react';

const GameRules = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Comment jouer ?</h2>
    <div className="prose dark:prose-invert max-w-none">
      <p className="mb-4 text-gray-600 dark:text-gray-300">Pronostiquez l'élection Miss France en sélectionnant dans l'ordre :</p>
      <ol className="list-decimal pl-6 space-y-2 text-gray-600 dark:text-gray-300">
        <li><span className="text-pink-600 dark:text-pink-400 font-semibold">Miss France 2025</span></li>
        <li><span className="text-pink-600 dark:text-pink-400 font-semibold">1ère Dauphine</span></li>
        <li><span className="text-pink-600 dark:text-pink-400 font-semibold">2ème Dauphine</span></li>
        <li><span className="text-purple-600 dark:text-purple-400 font-semibold">3ème Dauphine</span></li>
        <li><span className="text-purple-600 dark:text-purple-400 font-semibold">4ème Dauphine</span></li>
      </ol>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Puis sélectionnez :</p>
      <ul className="pl-6 text-gray-600 dark:text-gray-300">
        <li><span className="text-blue-600 dark:text-blue-400 font-semibold">10 autres Miss qualifiées</span> (sans ordre précis)</li>
      </ul>
    </div>
  </div>
);

export default GameRules;