import React from "react";

const Results = ({ score, userData, restartQuiz }) => {
  const categoryPoints = Object.entries(userData.categoryPoints).map(
    ([category, points]) =>
      React.createElement("li", { key: category }, `${category}: ${points}`)
  );

  const correctAnswers = userData.correctAnswers.map((answer, index) =>
    React.createElement(
      "li",
      { key: index },
      `${answer.category}: `,
      React.createElement("span", {
        dangerouslySetInnerHTML: { __html: answer.question },
      })
    )
  );

  return React.createElement(
    "div",
    null,
    React.createElement("h2", null, "Quiz Complete!"),
    React.createElement("p", null, `Your Score: ${score}`),
    React.createElement("h3", null, "Total Points: ", userData.totalPoints),
    React.createElement("h3", null, "Points by Category:"),
    React.createElement("ul", null, categoryPoints),
    React.createElement("h3", null, "Correct Answers:"),
    React.createElement("ul", null, correctAnswers),
    React.createElement(
      "button",
      { onClick: restartQuiz },
      "Play Again"
    )
  );
};

export default Results;
