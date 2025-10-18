import { useState } from "react";

const RegisterForm = ({ onRegister, onToggleForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bloodType: "",
    age: "",
    gender: "",
    specialDiagnosis: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
  };

  return (
    <div className="auth-form">
      <h2 style={{ marginBottom: "1.5rem" }}>Register</h2>
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          required
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Blood Type</label>
          <select
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div className="form-group">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="25"
            min="1"
            max="120"
            required
          />
        </div>
      </div>
      <div className="form-group">
        <label>Gender</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>
      <div className="form-group">
        <label>Special Diagnosis (Optional)</label>
        <input
          type="text"
          name="specialDiagnosis"
          value={formData.specialDiagnosis}
          onChange={handleChange}
          placeholder="e.g., Diabetes, Hypertension"
        />
      </div>
      <button type="button" className="btn" onClick={handleSubmit}>
        Register
      </button>
      <div className="auth-toggle">
        Already have an account?{" "}
        <button type="button" onClick={onToggleForm}>
          Login
        </button>
      </div>
    </div>
  );
};
export default RegisterForm;
