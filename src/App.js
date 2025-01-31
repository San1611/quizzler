import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";

const QuizApp = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetch("https://thingproxy.freeboard.io/fetch/https://api.jsonserve.com/Uw5CrX")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Quiz Data:", data);
        if (data.questions) {
          setQuizData(data.questions); 
        } else {
          console.error("Invalid data format: Missing 'questions' array.");
        }
      })
      .catch((error) => console.error("Error fetching quiz data:", error));
  }, []);

  const handleAnswerSelection = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const correctAnswer = quizData[currentQuestion].options.find((ans) => ans.is_correct);
    if (selectedAnswer === correctAnswer?.description) {
      setScore(score + 1);
    }
    setSelectedAnswer(null);

    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <motion.div className="quiz-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {showResult ? (
        <motion.div className="result-container" initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
          <h2>Quiz Completed!</h2>
          <p>Your Score: {score} / {quizData.length}</p>
        </motion.div>
      ) : quizData.length > 0 ? (
        <motion.div className="question-container" initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
          <h2>{quizData[currentQuestion].description}</h2> 

          <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {quizData[currentQuestion].options.map((option, index) => (
              <motion.li
                key={index}
                className={selectedAnswer === option.description ? "selected" : ""}
                onClick={() => handleAnswerSelection(option.description)} 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {option.description} 
              </motion.li>
            ))}
          </motion.ul>

          <motion.button 
            onClick={handleNextQuestion} 
            disabled={!selectedAnswer} 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {currentQuestion + 1 === quizData.length ? "Finish Quiz" : "Next Question"}
          </motion.button>
        </motion.div>
      ) : (
        <p>Loading quiz...</p>
      )}
    </motion.div>
  );
};

export default QuizApp;
