import React, { useState } from "react";

const Quiz = ({ questions, currentQuestion, handleAnswer }) => {
  const question = questions[currentQuestion];
  const [feedback, setFeedback] = useState(null); // Feedback for the current question

  const handleAnswerClick = (selectedAnswer) => {
    const isCorrect = selectedAnswer === question.correct_answer;
    setFeedback(isCorrect ? "Correct!" : `Wrong! The correct answer was: ${question.correct_answer}`);
    handleAnswer(selectedAnswer); // Call parent handler for logic
  };

  const progressTracker = `${currentQuestion + 1}/${questions.length} Questions Correct: ${
    questions.slice(0, currentQuestion).filter((q, idx) => q.correct_answer === questions[idx]?.userAnswer).length
  }`;

  return (
    <div>
      <h1>Trivia Quiz</h1>
      <h3>Difficulty: {question.difficulty}</h3>
      <h2 dangerouslySetInnerHTML={{ __html: question.question }}></h2>
      {question.incorrect_answers
        .concat(question.correct_answer)
        .sort(() => Math.random() - 0.5)
        .map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(answer)}
            dangerouslySetInnerHTML={{ __html: answer }}
          ></button>
        ))}
      {feedback && <p>{feedback}</p>}
      <p>{progressTracker}</p>
    </div>
  );
};

export default Quiz;
