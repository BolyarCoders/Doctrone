import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import Sidebar from "../components/Sidebar.jsx";
import mockPrescriptions from "../data/prescriptions.js";

const Dashboard = () => {
  const { currentPage, setCurrentPage } = useAppContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(1);
  const [prescriptions, setPrescriptions] = useState(mockPrescriptions);

  const selectedPrescription = prescriptions.find(
    (p) => p.id === selectedPrescriptionId
  );

  const handleNewChat = () => {
    const newId = Math.max(...prescriptions.map((p) => p.id)) + 1;
    const newPrescription = {
      id: newId,
      title: `New Consultation ${newId}`,
      status: "active",
      messages: [],
    };
    setPrescriptions([...prescriptions, newPrescription]);
    setSelectedPrescriptionId(newId);
  };

  return (
    <div className="dashboard">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        prescriptions={prescriptions}
        selectedId={selectedPrescriptionId}
        onSelect={setSelectedPrescriptionId}
        onNewChat={handleNewChat}
      />

      <div className={`main-content ${sidebarCollapsed ? "expanded" : ""}`}>
        {sidebarCollapsed && (
          <button
            className="toggle-sidebar-btn"
            onClick={() => setSidebarCollapsed(false)}
          >
            → Show Sidebar
          </button>
        )}

        <div style={{ marginBottom: "2rem" }}>
          <button
            className="nav-link"
            onClick={() => setCurrentPage("profile")}
          >
            Go to Profile
          </button>
        </div>

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
                  Start a new conversation to diagnose syndromes and get health
                  feedback.
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
    </div>
  );
};
export default Dashboard;
