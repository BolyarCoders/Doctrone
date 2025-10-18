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
        <h3>Conversations</h3>
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
export default Sidebar;
