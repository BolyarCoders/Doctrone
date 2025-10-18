import { useState } from "react";

const RegisterForm = ({ onRegister, onToggleForm }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister();
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: "1.5rem" }}>Register</h2>
      <div className="form-group">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      <button type="submit" className="btn">
        Register
      </button>
      <div className="auth-toggle">
        Already have an account?{" "}
        <button type="button" onClick={onToggleForm}>
          Login
        </button>
      </div>
    </form>
  );
};
export default RegisterForm;
