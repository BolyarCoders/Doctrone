import { AppContext, useAppContext } from "./../context/AppContext";
import { useState } from "react";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";

const Landing = () => {
  const { setIsLoggedIn } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = () => setIsLoggedIn(true);
  const handleRegister = () => setIsLoggedIn(true);

  return (
    <div className="landing">
      <h1 className="landing-header">Syndrome Diagnosis Assistant</h1>
      <p className="landing-description">
        Your intelligent companion for understanding symptoms, diagnosing
        syndromes, and receiving personalized health feedback. Get started by
        logging in or creating an account.
      </p>
      {isLogin ? (
        <LoginForm
          onLogin={handleLogin}
          onToggleForm={() => setIsLogin(false)}
        />
      ) : (
        <RegisterForm
          onRegister={handleRegister}
          onToggleForm={() => setIsLogin(true)}
        />
      )}
    </div>
  );
};
export default Landing;
