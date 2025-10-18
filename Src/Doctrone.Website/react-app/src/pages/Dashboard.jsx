import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import Sidebar from "../components/Sidebar.jsx";
import mockPrescriptions from "../data/prescriptions.js";
import PromptBar from "../components/PromptBar.jsx";

const Dashboard = () => {
  const { setCurrentPage } = useAppContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(1);
  const [prescriptions, setPrescriptions] = useState(mockPrescriptions);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  
  const selectedPrescription = prescriptions.find(p => p.id === selectedPrescriptionId);
  
  const handleNewChat = () => {
    const newId = Math.max(...prescriptions.map(p => p.id)) + 1;
    const newPrescription = {
      id: newId,
      title: `New Consultation ${newId}`,
      status: "active",
      messages: []
    };
    setPrescriptions([...prescriptions, newPrescription]);
    setSelectedPrescriptionId(newId);
  };
  
  const handleSendMessage = async (message) => {
    // Add user message immediately
    const userMessage = { role: 'user', content: message };
    const updatedPrescriptionsWithUser = prescriptions.map(p => {
      if (p.id === selectedPrescriptionId) {
        return {
          ...p,
          messages: [...p.messages, userMessage]
        };
      }
      return p;
    });
    setPrescriptions(updatedPrescriptionsWithUser);
    
    setIsLoadingResponse(true);
    
    try {
      // Call the API
      const response = await fetch('https://doctrone.onrender.com/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          user_id: 1
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Add assistant response
      const assistantMessage = { 
        role: 'assistant', 
        content: data.response || 'I received your message but got an empty response.' 
      };
      
      const updatedPrescriptions = prescriptions.map(p => {
        if (p.id === selectedPrescriptionId) {
          return {
            ...p,
            messages: [...p.messages, userMessage, assistantMessage]
          };
        }
        return p;
      });
      setPrescriptions(updatedPrescriptions);
      
    } catch (error) {
      console.error('Error calling API:', error);
      
      // Add error message
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      };
      
      const updatedPrescriptions = prescriptions.map(p => {
        if (p.id === selectedPrescriptionId) {
          return {
            ...p,
            messages: [...p.messages, userMessage, errorMessage]
          };
        }
        return p;
      });
      setPrescriptions(updatedPrescriptions);
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
        selectedId={selectedPrescriptionId}
        onSelect={setSelectedPrescriptionId}
        onNewChat={handleNewChat}
      />
      
      <div className={`main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="top-bar">
          {sidebarCollapsed && (
            <button className="toggle-sidebar-btn" onClick={() => setSidebarCollapsed(false)}>
              ☰ Menu
            </button>
          )}
          <div style={{ flex: 1 }}></div>
          <button className="profile-btn" onClick={() => setCurrentPage('profile')} title="Profile">
            👤
          </button>
        </div>
        
        <div className="conversation-container">
          {selectedPrescription ? (
            <div className="conversation">
              <h2 className="conversation-header">{selectedPrescription.title}</h2>
              {selectedPrescription.messages.length > 0 ? (
                selectedPrescription.messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.role}`}>
                    <div className="message-role">{msg.role === 'user' ? 'You' : 'Assistant'}</div>
                    <p>{msg.content}</p>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>Start a new conversation to diagnose syndromes and get health feedback.</p>
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
