import React from "react";

const Quiz = ({ questions, currentQuestion, handleAnswer }) => {
  const question = questions[currentQuestion];

  return React.createElement(
    "div",
    null,
    React.createElement("h1", null, "Trivia Quiz"),
    React.createElement("h2", {
      dangerouslySetInnerHTML: { __html: question.question },
    }),
    question.incorrect_answers
      .concat(question.correct_answer)
      .sort(() => Math.random() - 0.5)
      .map((answer, index) =>
        React.createElement("button", {
          key: index,
          onClick: () => handleAnswer(answer),
          dangerouslySetInnerHTML: { __html: answer },
        })
      )
  );
};

export default Quiz;
