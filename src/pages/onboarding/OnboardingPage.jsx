import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleCreateGroup = () => {
    navigate('/group/create');
  };

  const handleJoinGroup = () => {
    navigate('/group/join');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenue {user?.username} ! 👋
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Message de bienvenue */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Votre compte a été créé avec succès
          </h2>
          <p className="text-xl text-gray-600">
            Pour commencer à faire vos pronostics, rejoignez un groupe ou créez le vôtre !
          </p>
        </div>

        {/* Options de groupe */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Créer un groupe */}
          <div 
            onClick={handleCreateGroup}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center cursor-pointer"
          >
            <div className="bg-pink-100 rounded-full p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Créer un groupe</h3>
            <p className="text-gray-600 mb-4">
              Créez votre propre groupe et invitez vos amis à vous rejoindre pour comparer vos pronostics
            </p>
            <span className="text-pink-500 font-semibold">Créer un groupe →</span>
          </div>

          {/* Rejoindre un groupe */}
          <div 
            onClick={handleJoinGroup}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col items-center text-center cursor-pointer"
          >
            <div className="bg-purple-100 rounded-full p-4 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Rejoindre un groupe</h3>
            <p className="text-gray-600 mb-4">
              Utilisez un code d'invitation pour rejoindre un groupe existant et participer aux pronostics
            </p>
            <span className="text-purple-500 font-semibold">Rejoindre un groupe →</span>
          </div>
        </div>

        {/* Comment gagner des points */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold mb-6 text-center">Comment gagner des points ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-500 mb-2">10 pts</div>
              <p className="text-gray-600">Pour avoir deviné Miss France 2025</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-500 mb-2">3+2 pts</div>
              <p className="text-gray-600">Pour chaque Miss dans le top 5 (+2 si bien placée)</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-500 mb-2">2 pts</div>
              <p className="text-gray-600">Pour chaque Miss qualifiée correctement identifiée</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;