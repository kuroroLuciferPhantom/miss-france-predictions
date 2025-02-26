import { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import StarBackground from '../../components/ui/StarBackground';
import { useSeo } from '../../hooks/useSeo';

const scrollVariants = {
  hidden: {
    opacity: 0,
    y: 50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const electionDate = new Date('2025-12-14T21:00:00');
      const now = new Date();
      const difference = electionDate - now;

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center min-w-[80px] bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm">
      <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">
        {value}
      </span>
      <span className="text-sm text-pink-500 dark:text-pink-300">
        {label}
      </span>
    </div>
  );

  return (
    <StarBackground>
      <div role="timer" className="py-4 px-6">
        <h3 className="text-pink-600 dark:text-pink-400 font-medium text-center mb-3">
          Élection Miss France 2026 dans :
        </h3>

        <div className="flex flex-wrap justify-center gap-4">
          <TimeUnit value={timeLeft.days} label="jours" />
          <TimeUnit value={timeLeft.hours} label="heures" />
          <TimeUnit value={timeLeft.minutes} label="minutes" />
          <TimeUnit value={timeLeft.seconds} label="secondes" />
        </div>
      </div>
    </StarBackground>
  );
};

const QuickRules = () => (
  <section aria-labelledby="rules-title">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={scrollVariants}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <h2 id="rules-title" className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Comment jouer ?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="text-pink-500 dark:text-pink-400 font-bold text-lg">1. Top 5</div>
          <p className="text-gray-600 dark:text-gray-300">Sélectionnez dans l'ordre les 5 finalistes</p>
        </div>
        <div className="space-y-2">
          <div className="text-pink-500 dark:text-pink-400 font-bold text-lg">2. Qualifiées</div>
          <p className="text-gray-600 dark:text-gray-300">Choisissez 10 autres Miss qualifiées</p>
        </div>
        <div className="space-y-2">
          <div className="text-pink-500 dark:text-pink-400 font-bold text-lg">3. Points</div>
          <p className="text-gray-600 dark:text-gray-300">Gagnez des points pour chaque bonne prédiction</p>
        </div>
      </div>
    </motion.div>
  </section>
);

const SupportSection = () => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={scrollVariants}
    className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-sm"
  >
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      Si tu aimes ce site ☕️
    </h3>
    <p className="text-gray-600 dark:text-gray-300 mb-6">
      Tu peux me soutenir en m'offrant un café !
    </p>

    <a href="https://buymeacoffee.com/lkuroro"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all hover:shadow-lg"
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.238c-.826 0-1.491.284-2.26.613z" />
      </svg>
      Me faire un don
    </a>
  </motion.div>
);

const HowItWorks = () => (
  <section aria-labelledby="how-it-works-title">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={scrollVariants}
      className="py-12"
    >
      <h2 id="how-it-works-title" className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        Comment ça marche ?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="text-center space-y-4">
          <div className="bg-pink-100 dark:bg-pink-900/30 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Créez un groupe</h3>
          <p className="text-gray-600 dark:text-gray-300">Invitez vos amis à rejoindre votre groupe avec un code unique</p>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-pink-100 dark:bg-pink-900/30 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Faites vos pronostics</h3>
          <p className="text-gray-600 dark:text-gray-300">Sélectionnez vos Miss favorites dans l'ordre</p>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-pink-100 dark:bg-pink-900/30 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Discutez</h3>
          <p className="text-gray-600 dark:text-gray-300">Échangez avec les autres participants</p>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-pink-100 dark:bg-pink-900/30 w-16 h-16 mx-auto rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Résultats en direct</h3>
          <p className="text-gray-600 dark:text-gray-300">Découvrez votre score pendant l'élection</p>
        </div>
      </div>
    </motion.div>
  </section>
);

