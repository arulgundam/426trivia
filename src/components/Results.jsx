import React from "react";
import "./Results.css";

const Results = ({ score, userData, restartQuiz, goToHome, questions }) => {
  if (!questions || questions.length === 0) {
    return <p>No results available.</p>; // Fallback in case questions data is missing
  }

  const categoryPoints = Object.entries(userData.categoryPoints).map(
    ([category, points]) => (
      <li key={category}>{`${category}: ${points}`}</li>
    )
  );

  const quizResults = questions.map((question, index) => (
    <li key={index}>
      <p dangerouslySetInnerHTML={{ __html: question.question }}></p>
      <p>
        Your Answer:{" "}
        <span
          dangerouslySetInnerHTML={{
            __html: question.userAnswer || "Not answered",
          }}
        />
      </p>
      <p>
      {question.isCorrect ? (
        "✅ Correct"
      ) : (
        <>
          ❌ Wrong! Correct Answer: <span dangerouslySetInnerHTML={{ __html: question.correct_answer }} />
      </>
      )}
      </p>
    </li>
  ));

  return (
    <div className="results">
      <h2 className="complete">Quiz Complete!</h2>
      <p className="your_score">Your Score: {score}</p>
      <h3>Quiz Questions and Results:</h3>
      <ul className="done">{quizResults}</ul>
      <button className="more_buttons" id="again" onClick={restartQuiz}>Play Again</button>
      <button className="more_buttons" id="my_home" onClick={goToHome}>Home Page</button>
    </div>
  );
};

export default Results;