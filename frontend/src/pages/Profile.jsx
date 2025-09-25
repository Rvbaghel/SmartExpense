import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import CountdownLoader from "../components/CountdownLoader";

const Profile = () => {
  const { user } = useUser(); 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setLoading(true);
        try {
          const res = await fetch(`http://localhost:5000/auth/profile/${user.id}`);
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
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="alert alert-warning border-0 shadow-sm">
              <i className="bi bi-person-x fs-1 text-warning mb-3 d-block"></i>
              <h5>Authentication Required</h5>
              <p className="mb-0">Please login to view your profile information.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <CountdownLoader seconds={10} />;
  }

  if (!userData) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="alert alert-info border-0 shadow-sm">
              <i className="bi bi-exclamation-circle fs-1 text-info mb-3 d-block"></i>
              <h5>No Profile Data</h5>
              <p className="mb-0">Unable to load profile information at this time.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Profile Header */}
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">My Profile</h2>
            <p className="text-muted">Manage your account information</p>
          </div>

          {/* Profile Card */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              {/* Profile Picture Placeholder */}
              <div className="text-center mb-4">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white" style={{width: '80px', height: '80px', fontSize: '2rem'}}>
                  <i className="bi bi-person-circle"></i>
                </div>
                <h4 className="mt-3 mb-1">{userData.username || 'User'}</h4>
                <span className="badge bg-success">Active Account</span>
              </div>

              {/* Profile Information */}
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-envelope text-primary me-3"></i>
                      <strong>Email Address</strong>
                    </div>
                    <p className="text-muted mb-0">{userData.email || 'Not provided'}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-person text-primary me-3"></i>
                      <strong>Username</strong>
                    </div>
                    <p className="text-muted mb-0">{userData.username || 'Not provided'}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-telephone text-primary me-3"></i>
                      <strong>Phone Number</strong>
                    </div>
                    <p className="text-muted mb-0">{userData.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="border rounded p-3 h-100">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-calendar-check text-primary me-3"></i>
                      <strong>Member Since</strong>
                    </div>
                    <p className="text-muted mb-0">
                      {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Not available'}
                    </p>
                  </div>
                </div>

                {userData.bio && (
                  <div className="col-12">
                    <div className="border rounded p-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-chat-quote text-primary me-3"></i>
                        <strong>Bio</strong>
                      </div>
                      <p className="text-muted mb-0">{userData.bio}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-top">
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                  <button className="btn btn-primary">
                    <i className="bi bi-pencil-square me-2"></i>
                    Edit Profile
                  </button>
                  <button className="btn btn-outline-secondary">
                    <i className="bi bi-key me-2"></i>
                    Change Password
                  </button>
                  <button className="btn btn-outline-danger">
                    <i className="bi bi-shield-lock me-2"></i>
                    Privacy Settings
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="row mt-4 g-3">
            <div className="col-md-4">
              <div className="card border-0 bg-light text-center py-3">
                <div className="card-body">
                  <i className="bi bi-currency-dollar text-primary fs-2"></i>
                  <h6 className="mt-2 mb-0">Salary Entries</h6>
                  <small className="text-muted">Track your income</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 bg-light text-center py-3">
                <div className="card-body">
                  <i className="bi bi-receipt text-success fs-2"></i>
                  <h6 className="mt-2 mb-0">Expense Records</h6>
                  <small className="text-muted">Manage spending</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 bg-light text-center py-3">
                <div className="card-body">
                  <i className="bi bi-graph-up text-warning fs-2"></i>
                  <h6 className="mt-2 mb-0">Analytics</h6>
                  <small className="text-muted">View insights</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;