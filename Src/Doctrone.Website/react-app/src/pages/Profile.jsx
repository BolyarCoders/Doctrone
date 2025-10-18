import React from "react";
import { useAppContext } from "../context/AppContext";
import ThemeToggle from "../components/ThemeToggle.jsx";
import mockMedications from "../data/medications.js";

const Profile = () => {
  const { user, setCurrentPage } = useAppContext();

  return (
    <div className="profile">
      <div style={{ marginBottom: "2rem" }}>
        <button
          className="nav-link"
          onClick={() => setCurrentPage("dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>

      <h1 className="profile-header">Profile</h1>

      <div className="profile-section">
        <h3>Personal Information</h3>
        <div className="profile-info">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
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
    </div>
  );
};
export default Profile;
