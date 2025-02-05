import { useState } from "react";

// Exemple de 20 questions
const questions = [
  { 
    question: "Quelle est la capitale de la France ?", 
    options: ["Paris", "Londres", "Madrid", "Berlin"], 
    correct: "Paris" 
  },
  { 
    question: "Combien font 5 + 3 ?", 
    options: ["5", "8", "10", "15"], 
    correct: "8" 
  },
  // Ajoute 18 autres questions ici...
];

const QuizMiss = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  // Fonction pour sélectionner une réponse
  const handleAnswer = (answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = answer;
    setAnswers(updatedAnswers);
  };

  // Fonction pour calculer le score final
  const calculateScore = () => {
    return answers.filter((answer, index) => answer === questions[index].correct).length;
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      {!showResults ? (
        <>
          <h2 className="text-xl font-bold mb-4">
            Question {currentQuestion + 1} / {questions.length}
          </h2>
          <p className="mb-4">{questions[currentQuestion].question}</p>

          {/* Affichage des options */}
          <div className="space-y-2">
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`w-full py-2 px-4 border rounded-lg 
                  ${answers[currentQuestion] === option ? "bg-blue-500 text-white" : "bg-gray-100"}`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Navigation entre questions */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
              disabled={currentQuestion === 0}
              className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            >
              Précédent
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={() => setShowResults(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg"
              >
                Voir les résultats
              </button>
            )}
          </div>
        </>
      ) : (
        // Résultats finaux
        <div>
          <h2 className="text-2xl font-bold mb-4">Résultats</h2>
          <p className="mb-2">Score: {calculateScore()} / {questions.length}</p>

          {/* Liste des réponses */}
          <ul className="space-y-3">
            {questions.map((q, index) => (
              <li key={index} className="p-3 border rounded-lg">
                <p><strong>{q.question}</strong></p>
                <p className={`font-bold ${answers[index] === q.correct ? "text-green-500" : "text-red-500"}`}>
                  Votre réponse: {answers[index] || "Non répondu"}
                </p>
                <p className="text-gray-600">Réponse correcte: {q.correct}</p>
              </li>
            ))}
          </ul>

          <button
            onClick={() => { setAnswers(Array(questions.length).fill(null)); setShowResults(false); setCurrentQuestion(0); }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Recommencer
          </button>
        </div>
      )}
    </div>
  );
};

export default QCM;
