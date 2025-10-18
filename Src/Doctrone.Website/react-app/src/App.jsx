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
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem("isLoggedIn");
    return saved === "true";
  });
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : mockUser;
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

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
