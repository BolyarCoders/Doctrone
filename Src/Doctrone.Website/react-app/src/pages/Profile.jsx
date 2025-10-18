import React from "react";
import { useAppContext } from "../context/AppContext";
import ThemeToggle from "../components/ThemeToggle.jsx";
import mockMedications from "../data/medications.js";

const Profile = () => {
  const { user, setCurrentPage } = useAppContext();
  
  return (
    <div className="profile">
      <div style={{ marginBottom: '2rem' }}>
        <a className="back-link" onClick={() => setCurrentPage('dashboard')}>
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
          {mockMedications.map(med => (
            <li key={med.id} className="medication-item">
              <div className="medication-name">{med.name}</div>
              <p><strong>Dosage:</strong> {med.dosage}</p>
              <p><strong>Frequency:</strong> {med.frequency}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Profile;
