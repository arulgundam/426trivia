import React from "react";

const Results = ({ score, userData, restartQuiz }) => {
  const categoryPoints = Object.entries(userData.categoryPoints).map(
    ([category, points]) => (
      <li key={category}>{`${category}: ${points}`}</li>
    )
  );

  const correctAnswers = userData.correctAnswers.map((answer, index) => (
    <li key={index}>
      {`${answer.category}: `}
      <span dangerouslySetInnerHTML={{ __html: answer.question }}></span>
    </li>
  ));

  return (
    <div>
      <h2>Quiz Complete!</h2>
      <p>Your Score: {score}</p>
      <h3>Total Points: {userData.totalPoints}</h3>
      <h3>Points by Category:</h3>
      <ul>{categoryPoints}</ul>
      <h3>Correct Answers:</h3>
      <ul>{correctAnswers}</ul>
      <button onClick={restartQuiz}>Play Again</button>
    </div>
  );
};

export default Results;
