import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuthContext } from "../../contexts/AuthContext";
import { showToast } from "../../components/ui/Toast";

const questions = [
  {
    question: "Quelle est la capitale de la France ?",
    options: ["Paris", "Londres", "Madrid", "Berlin"],
    correct: "Paris"
  },
  {
    question: "En quelle année a eu lieu la Révolution française ?",
    options: ["1492", "1789", "1914", "1815"],
    correct: "1789"
  },
  {
    question: "Quel est le plus grand océan du monde ?",
    options: ["Atlantique", "Pacifique", "Indien", "Arctique"],
    correct: "Pacifique"
  },
  {
    question: "Qui a réalisé le film 'Inception' ?",
    options: ["Quentin Tarantino", "Steven Spielberg", "Christopher Nolan", "James Cameron"],
    correct: "Christopher Nolan"
  },
  {
    question: "Combien de joueurs y a-t-il dans une équipe de football sur le terrain ?",
    options: ["9", "10", "11", "12"],
    correct: "11"
  },
  {
    question: "Quel est le symbole chimique de l'or ?",
    options: ["Au", "Ag", "Fe", "O"],
    correct: "Au"
  },
  {
    question: "Qui a peint la Joconde ?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonard de Vinci", "Claude Monet"],
    correct: "Leonard de Vinci"
  },
  {
    question: "Quel est le plus long fleuve du monde ?",
    options: ["Amazone", "Nil", "Mississippi", "Yangtsé"],
    correct: "Amazone"
  },
  {
    question: "Dans quelle ville se trouve la statue du Christ Rédempteur ?",
    options: ["Buenos Aires", "Mexico", "Rio de Janeiro", "Lisbonne"],
    correct: "Rio de Janeiro"
  },
  {
    question: "Quelle planète est surnommée la 'planète rouge' ?",
    options: ["Mars", "Jupiter", "Vénus", "Saturne"],
    correct: "Mars"
  }
];

