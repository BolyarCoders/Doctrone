import React from "react";
import { useAppContext } from "../context/AppContext";
import ThemeToggle from "../components/ThemeToggle.jsx";
import mockMedications from "../data/medications.js";
import { useState } from "react";

const Profile = () => {
  const { user, setUser, setCurrentPage, setIsLoggedIn } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.email) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://doctroneapi.onrender.com/Doctrone/GetUserIdByEmail?email=${encodeURIComponent(
            user.email
          )}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();

        if (data && data.length > 0) {
          const userData = data[0];
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            bloodType: userData.blood_type,
            age: userData.age,
            gender: userData.gender,
            specialDiagnosis: userData.special_diagnosis || "None",
            theme: user.theme || "dark",
          });
        }
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Profile fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage("dashboard");
  };

  if (isLoading) {
    return (
      <div className="profile">
        <h1 className="profile-header">Profile</h1>
        <div className="empty-state">
          <span
            className="loading-spinner"
            style={{
              display: "block",
              margin: "0 auto 1rem",
              width: "40px",
              height: "40px",
              border: "4px solid rgba(19, 167, 124, 0.3)",
              borderTopColor: "var(--accent-colour)",
            }}
          ></span>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile">
        <h1 className="profile-header">Profile</h1>
        <div className="empty-state" style={{ color: "#ff4444" }}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile">
      <div style={{ marginBottom: "2rem" }}>
        <a className="back-link" onClick={() => setCurrentPage("dashboard")}>
          ← Back to Dashboard
        </a>
      </div>

      <h1 className="profile-header">Profile</h1>

      <div className="profile-section">
        <h3>Personal Information</h3>
        <div className="profile-info">
          <div className="info-item">
            <div className="info-label">Name</div>
            <div className="info-value">{user.name}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Email</div>
            <div className="info-value">{user.email}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Blood Type</div>
            <div className="info-value">{user.bloodType}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Age</div>
            <div className="info-value">{user.age} years</div>
          </div>
          <div className="info-item">
            <div className="info-label">Gender</div>
            <div className="info-value">{user.gender}</div>
          </div>
          <div className="info-item">
            <div className="info-label">Special Diagnosis</div>
            <div className="info-value">{user.specialDiagnosis}</div>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h3>Theme Settings</h3>
        <ThemeToggle />
      </div>

      <div className="profile-section">
        <h3>Current Medications</h3>
        <ul className="medication-list">
          {mockMedications.map((med) => (
            <li key={med.id} className="medication-item">
              <div className="medication-name">{med.name}</div>
              <p>
                <strong>Dosage:</strong> {med.dosage}
              </p>
              <p>
                <strong>Frequency:</strong> {med.frequency}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="profile-section">
        <h3>Account Actions</h3>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
