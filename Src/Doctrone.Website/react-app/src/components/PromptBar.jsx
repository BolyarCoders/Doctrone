import React, { useState } from "react";

const PromptBar = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="prompt-bar">
      <input
        type="text"
        className="prompt-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Describe your symptoms..."
      />
      <button className="send-btn" onClick={handleSend}>
        Send
      </button>
    </div>
  );
};
export default PromptBar;