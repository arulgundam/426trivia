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
  const [difficulty, setDifficulty] = useState("");

  const initializeUserData = () => {
    const initialData = {
        totalPoints: 0,
        categoryPoints: {},
        correctAnswers: [],
    };

    // Overwrite any existing data for this username
    localStorage.setItem(username, JSON.stringify(initialData));
    setUserData(initialData);
};


  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Please enter a valid username and password.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        setLoggedIn(true);
        initializeUserData();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      alert("An error occurred during registration.");
    }
  };
  

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Please enter a valid username and password.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (response.ok) {
        const { user } = await response.json();
        setUsername(user.username);
        const savedData = localStorage.getItem(user.username);
        if (savedData) {
            setUserData(JSON.parse(savedData));
        } else {
            initializeUserData(); 
        }
        setLoggedIn(true);
      } else {
        const error = await response.json();
        alert(error.error || "Login failed.");
      }
    } catch (error) {
      alert("An error occurred during login.");
    }
  };

  const fetchQuestions = async (difficulty) => {
    const response = await fetch(`https://opentdb.com/api.php?amount=10&difficulty=${difficulty}`);
    const data = await response.json();
    setQuestions(
      data.results.map((q) => ({
        ...q,
        question: decodeHtmlEntities(q.question),
      }))
    );
    setCurrentQuestion(0);
      setScore(0);
      setCurrentPage("quiz");
  };

  const decodeHtmlEntities = (text) => {
    const parser = new DOMParser();
    return parser.parseFromString(text, "text/html").body.textContent || text;
  };

  const handleAnswer = async (selectedAnswer) => {
    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correct_answer;
    const difficulty = currentQ.difficulty;
    const category = currentQ.category;
    const points = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
  
    // Update the question with the user's answer
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestion] = {
      ...currentQ,
      userAnswer: selectedAnswer,
      isCorrect,
    };
    setQuestions(updatedQuestions);
  
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
  
      // Backend
      try {
        const response = await fetch("http://localhost:3001/update-score", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            points: updatedData.totalPoints,
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
    if (loggedIn && difficulty) fetchQuestions();
  }, [loggedIn, difficulty]);

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    fetchQuestions();
  };

  const goToQuiz = () => {setCurrentPage("quiz");}
  const goToProfile = () => setCurrentPage("profile");
  const goToHome = () => setCurrentPage("home");
  const goToDifficulty = () => setCurrentPage("selectDifficulty");
  const logout = () => {
    setUsername("");
    setPassword("");
    setLoggedIn(false);
    setUserData(null);
};

  
  const deleteAccount = async () => {
    try {
        const response = await fetch(`http://localhost:3001/username/${username}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            alert("Account successfully deleted");
            // Clear localStorage for the deleted user
            localStorage.removeItem(username);
            logout();
        } else {
            alert("Account could not be deleted");
        }
    } catch (error) {
        alert("Error occurred while deleting the account.");
    }
};

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
        <h2>Select Difficulty</h2>
        <button onClick={goToDifficulty}>Start Quiz</button>
        <button onClick={goToHome}>Home</button>
        <button onClick={goToProfile}>Profile</button>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  if (currentPage === "profile") {
    return <Profile username={username} userData={userData} goToHome={goToHome} logout={logout} deleteAccount={deleteAccount}/>;
  }

  if (currentPage === "quiz") {
    return currentQuestion < questions.length ? (
      <Quiz
        questions={questions}
        currentQuestion={currentQuestion}
        handleAnswer={handleAnswer}
      />
    ) : (
      <Results
        score={score}
        userData={userData}
        restartQuiz={() => setCurrentQuestion(0)}
        goToHome={goToHome}
        questions={questions}
      />
    );
  }

  if (currentPage === "selectDifficulty") {
    return (
      <div>
          <button onClick={() => fetchQuestions("easy")}>Easy</button>
          <button onClick={() => fetchQuestions("medium")}>Medium</button>
          <button onClick={() => fetchQuestions("hard")}>Hard</button>
        </div>
    );
  }
  

  return null;
};

export default App;
