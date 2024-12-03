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
      <div>
      <button className="button" id="home"onClick={goToHome}>Go Home</button>
      <button className="button" id="logout"onClick={logout}>Logout</button>
      <button className="button" id="delete"onClick={deleteAccount}>DeleteAccount</button>
      </div>
    </div>
  );
};

export default Profile;

