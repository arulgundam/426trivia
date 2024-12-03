import React from "react";

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
    <div>
      <h2>Quiz Complete!</h2>
      <p>Your Score: {score}</p>
      <h3>Quiz Questions and Results:</h3>
      <ul>{quizResults}</ul>
      <button onClick={restartQuiz}>Play Again</button>
      <button onClick={goToHome}>Home Page</button>
    </div>
  );
};

export default Results;