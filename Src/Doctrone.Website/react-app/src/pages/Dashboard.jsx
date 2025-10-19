import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import Sidebar from "../components/Sidebar.jsx";
import PromptBar from "../components/PromptBar.jsx";
import logo from "../assets/doctrone-logo.png";

const Dashboard = () => {
  const { setCurrentPage, user } = useAppContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [folders, setFolders] = useState([]);
  const [defaultFolderId, setDefaultFolderId] = useState(null);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  const selectedPrescription = prescriptions.find(
    (p) => p.id === selectedPrescriptionId
  );

  useEffect(() => {
    // Initialize default folder on mount
    if (folders.length === 0) {
      const defaultFolder = { id: "default", name: "Default Folder" };
      setFolders([defaultFolder]);
      setDefaultFolderId(defaultFolder.id);
    }
  }, []);

  const handleNewChat = () => {
    const newId = Date.now();
    const newPrescription = {
      id: newId,
      title: `New Consultation ${prescriptions.length + 1}`,
      folderId: defaultFolderId,
      status: "active",
      messages: [],
    };
    setPrescriptions([newPrescription, ...prescriptions]);
    setSelectedPrescriptionId(newId);
  };

  const handleCreateFolder = () => {
    const folderName = prompt("Enter new folder name:");
    if (!folderName?.trim()) return;

    const newFolder = { id: Date.now(), name: folderName };
    setFolders((prev) => [...prev, newFolder]);
  };

  const handleSendMessage = async (message) => {
    if (!user?.id) {
      console.error("No user ID available");
      return;
    }

    const userMessage = { role: "user", content: message };

    // Add userMessage once
    setPrescriptions((prev) =>
      prev.map((p) =>
        p.id === selectedPrescriptionId
          ? { ...p, messages: [...p.messages, userMessage] }
          : p
      )
    );

    setIsLoadingResponse(true);

    try {
      const response = await fetch("https://doctrone.onrender.com/new_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, user_id: user.id }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const assistantMessage = {
        role: "assistant",
        content: data.response || "No response received.",
      };

      // Only append assistantMessage
      setPrescriptions((prev) =>
        prev.map((p) =>
          p.id === selectedPrescriptionId
            ? {
                ...p,
                chat_id: data.chat_id || p.chat_id,
                messages: [...p.messages, assistantMessage],
              }
            : p
        )
      );
    } catch (error) {
      console.error("Error calling API:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
      };
      setPrescriptions((prev) =>
        prev.map((p) =>
          p.id === selectedPrescriptionId
            ? { ...p, messages: [...p.messages, errorMessage] }
            : p
        )
      );
    } finally {
      setIsLoadingResponse(false);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        prescriptions={prescriptions}
        folders={folders}
        selectedId={selectedPrescriptionId}
        onSelect={setSelectedPrescriptionId}
        onNewChat={handleNewChat}
        onCreateFolder={handleCreateFolder}
      />

      <div className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
        <div className="top-bar">
          {sidebarCollapsed && (
            <button
              className="toggle-sidebar-btn"
              onClick={() => setSidebarCollapsed(false)}
            >
              ☰ Menu
            </button>
          )}
          <div style={{ flex: 1 }}></div>
          <button
            className="profile-btn"
            onClick={() => setCurrentPage("profile")}
            title="Profile"
          >
            👤
          </button>
        </div>

        <div className="conversation-container">
          {selectedPrescription ? (
            <div className="conversation">
              <h2 className="conversation-header">
                {selectedPrescription.title}
              </h2>
              {selectedPrescription.messages.length > 0 ? (
                selectedPrescription.messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.role}`}>
                    <div className="message-role">
                      {msg.role === "user" ? "You" : "Assistant"}
                    </div>
                    <p>{msg.content}</p>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>
                    Start a new conversation to diagnose syndromes and get
                    health feedback.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <p>Select a conversation from the sidebar</p>
            </div>
          )}
        </div>

        <PromptBar onSend={handleSendMessage} disabled={isLoadingResponse} />
      </div>
    </div>
  );
};

export default Dashboard;
