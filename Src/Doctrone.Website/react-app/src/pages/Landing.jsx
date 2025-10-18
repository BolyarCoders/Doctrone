import { AppContext, useAppContext } from "./../context/AppContext";
import { useState } from "react";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";

const Landing = () => {
  const { setIsLoggedIn, setUser } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  
  const handleLogin = () => setIsLoggedIn(true);
  
  const handleRegister = (formData) => {
    setUser({
      name: formData.name,
      email: formData.email,
      bloodType: formData.bloodType,
      age: parseInt(formData.age),
      gender: formData.gender,
      specialDiagnosis: formData.specialDiagnosis || 'None',
      theme: 'dark'
    });
    setIsLoggedIn(true);
  };
  
  return (
    <div className="landing">
      <h1 className="landing-header">Doctrone</h1>
      <p className="landing-description">
        Your intelligent companion for understanding symptoms, diagnosing syndromes, 
        and receiving personalized health feedback. Get started by logging in or creating an account.
      </p>
      {isLogin ? (
        <LoginForm onLogin={handleLogin} onToggleForm={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onRegister={handleRegister} onToggleForm={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default Landing;
