import React from "react";

const LoginForm = ({ username, setUsername, onRegister }) => {
  return React.createElement(
    "div",
    null,
    React.createElement("h1", null, "Welcome to Trivia!"),
    React.createElement("input", {
      type: "text",
      placeholder: "Enter username",
      value: username,
      onChange: (e) => setUsername(e.target.value),
    }),
    React.createElement(
      "button",
      { onClick: onRegister },
      "Register"
    )
  );
};

export default LoginForm;
