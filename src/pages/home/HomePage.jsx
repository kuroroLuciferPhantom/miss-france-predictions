import React, { useState } from 'react';

const Header = () => {
  const [isLoggedIn] = useState(false);

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
                <a href="/login" className="text-pink-500 hover:text-pink-600 px-4 py-2 rounded-md">
                  Connexion
                </a>
                <a href="/signup" className="bg-pink-500 text-white hover:bg-pink-600 px-4 py-2 rounded-md">
                  Inscription
                </a>
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

const HowItWorks = () => (
  <div className="py-12">
    <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="text-center space-y-4">
        <div className="bg-pink-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">Créez un groupe</h3>
        <p className="text-gray-600">Invitez vos amis à rejoindre votre groupe avec un code unique</p>
      </div>

      <div className="text-center space-y-4">
        <div className="bg-pink-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">Faites vos pronostics</h3>
        <p className="text-gray-600">Sélectionnez vos Miss favorites dans l'ordre</p>
      </div>

      <div className="text-center space-y-4">
        <div className="bg-pink-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">Discutez</h3>
        <p className="text-gray-600">Échangez avec les autres participants</p>
      </div>

      <div className="text-center space-y-4">
        <div className="bg-pink-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">Résultats en direct</h3>
        <p className="text-gray-600">Découvrez votre score pendant l'élection</p>
      </div>
    </div>
  </div>
);

const Statistics = () => (
  <div className="bg-pink-500 text-white py-12 rounded-lg">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="space-y-2">
          <div className="text-4xl font-bold">1,234</div>
          <div className="text-pink-100">Participants</div>
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold">256</div>
          <div className="text-pink-100">Groupes actifs</div>
        </div>
        <div className="space-y-2">
          <div className="text-4xl font-bold">42</div>
          <div className="text-pink-100">Points record 2024</div>
        </div>
      </div>
    </div>
  </div>
);

const CallToAction = () => (
  <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-16 rounded-lg">
    <div className="max-w-3xl mx-auto text-center px-4">
      <h2 className="text-3xl font-bold mb-6">Prêt à faire vos pronostics ?</h2>
      <p className="text-lg mb-8">Rejoignez la communauté et défiez vos amis pour devenir le meilleur pronostiqueur Miss France 2025 !</p>
      <div className="flex justify-center space-x-4">
        <button className="bg-white text-pink-500 px-6 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-colors">
          Créer un groupe
        </button>
        <button className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
          Rejoindre un groupe
        </button>
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

        <div className="mt-16">
          <HowItWorks />
        </div>

        <div className="mt-16">
          <Statistics />
        </div>

        <div className="mt-16">
          <CallToAction />
        </div>
      </main>
    </div>
  );
};

export default HomePage;