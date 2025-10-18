import { useState } from "react";

const LoginForm = ({ onLogin, onToggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="auth-form">
      <h2 style={{ marginBottom: "1.5rem" }}>Login</h2>
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
      <button type="button" className="btn" onClick={handleSubmit}>
        Login
      </button>
      <div className="auth-toggle">
        Don't have an account?{" "}
        <button type="button" onClick={onToggleForm}>
          Register
        </button>
      </div>
    </div>
  );
};
export default LoginForm;
