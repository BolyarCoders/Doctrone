import { AppContext, useAppContext } from "./../context/AppContext";
import { useState } from "react";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";

const Landing = () => {
  const { setIsLoggedIn, setUser } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async (userData) => {
    // Fetch full user profile after login
    try {
      const response = await fetch(
        `https://doctroneapi.onrender.com/Doctrone/GetUserIdByEmail?email=${encodeURIComponent(
          userData.email
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const user = data[0];
          setUser({
            id: user.id,
            name: user.name,
            email: user.email,
            bloodType: user.blood_type,
            age: user.age,
            gender: user.gender,
            specialDiagnosis: user.special_diagnosis || "None",
            theme: "dark",
          });
        }
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }

    setIsLoggedIn(true);
  };

  const handleRegister = async (userData) => {
    // Fetch full user profile after registration
    try {
      const response = await fetch(
        `https://doctroneapi.onrender.com/Doctrone/GetUserIdByEmail?email=${encodeURIComponent(
          userData.email
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const user = data[0];
          setUser({
            id: user.id,
            name: user.name,
            email: user.email,
            bloodType: user.blood_type,
            age: user.age,
            gender: user.gender,
            specialDiagnosis: user.special_diagnosis || "None",
            theme: "dark",
          });
        }
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }

    setIsLoggedIn(true);
  };

  return (
    <div className="landing">
      <h1 className="landing-header">Doctrone</h1>
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
