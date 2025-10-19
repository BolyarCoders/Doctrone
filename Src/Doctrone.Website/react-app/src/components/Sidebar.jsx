import logo from "../assets/doctrone-logo.png";
import { useState } from "react";

const Sidebar = ({
  isCollapsed,
  onToggle,
  folders,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onCreateFolder,
  userId,
  logo,
}) => {
  const [expandedFolders, setExpandedFolders] = useState({});

  const toggleFolder = (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo" title="Doctrone - AI Medical Assistant">
          {logo ? (
            <img src={logo} alt="Doctrone Logo" style={{ width: "40px" }} />
          ) : (
            "🏥"
          )}
        </div>
        <button className="sidebar-toggle" onClick={onToggle}>
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      <div className="sidebar-content">
        <button
          className="new-chat-btn"
          style={{ width: "100%", marginBottom: "1rem" }}
          onClick={onNewChat}
        >
          + New Chat
        </button>

        {folders.map((folder) => (
          <div key={folder.id} className="folder-section">
            <div
              className="folder-header"
              onClick={() => toggleFolder(folder.id)}
            >
              <div className="folder-name">📁 {folder.name}</div>
              <span className="folder-toggle">
                {expandedFolders[folder.id] ? "▼" : "▶"}
              </span>
            </div>

            {expandedFolders[folder.id] && (
              <div className="folder-chats">
                {folder.chats && folder.chats.length > 0 ? (
                  folder.chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`prescription-item ${
                        selectedChatId === chat.id ? "active" : ""
                      }`}
                      onClick={() => onSelectChat(chat)}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>{chat.title}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "0.5rem",
                      opacity: 0.6,
                      fontSize: "12px",
                    }}
                  >
                    No chats yet
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <button className="add-folder-btn" onClick={onCreateFolder}>
          + Add Folder
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
