import React from "react";

const Profile = ({ username, userData, goToHome }) => {
  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Username:</strong> {username}</p>
      <p><strong>Total Points:</strong> {userData.totalPoints}</p>
      <h3>Category Points:</h3>
      <ul>
        {Object.entries(userData.categoryPoints).map(([category, points]) => (
          <li key={category}>
            {category}: {points} points
          </li>
        ))}
      </ul>
      <button onClick={goToHome}>Home Page</button>
    </div>
  );
};

export default Profile;