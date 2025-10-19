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
    
    try {
      const response = await fetch(
        `https://doctroneapi.onrender.com/Doctrone/Login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
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

// Register Form Component
const RegisterForm = ({ onRegister, onToggleForm }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bloodType: '',
    age: '',
    gender: '',
    specialDiagnosis: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('https://doctroneapi.onrender.com/Doctrone/Register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          pass: formData.password,
          bloodType: formData.bloodType,
          age: parseInt(formData.age),
          gender: formData.gender,
          specialDiagnosis: formData.specialDiagnosis || 'None'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed. Please try again.');
      }
      
      const data = await response.json();
      
      // Pass the email to fetch full user data
      onRegister({ email: formData.email });
      
    } catch (err) {
      setError(err.message || 'An error occurred during registration.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-form">
      <h2 style={{ marginBottom: '1.5rem' }}>Register</h2>
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
        <label>Full Name</label>
        <input 
          type="text"
          name="name"
          value={formData.name} 
          onChange={handleChange}
          placeholder="John Doe"
          required
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Blood Type</label>
          <select name="bloodType" value={formData.bloodType} onChange={handleChange} required disabled={isLoading}>
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
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Gender</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required disabled={isLoading}>
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
          disabled={isLoading}
        />
      </div>
      <button 
        type="button" 
        className="btn" 
        onClick={handleSubmit}
        disabled={isLoading || !formData.name || !formData.email || !formData.password || !formData.bloodType || !formData.age || !formData.gender}
      >
        {isLoading ? 'Registering...' : 'Register'}
      </button>
      <div className="auth-toggle">
        Already have an account? <button type="button" onClick={onToggleForm}>Login</button>
      </div>
    </div>
  );
};

// Helper function to parse markdown-style bold text
const parseMarkdown = (text) => {
  // Replace **text** with <strong>text</strong>
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index}>{boldText}</strong>;
    }
    return part;
  });
};

export default LoginForm;
