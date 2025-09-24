import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

const Profile = () => {
  const { user } = useUser(); // get logged-in user from context
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/auth/profile/${user.id}`)
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [user]);

  if (!user) {
    return <p className="text-center mt-5">Please login to view profile</p>;
  }

  if (!userData) {
    return <p className="text-center mt-5">Loading profile...</p>;
  }

  return (
    <div className="container mt-5">
      <h2>Profile</h2>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Username:</strong> {userData.username}</p>
      <p><strong>Phone:</strong> {userData.phone}</p>
      <p><strong>Bio:</strong> {userData.bio}</p>
    </div>
  );
};

export default Profile;
