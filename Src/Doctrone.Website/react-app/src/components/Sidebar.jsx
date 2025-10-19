const Sidebar = ({
  isCollapsed,
  onToggle,
  prescriptions,
  selectedId,
  onSelect,
  onNewChat,
}) => {
  const activePrescriptions = prescriptions.filter(
    (p) => p.status === "active"
  );
  const otherPrescriptions = prescriptions.filter((p) => p.status === "other");

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {/* SVG icon placeholder - user will insert later */}
          📋
        </div>
        <button className="sidebar-toggle" onClick={onToggle}>
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      <div className="sidebar-section">
        <div className="section-header">
          <h4 className="section-title">All Prescriptions</h4>
          <button className="new-chat-btn" onClick={onNewChat}>
            + New
          </button>
        </div>
        {prescriptions.map((p) => (
          <div
            key={p.id}
            className={`prescription-item ${
              selectedId === p.id ? "active" : ""
            }`}
            onClick={() => onSelect(p.id)}
          >
            {p.title}
          </div>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="section-header">
          <h4 className="section-title">Active Prescriptions</h4>
        </div>
        {activePrescriptions.map((p) => (
          <div
            key={p.id}
            className={`prescription-item ${
              selectedId === p.id ? "active" : ""
            }`}
            onClick={() => onSelect(p.id)}
          >
            {p.title}
          </div>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="section-header">
          <h4 className="section-title">Other Prescriptions</h4>
          <button className="new-chat-btn" onClick={onNewChat}>
            + New
          </button>
        </div>
        {otherPrescriptions.map((p) => (
          <div
            key={p.id}
            className={`prescription-item ${
              selectedId === p.id ? "active" : ""
            }`}
            onClick={() => onSelect(p.id)}
          >
            {p.title}
          </div>
        ))}
      </div>
    </div>
  );
};

// Prompt Bar Component
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
        {isLoading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default Sidebar;
