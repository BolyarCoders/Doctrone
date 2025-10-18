import React from "react";
import { useAppContext } from "../context/AppContext";

const ThemeToggle = () => {
  const { theme, setTheme } = useAppContext();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.body.className = `${newTheme}-theme`;
  };

  return (
    <div className="theme-toggle">
      <span>Theme:</span>
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
};
export default ThemeToggle;
