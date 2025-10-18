import React from "react";
import { AppContext, useAppContext } from "./context/AppContext";
import { useState } from "react";
import "./App.css";
import mockUser from "./data/users";
import styles from "./styles.js";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [theme, setTheme] = useState("dark");
  const [user] = useState(mockUser);

  React.useEffect(() => {
    document.body.className = `${theme}-theme`;
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        currentPage,
        setCurrentPage,
        theme,
        setTheme,
        user,
      }}
    >
      <style>{styles}</style>
      {!isLoggedIn ? (
        <Landing />
      ) : currentPage === "dashboard" ? (
        <Dashboard />
      ) : (
        <Profile />
      )}
    </AppContext.Provider>
  );
};

export default App;
