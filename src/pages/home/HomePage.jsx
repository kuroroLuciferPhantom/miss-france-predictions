import React from 'react';

const Header = () => {
  const [isLoggedIn] = React.useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-pink-500 text-white p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h1 className="ml-3 text-2xl font-bold text-gray-900">Miss France Prédictions</h1>
          </div>

          <nav>
            {isLoggedIn ? (
              <div className="flex space-x-4">
                <a href="/groups" className="text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md">
                  Mes Groupes
                </a>
                <a href="/predictions" className="text-gray-700 hover:text-pink-500 px-3 py-2 rounded-md">
                  Mes Pronostics
                </a>
                <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-md">
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <button className="text-pink-500 hover:text-pink-600 px-4 py-2 rounded-md">
                  Connexion
                </button>
                <button className="bg-pink-500 text-white hover:bg-pink-600 px-4 py-2 rounded-md">
                  Inscription
                </button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

const Countdown = () => {
  const electionDate = new Date('2025-12-14T21:00:00');
  const now = new Date();
  const difference = electionDate - now;

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);

  return (
    <div className="bg-pink-50 py-3 px-6 rounded-lg flex items-center justify-center space-x-4">
      <span className="text-pink-600 font-medium">Élection Miss France 2025 dans :</span>
      <div className="flex space-x-2 text-pink-600 font-bold">
        <span>{days} jours</span>
        <span>et</span>
        <span>{hours} heures</span>
      </div>
    </div>
  );
};

const QuickRules = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-xl font-bold mb-4">Comment jouer ?</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <div className="text-pink-500 font-bold text-lg">1. Top 5</div>
        <p className="text-gray-600">Sélectionnez dans l'ordre les 5 finalistes</p>
      </div>
      <div className="space-y-2">
        <div className="text-pink-500 font-bold text-lg">2. Qualifiées</div>
        <p className="text-gray-600">Choisissez 10 autres Miss qualifiées</p>
      </div>
      <div className="space-y-2">
        <div className="text-pink-500 font-bold text-lg">3. Points</div>
        <p className="text-gray-600">Gagnez des points pour chaque bonne prédiction</p>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Pronostiquez l'élection Miss France 2025
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Créez votre groupe, invitez vos amis et devinez qui sera la prochaine Miss France !
          </p>
          
          <div className="flex justify-center mb-8">
            <Countdown />
          </div>

          <div className="flex justify-center">
            <button className="bg-pink-500 text-white text-lg font-semibold px-8 py-4 rounded-lg hover:bg-pink-600 transition-colors">
              Commencer l'aventure
            </button>
          </div>
        </div>

        <div className="mt-12">
          <QuickRules />
        </div>
      </main>
    </div>
  );
};

export default HomePage;