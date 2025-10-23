import { useState } from "react";

const PromptBar = ({ onSend, disabled }) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (message.trim() && !isLoading) {
      setIsLoading(true);
      try {
        await onSend(message);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
      }
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
        disabled={isLoading || disabled}
      />
      <button
        className="send-btn"
        onClick={handleSend}
        disabled={isLoading || disabled || !message.trim()}
      >
        {isLoading && <span className="loading-spinner"></span>}
        {isLoading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};
export default PromptBar;
