import React from "react";
import "./LoginForm.css";

const LoginForm = ({ username, setUsername, password, setPassword, onRegister, onLogin }) => {
  return (
    <div  className="welcome">
      <h1 className="Welcome_message">Welcome to NAIL Trivia!</h1>
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
      <button class="buttons" onClick={onRegister}>Register</button>
      <button class="buttons" onClick={onLogin}>Login</button>
      <img className="questions" id="pic1"src={"group_of_question_marks.png"} alt="Question Marks" />
      <img className="questions" id="pic2"src={"group_of_question_marks.png"} alt="Question Marks" />
    </div>
  );
};

export default LoginForm;

