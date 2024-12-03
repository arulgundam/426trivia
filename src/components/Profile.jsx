const Profile = ({ username, userData, goToHome, logout, deleteAccount}) => {
  if (!userData) return <p>Loading profile...</p>;

  return (
    <div>
      <h1>{username}'s Profile</h1>
      <p>Total Points: {userData.totalPoints}</p>
      <h3>Category Points:</h3>
      {Object.entries(userData.categoryPoints).map(([category, points]) => (
        <p key={category}>
          {category}: {points}
        </p>
      ))}
      <button onClick={goToHome}>Go Home</button>
      <button onClick={logout}>Logout</button>
      <button onClick={deleteAccount}>DeleteAccount</button>
    </div>
  );
};

export default Profile;
