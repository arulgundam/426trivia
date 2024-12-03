import "./Profile.css";

const Profile = ({ username, userData, goToHome, logout, deleteAccount}) => {
  if (!userData) return <p>Loading profile...</p>;

  return (
    <div className="profile">
      <h1 className="my_profile">{username}'s Profile</h1>
      <p className="total">Total Points: {userData.totalPoints}</p>
      <h3>Category Points:</h3>
      {Object.entries(userData.categoryPoints).map(([category, points]) => (
        <p key={category}>
          {category}: {points}
        </p>
      ))}
      <button className="buttons" id="home"onClick={goToHome}>Go Home</button>
      <button className="buttons" id="logout"onClick={logout}>Logout</button>
      <button className="buttons" id="delete"onClick={deleteAccount}>DeleteAccount</button>
    </div>
  );
};

export default Profile;

