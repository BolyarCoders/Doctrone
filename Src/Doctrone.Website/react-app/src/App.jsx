import React from "react";
import { AppContext, useAppContext } from "./context/AppContext";
import { useState } from "react";
import mockUser from "./data/users";
import styles from "./styles.js";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import { useEffect } from "react";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [theme, setTheme] = useState("dark");
  const [user, setUser] = useState(mockUser);

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
        setUser,
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
