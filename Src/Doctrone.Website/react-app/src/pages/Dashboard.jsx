import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import Sidebar from "../components/Sidebar.jsx";
import PromptBar from "../components/PromptBar.jsx";
import logo from "../assets/doctrone-logo.png";

const Dashboard = () => {
  const { setCurrentPage, user } = useAppContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [folders, setFolders] = useState([]);
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);

  // Load folders on mount
  useEffect(() => {
    if (user?.id) {
      loadFolders();
    }
  }, [user?.id]);

  const loadFolders = async () => {
    if (!user?.id) return;
    setIsLoadingFolders(true);

    try {
      const response = await fetch(
        `https://doctroneapi.onrender.com/Doctrone/GetFoldersOfUser?userId=${user.id}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (response.ok) {
        const foldersData = await response.json();

        const foldersWithChats = await Promise.all(
          foldersData.map(async (folder) => {
            try {
              const chatsResponse = await fetch(
                `https://doctroneapi.onrender.com/Doctrone/GetChatOfUser?folderId=${folder.id}`,
                {
                  method: "GET",
                  headers: { "Content-Type": "application/json" },
                }
              );

              if (chatsResponse.ok) {
                const chats = await chatsResponse.json();
                return { ...folder, chats: chats || [] };
              }
            } catch (err) {
              console.error(
                `Error loading chats for folder ${folder.id}:`,
                err
              );
            }
            return { ...folder, chats: [] };
          })
        );

        setFolders(foldersWithChats);
      }
    } catch (error) {
      console.error("Error loading folders:", error);
    } finally {
      setIsLoadingFolders(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !user?.id) return;

    try {
      const response = await fetch(
        "https://doctroneapi.onrender.com/Doctrone/AddFolder",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            name: newFolderName,
          }),
        }
      );

      if (response.ok) {
        setNewFolderName("");
        setShowFolderModal(false);
        await loadFolders();
      }
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleNewChat = () => {
    if (folders.length === 0) {
      alert("Please create a folder first!");
      setShowFolderModal(true);
      return;
    }
    setShowChatModal(true);
    setSelectedFolderId(folders[0]?.id);
  };

  const handleCreateChat = async () => {
    if (!selectedFolderId || !user?.id) return;

    const autoTitle = `Chat ${new Date().toLocaleString()}`;

    try {
      const response = await fetch(
        "https://doctroneapi.onrender.com/Doctrone/AddChat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            title: autoTitle,
            folderId: selectedFolderId,
          }),
        }
      );

      if (response.ok) {
        const newChat = await response.json();
        setShowChatModal(false);
        await loadFolders();

        if (newChat.id || newChat.chatId) {
          setSelectedChat({
            id: newChat.id || newChat.chatId,
            title: autoTitle,
            messages: [],
          });
        }
      }
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleSelectChat = (chat) => {
    setSelectedChat({ ...chat, messages: chat.messages || [] });
  };

  const handleSendMessage = async (message) => {
    if (!user?.id || !selectedChat) {
      console.error("No user ID or chat selected");
      return;
    }

    const userMessage = { role: "user", content: message };
    setSelectedChat((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), userMessage],
    }));

    setIsLoadingResponse(true);

    try {
      const response = await fetch("https://doctrone.onrender.com/new_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          user_id: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = {
        role: "assistant",
        content:
          data.response || "I received your message but got an empty response.",
      };

      setSelectedChat((prev) => ({
        ...prev,
        chat_id: data.chat_id || prev.chat_id,
        messages: [...(prev.messages || []), userMessage, assistantMessage],
      }));
    } catch (error) {
      console.error("Error calling API:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again later.",
      };

      setSelectedChat((prev) => ({
        ...prev,
        messages: [...(prev.messages || []), userMessage, errorMessage],
      }));
    } finally {
      setIsLoadingResponse(false);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        folders={folders}
        selectedChatId={selectedChat?.id}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onCreateFolder={handleCreateFolder}
        logo={logo}
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
          {selectedChat ? (
            <div className="conversation">
              <h2 className="conversation-header">{selectedChat.title}</h2>
              {selectedChat.messages.length > 0 ? (
                selectedChat.messages.map((msg, idx) => (
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
