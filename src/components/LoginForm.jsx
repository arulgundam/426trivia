import React from "react";

const LoginForm = ({ username, setUsername, password, setPassword, onRegister, onLogin }) => {
  return (
    <div>
      <h1>Welcome to Trivia!</h1>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
       type = "password"
       placeholder = "Enter password"
       value = {password}
       onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={onRegister}>Register</button>
      <button onClick={onLogin}>Login</button>
    </div>
  );
};

export default LoginForm;

