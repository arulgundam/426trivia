import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import Profile from "./components/Profile";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Please enter a valid username and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/register", {
      method: "POST",
      headers: {"Content-Type": "application/json" },
      body: JSON.stringify({username, password}),
      });

      if(response.ok) {
        setLoggedIn(true);
    initializeUserData();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      alert("error");
    }
  
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Please enter a valid username.");
      return
    } try {
      const response = await fetch ("http://localhost:3001/login", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const { user } = await response.json();
        setUserData(user);
        setLoggedIn(true);
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      alert("Error logging in.");
    }
  };

  const fetchQuestions = async () => {
    const response = await fetch("https://opentdb.com/api.php?amount=10");
    const data = await response.json();
    setQuestions(data.results);
  };

  const handleAnswer = async (selectedAnswer) => {
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

      // backend
      try {
        const response = await fetch("http://localhost:3001/update-score", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            username, 
            points: updatedData.totalPoints 
        }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to update score on the server.");
        }
  
        console.log("Score updated successfully on the server.");
      } catch (error) {
        console.error("Error updating score:", error);
      }
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
        password={password}
        setPassword={setPassword}
        onRegister={handleRegister}
        onLogin={handleLogin}
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
