import React from "react";

const Quiz = ({ questions, currentQuestion, handleAnswer }) => {
  const question = questions[currentQuestion];

  return (
    <div>
      <h1>Trivia Quiz</h1>
      <h2 dangerouslySetInnerHTML={{ __html: question.question }}></h2>
      {question.incorrect_answers
        .concat(question.correct_answer)
        .sort(() => Math.random() - 0.5)
        .map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(answer)}
            dangerouslySetInnerHTML={{ __html: answer }}
          ></button>
        ))}
    </div>
  );
};

export default Quiz;

