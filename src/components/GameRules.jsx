import React from 'react';

const GameRules = () => (
  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">Comment jouer ?</h2>
    <div className="prose max-w-none">
      <p className="mb-4">Pronostiquez l'élection Miss France en sélectionnant dans l'ordre :</p>
      <ol className="list-decimal pl-6 space-y-2">
        <li><span className="text-pink-600 font-semibold">Miss France 2025</span></li>
        <li><span className="text-pink-600 font-semibold">1ère Dauphine</span></li>
        <li><span className="text-pink-600 font-semibold">2ème Dauphine</span></li>
        <li><span className="text-purple-600 font-semibold">3ème Dauphine</span></li>
        <li><span className="text-purple-600 font-semibold">4ème Dauphine</span></li>
      </ol>
      <p className="mt-4">Puis sélectionnez :</p>
      <ul className="pl-6">
        <li><span className="text-blue-600 font-semibold">10 autres Miss qualifiées</span> (sans ordre précis)</li>
      </ul>
    </div>
  </div>
);

export default GameRules;