const Statistics = () => {
  const { isAuthenticated } = useAuthContext();
  const [stats, setStats] = useState({
    participants: 0,
    groupsCount: 0,
    topMiss: {
      name: '-',
      count: 0
    }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Compter les utilisateurs
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const participants = usersSnapshot.size;

        // Compter les groupes
        const groupsSnapshot = await getDocs(collection(db, 'groups'));
        const groupsCount = groupsSnapshot.size;

        // Trouver la Miss la plus pronostiquée
        const predictionsSnapshot = await getDocs(collection(db, 'predictions'));
        const predictions = predictionsSnapshot.docs.map(doc => doc.data());

        // Compter les votes pour chaque Miss
        const missVotes = {};
        predictions.forEach(prediction => {
          const allChoices = [
            ...(prediction.top3 || []),
            ...(prediction.top5 || []),
            ...(prediction.qualified || [])
          ];

          allChoices.forEach(miss => {
            if (miss && miss.name) {
              missVotes[miss.name] = (missVotes[miss.name] || 0) + 1;
            }
          });
        });

        // Trouver la Miss avec le plus de votes
        const topMissEntry = Object.entries(missVotes)
          .sort(([, a], [, b]) => b - a)[0] || ['Aucune donnée', 0];

        setStats({
          participants,
          groupsCount,
          topMiss: {
            name: topMissEntry[0],
            count: topMissEntry[1]
          }
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
      }
    };

    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={scrollVariants}
      className="bg-pink-500 dark:bg-pink-600 text-white py-12 rounded-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-4xl font-bold">
              {isAuthenticated ? stats.participants : "27"}
            </div>
            <div className="text-pink-100">Participants</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold">
              {isAuthenticated ? stats.groupsCount : "12"}
            </div>
            <div className="text-pink-100">Groupes actifs</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold">
              {isAuthenticated ? stats.topMiss.name : "-"}
            </div>
            <div className="text-pink-100">
              {isAuthenticated
                ? `Miss favorite (${stats.topMiss.count} votes)`
                : "Connectez-vous pour voir les statistiques en direct"}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CallToAction = ({ onCreateGroup, onJoinGroup }) => (
  <section aria-labelledby="cta-title">
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={scrollVariants}
      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-16 rounded-lg"
    >
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 id="cta-title" className="text-3xl font-bold mb-6">Prêt à faire vos pronostics ?</h2>
        <p className="text-lg mb-8">
          Rejoignez la communauté et défiez vos amis pour devenir le meilleur pronostiqueur Miss France 2026 !
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCreateGroup}
            aria-label="Créer un nouveau groupe"
            className="bg-white dark:bg-gray-800 text-pink-500 dark:text-pink-400 px-6 py-3 rounded-lg font-semibold hover:bg-pink-50 dark:hover:bg-gray-700 transition-colors"
          >
            Créer un groupe
          </button>
          <button
            onClick={onJoinGroup}
            aria-label="Rejoindre un groupe existant"
            className="bg-pink-600 dark:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-700 dark:hover:bg-pink-800 transition-colors"
          >
            Rejoindre un groupe
          </button>
        </div>
      </div>
    </motion.div>
  </section>
);

const HomePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthContext();

  // Navigation sécurisée - vérifie l'authentification avant d'accéder aux routes protégées
  const handleSecureNavigation = (path) => {
    if (!isAuthenticated) {
      // Stocker la destination souhaitée pour la redirection post-login
      sessionStorage.setItem('redirectAfterLogin', path);
      navigate('/login');
    } else if (!user?.hasCompletedOnboarding) {
      navigate('/onboarding');
    } else {
      navigate(path);
    }
  };

  const handleCreateGroup = () => {
    handleSecureNavigation('/group/create');
  }
  const handleJoinGroup = () => handleSecureNavigation('/group/join');
  const handleStartAdventure = () => {
    if (isAuthenticated) {
      if (!user?.hasCompletedOnboarding) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  useSeo({
    title: 'Miss\'Prono - Prédisez la gagnante !',
    description: 'Créez votre groupe de pronostics Miss France 2026, invitez vos amis et prédisez qui sera la prochaine Miss France. Quiz et classements en direct!',
  });

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pronostiquez l'élection Miss France 2026
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Créez votre groupe, invitez vos amis et devinez qui sera la prochaine Miss France !
            </p>

            <div className="flex justify-center mb-8">
              <Countdown />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleStartAdventure}
                aria-label={isAuthenticated ? "Accéder à votre tableau de bord" : "Commencer l'aventure Miss France"}
                className="bg-pink-500 dark:bg-pink-600 text-white text-lg font-semibold px-8 py-4 rounded-lg hover:bg-pink-600 dark:hover:bg-pink-700 transition-colors"
              >
                {isAuthenticated ? "Accéder au dashboard" : "Commencer l'aventure"}
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
            <Suspense fallback={<div>Chargement des statistiques...</div>}>
              <Statistics />
            </Suspense>
          </div>

          <div className="mt-16">
            <Suspense fallback={<div>Chargement...</div>}>
              <SupportSection />
            </Suspense>
          </div>

          <div className="mt-16">
            <CallToAction
              onCreateGroup={handleCreateGroup}
              onJoinGroup={handleJoinGroup}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default HomePage;