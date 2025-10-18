import { useState } from "react";

const LoginForm = ({ onLogin, onToggleForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    console.log('Attempting login with:', { email, password });

    try {
      const response = await fetch(
        `https://doctroneapi.onrender.com/Doctrone/Login?email=nigger@black&password=nigger`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Login failed. Please check your credentials.');
      }
      
      const data = await response.json();
      onLogin(data);
      
    } catch (err) {
      setError(err.message || 'An error occurred during login.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-form">
      <h2 style={{ marginBottom: '1.5rem' }}>Login</h2>
      {error && (
        <div style={{ 
          background: '#ff4444', 
          color: 'white', 
          padding: '0.75rem', 
          borderRadius: '6px', 
          marginBottom: '1rem',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      <div className="form-group">
        <label>Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>
      <button 
        type="button" 
        className="btn" 
        onClick={handleSubmit}
        disabled={isLoading || !email || !password}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
      <div className="auth-toggle">
        Don't have an account? <button type="button" onClick={onToggleForm}>Register</button>
      </div>
    </div>
  );
};

export default LoginForm;
