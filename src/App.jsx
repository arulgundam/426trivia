import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import Profile from "./components/Profile";


const App = () => {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userData, setUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState("home"); 

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

  const goToQuiz = () => setCurrentPage("quiz");
  const goToProfile = () => setCurrentPage("profile");
  const goToHome = () => setCurrentPage("home");

  if (!loggedIn) {
    return (
      <LoginForm
        username={username}
        setUsername={setUsername}
        onRegister={handleRegister}
      />
    );
  }

  if (currentPage === "home") {
    return (
      <div>
        <h1>Welcome, {username}!</h1>
        <button onClick={goToQuiz}>Take Quiz</button>
        <button onClick={goToProfile}>Visit Profile</button>
      </div>
    );
  }

  if (currentPage === "profile") {
    return <Profile username={username} userData={userData} goToHome={goToHome} />;
  }

  if (currentPage === "quiz") {
    return currentQuestion < questions.length ? (
      <Quiz
        questions={questions}
        currentQuestion={currentQuestion}
        handleAnswer={handleAnswer}
      />
    ) : (
      <Results score={score} userData={userData} restartQuiz={restartQuiz} goToHome={goToHome} />
    );
  }

  return null;
};

export default App;
