import { useState } from "react";
import logo from "../assets/doctrone-logo.png";

const Sidebar = ({
  isCollapsed,
  onToggle,
  prescriptions,
  folders,
  selectedId,
  onSelect,
  onNewChat,
  onCreateFolder,
}) => {
  const [expandedFolders, setExpandedFolders] = useState({});

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo" title="Doctrone - AI Medical Assistant">
          <img src={logo} alt="Doctrone Logo" className="logo-image" />
        </div>
        <button className="sidebar-toggle" onClick={onToggle}>
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      <div className="sidebar-section">
        <div className="section-header">
          <h4 className="section-title">All Conversations</h4>
          <button className="new-chat-btn" onClick={onNewChat}>
            + New
          </button>
          <button className="add-folder-btn" onClick={onCreateFolder}>
            + Folder
          </button>
        </div>

        {folders.map((folder) => (
          <div key={folder.id} className="folder-section">
            <div
              className="folder-header"
              onClick={() => toggleFolder(folder.id)}
            >
              <span>{folder.name}</span>
              <span>{expandedFolders[folder.id] ? "▼" : "▶"}</span>
            </div>
            {expandedFolders[folder.id] && (
              <div className="folder-chats">
                {prescriptions
                  .filter((p) => p.folderId === folder.id)
                  .map((p) => (
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
            )}
          </div>
        ))}

        {/* Show folder-less chats in Default Folder */}
        {folders.length > 0 &&
          prescriptions
            .filter((p) => !p.folderId || p.folderId === "default")
            .map((p) => (
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
