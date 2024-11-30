import React from "react";

const LoginForm = ({ username, setUsername, onRegister }) => {
  return (
    <div>
      <h1>Welcome to Trivia!</h1>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={onRegister}>Register</button>
    </div>
  );
};

export default LoginForm;