const QuizMiss = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    checkQuizCompletion();
  }, [user]);

  const checkQuizCompletion = async () => {
    if (!user) return;
    const quizRef = doc(db, 'quizResults', user.uid);
    const quizDoc = await getDoc(quizRef);
    if (quizDoc.exists()) {
      showToast.error("Vous avez déjà complété le quiz !");
      navigate('/dashboard');
    }
  };

  const handleAnswer = (answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = answer;
    setAnswers(updatedAnswers);

    // Ne passer à la question suivante que si ce n'est pas la dernière
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 500);
    }
  };

  const calculateScore = () => {
    return answers.filter((answer, index) => answer === questions[index].correct).length;
  };

  const saveResults = async (finalAnswers) => {
    setSubmitting(true); // Indiquer que la sauvegarde est en cours
    
    try {
      console.log("Début de la sauvegarde du quiz");
      const score = finalAnswers.filter((answer, index) => answer === questions[index].correct).length;
      
      // Vérifier que l'utilisateur est bien connecté
      if (!user || !user.uid) {
        console.error("Erreur: utilisateur non connecté ou uid manquant");
        showToast.error("Erreur: veuillez vous reconnecter");
        return false;
      }
      
      console.log("Calcul du score terminé:", score);
      
      // Préparer les données du quiz
      const quizData = {
        userId: user.uid,
        score,
        totalQuestions: questions.length,
        answers: finalAnswers,
        completedAt: new Date().toISOString()
      };
      
      console.log("Tentative d'écriture dans Firestore");
      
      // Créer/Mettre à jour les résultats du quiz
      await setDoc(doc(db, 'quizResults', user.uid), quizData);
      
      console.log("Sauvegarde des résultats réussie");
      
      // Gérer les badges en bloc try/catch séparé pour ne pas bloquer le flux principal
      try {
        console.log("Récupération des badges utilisateur");
        const userBadgesRef = doc(db, 'userBadges', user.uid);
        const userBadgesDoc = await getDoc(userBadgesRef);
        const currentBadges = userBadgesDoc.exists() ? userBadgesDoc.data().badges || {} : {};
        
        const badgesToAdd = {};
        const newBadgesMessages = [];
        
        // Badge "Bonnet d'Âne" - moins de 10
        if (score < 10 && !currentBadges['cancre']) {
          badgesToAdd['cancre'] = true;
          newBadgesMessages.push('Bonnet d\'Âne');
        }
        
        // Badge "Le pinguin qui glisse le plus" - plus de 14
        if (score > 14 && !currentBadges['instruit']) {
          badgesToAdd['instruit'] = true;
          newBadgesMessages.push('Le pinguin qui glisse le plus');
        }
        
        // Badge "Expert Miss France" - 20/20
        if (score === 20 && !currentBadges['quizPerfect']) {
          badgesToAdd['quizPerfect'] = true;
          newBadgesMessages.push('Expert Miss France');
        }
        
        // Si de nouveaux badges sont débloqués
        if (Object.keys(badgesToAdd).length > 0) {
          console.log("Mise à jour des badges:", badgesToAdd);
          await setDoc(userBadgesRef, {
            badges: {
              ...currentBadges,
              ...badgesToAdd
            },
            lastUpdated: new Date().toISOString()
          }, { merge: true });
          
          // Afficher un toast pour chaque nouveau badge
          newBadgesMessages.forEach(badgeTitle => {
            showToast.success(`🏆 Nouveau badge débloqué : ${badgeTitle}`);
          });
        }
      } catch (badgeError) {
        console.error('Erreur lors de la mise à jour des badges:', badgeError);
        // On continue même si les badges échouent
      }
      
      console.log("Processus de sauvegarde terminé avec succès");
      showToast.success('Quiz complété !');
      return true;
    } catch (error) {
      console.error('Erreur détaillée lors de la sauvegarde:', error);
      
      // Messages d'erreur personnalisés selon le type d'erreur
      if (error.code === 'permission-denied') {
        showToast.error('Permission refusée: vous avez peut-être déjà complété ce quiz');
      } else if (error.code === 'unavailable') {
        showToast.error('Service indisponible: vérifiez votre connexion internet');
      } else {
        showToast.error('Erreur lors de la sauvegarde. Veuillez réessayer.');
      }
      return false;
    } finally {
      setSubmitting(false); // Réinitialiser l'état de soumission
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          {!showResults ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Question {currentQuestion + 1} sur {questions.length}
                </h2>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <p className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                {questions[currentQuestion].question}
              </p>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`w-full py-3 px-6 rounded-lg text-left font-medium transition-all
                      ${answers[currentQuestion] === option
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 text-white"
                        : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"}`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentQuestion((prev) => prev - 1)}
                  disabled={currentQuestion === 0}
                  className="px-6 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>

                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestion((prev) => prev + 1)}
                    disabled={!answers[currentQuestion]}
                    className="px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 text-white hover:from-pink-600 hover:to-purple-600 dark:hover:from-pink-700 dark:hover:to-purple-700 disabled:opacity-50"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (!submitting) {  // Vérifier que la soumission n'est pas déjà en cours
                        setSubmitting(true);
                        saveResults(answers).then(success => {
                          if (success) {
                            setShowResults(true);
                          }
                          setSubmitting(false);
                        });
                      }
                    }}
                    disabled={!answers[currentQuestion] || submitting}
                    className="px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 transition-all"
                  >
                    {submitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sauvegarde...
                      </span>
                    ) : (
                      "Terminer"
                    )}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                Résultats du Quiz
              </h2>

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-6 mb-8">
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">Votre score</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {calculateScore()} / {questions.length}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {questions.map((q, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">{q.question}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Votre réponse</p>
                        <p className={`font-medium ${answers[index] === q.correct
                            ? "text-green-500 dark:text-green-400"
                            : "text-red-500 dark:text-red-400"
                          }`}>
                          {answers[index] || "Non répondu"}
                        </p>
                      </div>
                      {answers[index] !== q.correct && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Réponse correcte</p>
                          <p className="font-medium text-green-500 dark:text-green-400">{q.correct}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Vos résultats ont été sauvegardés. Vous pouvez maintenant les comparer avec ceux des autres membres dans vos groupes !
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-600 dark:to-purple-600 text-white hover:from-pink-600 hover:to-purple-600 dark:hover:from-pink-700 dark:hover:to-purple-700"
                >
                  Retour au dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizMiss;