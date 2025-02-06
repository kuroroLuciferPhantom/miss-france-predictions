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
  
    // Si c'est la dernière question
    if (currentQuestion === questions.length - 1) {
      setTimeout(() => {
        saveResults(updatedAnswers);
        setShowResults(true);
      }, 500);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const calculateScore = () => {
    return answers.filter((answer, index) => answer === questions[index].correct).length;
  };

  const saveResults = async (finalAnswers) => {
    try {
      const score = finalAnswers.filter((answer, index) => answer === questions[index].correct).length;
      const quizData = {
        userId: user.uid,
        score,
        totalQuestions: questions.length,
        answers: finalAnswers,
        completedAt: new Date().toISOString()
      };
  
      await setDoc(doc(db, 'quizResults', user.uid), quizData);
      showToast.success('Quiz complété !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      showToast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {!showResults ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Question {currentQuestion + 1} sur {questions.length}
                </h2>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <p className="text-lg font-medium text-gray-900 mb-6">
                {questions[currentQuestion].question}
              </p>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    className={`w-full py-3 px-6 rounded-lg text-left font-medium transition-all
                      ${answers[currentQuestion] === option 
                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" 
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentQuestion((prev) => prev - 1)}
                  disabled={currentQuestion === 0}
                  className="px-6 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>

                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestion((prev) => prev + 1)}
                    disabled={!answers[currentQuestion]}
                    className="px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 disabled:opacity-50"
                  >
                    Suivant
                  </button>
                ) : (
                  <button
                    onClick={() => setShowResults(true)}
                    disabled={!answers[currentQuestion]}
                    className="px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 disabled:opacity-50"
                  >
                    Terminer
                  </button>
                )}
              </div>
            </>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-center mb-8">
                Résultats du Quiz
              </h2>

              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 mb-8">
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-600 mb-2">Votre score</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {calculateScore()} / {questions.length}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {questions.map((q, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 mb-2">{q.question}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Votre réponse</p>
                        <p className={`font-medium ${
                          answers[index] === q.correct 
                            ? "text-green-500" 
                            : "text-red-500"
                        }`}>
                          {answers[index] || "Non répondu"}
                        </p>
                      </div>
                      {answers[index] !== q.correct && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Réponse correcte</p>
                          <p className="font-medium text-green-500">{q.correct}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Vos résultats ont été sauvegardés. Vous pouvez maintenant les comparer avec ceux des autres membres dans vos groupes !
                </p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
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