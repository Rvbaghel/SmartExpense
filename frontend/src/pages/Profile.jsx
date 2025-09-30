import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import Loader from "../components/Loader";
import { API_URL } from "../config";
import { useTheme } from "../context/ThemeContext";

const Profile = () => {
  const { user } = useUser();
  const { isDarkMode } = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setLoading(true);
        try {
          const res = await fetch(`${API_URL}/auth/profile/${user.id}`);
          const data = await res.json();
          setUserData(data);
        } catch (err) {
          console.error("Error fetching profile:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-yellow-100 dark:bg-yellow-900 border rounded-lg shadow p-6">
          <i className="bi bi-person-x text-6xl mb-4 text-yellow-500"></i>
          <h5 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
            Authentication Required
          </h5>
          <p className="text-yellow-700 dark:text-yellow-300">
            Please login to view your profile information.
          </p>
        </div>
      </div>
    );
  }

  if (loading) return <Loader />;

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-blue-100 dark:bg-blue-900 border rounded-lg shadow p-6">
          <i className="bi bi-exclamation-circle text-6xl mb-4 text-blue-500"></i>
          <h5 className="font-semibold mb-2 text-blue-800 dark:text-blue-200">
            No Profile Data
          </h5>
          <p className="text-blue-700 dark:text-blue-300">
            Unable to load profile information at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"} min-h-screen px-4 py-12 transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2">My Profile</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          {/* Profile Picture */}
          <div className="text-center mb-6">
            <div className="bg-blue-600 dark:bg-blue-500 rounded-full w-20 h-20 flex items-center justify-center text-white text-4xl mx-auto">
              <i className="bi bi-person-circle"></i>
            </div>
            <h4 className="mt-3 mb-1 text-xl font-semibold">{userData.username || "User"}</h4>
            <span className="px-3 py-1 text-sm bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-200 rounded-full">Active Account</span>
          </div>

          {/* Profile Information */}
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard icon="bi-envelope" label="Email Address" value={userData.email || "Not provided"} isDarkMode={isDarkMode} />
            <InfoCard icon="bi-person" label="Username" value={userData.username || "Not provided"} isDarkMode={isDarkMode} />
            <InfoCard icon="bi-telephone" label="Phone Number" value={userData.phone || "Not provided"} isDarkMode={isDarkMode} />
            <InfoCard icon="bi-calendar-check" label="Member Since" value={userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Not available"} isDarkMode={isDarkMode} />
            {userData.bio && <InfoCard icon="bi-chat-quote" label="Bio" value={userData.bio} isDarkMode={isDarkMode} colSpan={2} />}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center border-t pt-4">
            <ActionButton icon="bi-pencil-square" text="Edit Profile" primary />
            <ActionButton icon="bi-key" text="Change Password" />
            <ActionButton icon="bi-shield-lock" text="Privacy Settings" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <StatCard icon="bi-wallet2" title="Salary Entries" subtitle="Track your income" isDarkMode={isDarkMode} />
          <StatCard icon="bi-receipt" title="Expense Records" subtitle="Manage spending" isDarkMode={isDarkMode} />
          <StatCard icon="bi-graph-up" title="Analytics" subtitle="View insights" isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};

// Reusable Info Card
const InfoCard = ({ icon, label, value, isDarkMode, colSpan = 1 }) => (
  <div className={`border rounded p-4 ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-200"} ${colSpan > 1 ? "sm:col-span-2" : ""}`}>
    <div className="flex items-center mb-2">
      <i className={`${icon} text-blue-500 me-2 text-lg`}></i>
      <strong>{label}</strong>
    </div>
    <p className="text-gray-700 dark:text-gray-200">{value}</p>
  </div>
);

// Reusable Action Button
const ActionButton = ({ icon, text, primary }) => (
  <button className={`${primary ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200"} px-4 py-2 rounded-lg flex items-center gap-2 transition-colors`}>
    <i className={`${icon} text-lg`}></i> {text}
  </button>
);

// Reusable Stat Card
const StatCard = ({ icon, title, subtitle, isDarkMode }) => (
  <div className={`flex flex-col items-center justify-center py-6 rounded-xl shadow ${isDarkMode ? "bg-gray-700 text-gray-200" : "bg-white text-gray-900"}`}>
    <i className={`${icon} text-3xl mb-2`}></i>
    <h6 className="font-semibold">{title}</h6>
    <small className="text-gray-500 dark:text-gray-400">{subtitle}</small>
  </div>
);

export default Profile;
