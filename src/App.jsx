import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import Quiz from "./components/Quiz";
import Results from "./components/Results";

const App = () => {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userData, setUserData] = useState(null);

  const initializeUserData = () => {
    const data = JSON.parse(localStorage.getItem(username));
    if (data) {
      setUserData(data);
    } else {
      const initialData = {
        totalPoints: 0,
        categoryPoints: {},
        correctAnswers: [],
      };
      localStorage.setItem(username, JSON.stringify(initialData));
      setUserData(initialData);
    }
  };

  const handleRegister = () => {
    if (!username.trim()) {
      alert("Please enter a valid username.");
      return;
    }
    setLoggedIn(true);
    initializeUserData();
  };

  const fetchQuestions = async () => {
    const response = await fetch("https://opentdb.com/api.php?amount=10");
    const data = await response.json();
    setQuestions(data.results);
  };

  const handleAnswer = (selectedAnswer) => {
    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correct_answer;
    const difficulty = currentQ.difficulty;
    const category = currentQ.category;
    const points = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;

    if (isCorrect) {
      const updatedData = {
        ...userData,
        totalPoints: userData.totalPoints + points,
        categoryPoints: {
          ...userData.categoryPoints,
          [category]: (userData.categoryPoints[category] || 0) + points,
        },
        correctAnswers: [
          ...userData.correctAnswers,
          { category, question: currentQ.question },
        ],
      };

      setUserData(updatedData);
      localStorage.setItem(username, JSON.stringify(updatedData));
      setScore(score + points);
    }

    setCurrentQuestion(currentQuestion + 1);
  };

  useEffect(() => {
    if (loggedIn) fetchQuestions();
  }, [loggedIn]);

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    fetchQuestions();
  };

  return (
    <div>
      {!loggedIn ? (
        <LoginForm
          username={username}
          setUsername={setUsername}
          onRegister={handleRegister}
        />
      ) : currentQuestion < questions.length ? (
        <Quiz
          questions={questions}
          currentQuestion={currentQuestion}
          handleAnswer={handleAnswer}
        />
      ) : (
        <Results score={score} userData={userData} restartQuiz={restartQuiz} />
      )}
    </div>
  );
};

export default App;
