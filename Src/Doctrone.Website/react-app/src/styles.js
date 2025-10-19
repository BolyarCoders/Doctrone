const styles = `
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap");

:root {
    --primary-colour: #074131;
    --primary-gradient-colour: linear-gradient(45deg, #074131, #13a77c);
    --secondary-colour: #f6f6f6;
    --accent-colour: #13a77c;
    --h1: 89.9px;
    --h2: 67.3px;
    --h3: 50.5px;
    --h4: 37.9px;
    --h5: 28.4px;
    --h6: 21.3px;
    --p: 16px;
}

body.light-theme {
    --primary-colour: #f6f6f6;
    --secondary-colour: #074131;
    --bg-card: #ffffff;
    --border-color: #e0e0e0;
}

body.dark-theme {
    --primary-colour: #074131;
    --secondary-colour: #f6f6f6;
    --bg-card: #0a5741;
    --border-color: #13a77c;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: "Roboto", sans-serif;
    background-color: var(--primary-colour);
    color: var(--secondary-colour);
    transition: background-color 0.3s, color 0.3s;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Roboto', sans-serif;
  color: var(--secondary-colour);
}

h1 { font-size: clamp(32px, 5vw, var(--h1)); }
h2 { font-size: clamp(28px, 4vw, var(--h2)); }
h3 { font-size: clamp(24px, 3.5vw, var(--h3)); }
h4 { font-size: clamp(20px, 3vw, var(--h4)); }
h5 { font-size: clamp(18px, 2.5vw, var(--h5)); }
h6 { font-size: clamp(16px, 2vw, var(--h6)); }
p { font-size: var(--p); }

/* Landing Page */
.landing {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.landing-header {
    color: var(--secondary-colour);
    font-size: var(--h2);
    margin-bottom: 1rem;
    text-align: center;
}

.landing-description {
    max-width: 600px;
    text-align: center;
    margin-bottom: 2rem;
    font-size: var(--p);
    line-height: 1.6;
}

.auth-form {
    background: var(--bg-card);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    width: 100%;
    max-width: 500px;
    border: 1px solid var(--border-color);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: var(--p);
    background: var(--primary-colour);
    color: var(--secondary-colour);
    font-family: 'Roboto', sans-serif;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.btn {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 6px;
    font-size: var(--p);
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.3s;
    background: var(--primary-gradient-colour);
    color: white;
}

.btn:hover {
    opacity: 0.9;
}

.auth-toggle {
    text-align: center;
    margin-top: 1rem;
    font-size: 14px;
}

.auth-toggle button {
    background: none;
    border: none;
    color: var(--accent-colour);
    cursor: pointer;
    text-decoration: underline;
    font-size: 14px;
}

/* Dashboard Layout */
.dashboard {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    width: 300px;
    background: var(--bg-card);
    border-right: 1px solid var(--border-color);
    padding: 1rem;
    transition: transform 0.3s ease, width 0.3s ease;
    position: fixed;
    height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.sidebar.collapsed {
    transform: translateX(-100%);
    width: 0;
}

.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.sidebar-logo {
    display: flex;
    align-items: center;
    justify-content: center;
}

.sidebar-logo img {
    width: 40px;
    height: auto;
}

.sidebar-toggle {
    background: var(--accent-colour);
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
}

.sidebar-content {
    flex: 1;
    overflow-y: auto;
}

.folder-section {
    margin-bottom: 1rem;
}

.folder-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: var(--primary-colour);
    border-radius: 6px;
    cursor: pointer;
    border: 1px solid var(--border-color);
    margin-bottom: 0.5rem;
    transition: opacity 0.2s;
}

.folder-header:hover {
    opacity: 0.8;
}

.folder-name {
    font-weight: 600;
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.folder-toggle {
    font-size: 12px;
}

.folder-chats {
    margin-left: 1rem;
    margin-bottom: 0.5rem;
}

.add-folder-btn {
    width: 100%;
    background: transparent;
    border: 2px dashed var(--border-color);
    color: var(--secondary-colour);
    padding: 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: border-color 0.2s;
}

.add-folder-btn:hover {
    border-color: var(--accent-colour);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal {
    background: var(--bg-card);
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    border: 1px solid var(--border-color);
}

.modal h3 {
    margin-bottom: 1.5rem;
    font-size: var(--h5);
}

.modal-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
}

.modal-btn {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
}

.modal-btn.primary {
    background: var(--accent-colour);
    color: white;
}

.modal-btn.secondary {
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--secondary-colour);
}

.chat-item-actions {
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.2s;
}

.prescription-item:hover .chat-item-actions {
    opacity: 1;
}

.chat-action-btn {
    background: transparent;
    border: none;
    color: var(--secondary-colour);
    cursor: pointer;
    padding: 0.25rem;
    font-size: 12px;
    opacity: 0.6;
}

.chat-action-btn:hover {
    opacity: 1;
}

.sidebar-section {
    margin-bottom: 2rem;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.section-title {
    font-size: var(--h6);
    font-weight: 500;
}

.new-chat-btn {
    background: var(--accent-colour);
    border: none;
    color: white;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
}

.prescription-item {
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
    border: 1px solid var(--border-color);
}

.prescription-item:hover {
    background: var(--primary-colour);
    opacity: 0.8;
}

.prescription-item.active {
    background: var(--accent-colour);
    color: white;
}

.main-content {
    flex: 1;
    margin-left: 300px;
    padding: 2rem;
    transition: margin-left 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.main-content.expanded {
    margin-left: 0;
}

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.toggle-sidebar-btn {
    background: var(--accent-colour);
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
}

.profile-btn {
    background: var(--accent-colour);
    border: none;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s;
}

.profile-btn:hover {
    opacity: 0.8;
}

.conversation-container {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 1rem;
}

.conversation {
    max-width: 800px;
    margin: 0 auto;
}

.conversation-header {
    font-size: var(--h4);
    margin-bottom: 2rem;
    color: var(--secondary-colour);
}

.message {
    margin-bottom: 1.5rem;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
}

.message.user {
    background: var(--bg-card);
    margin-left: 2rem;
}

.message.assistant {
    background: var(--primary-colour);
    margin-right: 2rem;
}

.message-role {
    font-weight: 700;
    margin-bottom: 0.5rem;
    font-size: 14px;
    text-transform: uppercase;
}

.prompt-bar {
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1rem;
    display: flex;
    gap: 1rem;
}

.prompt-input {
    flex: 1;
    border: none;
    background: transparent;
    color: var(--secondary-colour);
    font-size: var(--p);
    font-family: 'Roboto', sans-serif;
    outline: none;
}

.prompt-input::placeholder {
    color: var(--secondary-colour);
    opacity: 0.5;
}

.send-btn {
    background: var(--accent-colour);
    border: none;
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: var(--p);
    font-weight: 500;
    transition: opacity 0.3s;
}

.send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.prompt-input:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.loading-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
    margin-right: 0.5rem;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.logout-btn {
    background: #ff4444;
    border: none;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: var(--p);
    font-weight: 500;
    transition: opacity 0.3s;
}

.logout-btn:hover {
    opacity: 0.9;
}

/* Profile Page */
.profile {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.profile-header {
    font-size: var(--h3);
    margin-bottom: 2rem;
    color: var(--secondary-colour);
}

.profile-section {
    background: var(--bg-card);
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    border: 1px solid var(--border-color);
}

.profile-section h3 {
    font-size: var(--h5);
    margin-bottom: 1rem;
}

.profile-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
}

.info-item {
    padding: 0.75rem;
    background: var(--primary-colour);
    border-radius: 6px;
    border: 1px solid var(--border-color);
}

.info-label {
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 0.25rem;
    opacity: 0.8;
}

.info-value {
    font-size: var(--p);
}

.medication-list {
    list-style: none;
}

.medication-item {
    padding: 1rem;
    background: var(--primary-colour);
    border-radius: 8px;
    margin-bottom: 1rem;
    border: 1px solid var(--border-color);
}

.medication-name {
    font-weight: 700;
    font-size: var(--h6);
    margin-bottom: 0.5rem;
}

.theme-toggle {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.theme-toggle-btn {
    background: var(--accent-colour);
    border: none;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: var(--p);
}

.back-link {
    color: var(--accent-colour);
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.back-link:hover {
    text-decoration: underline;
}

.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: var(--secondary-colour);
    opacity: 0.7;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.new-chat-btn,
.add-folder-btn {
    background: var(--accent-colour);
    border: none;
    color: white;
    padding: 0.5rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    margin-left: 0.25rem;
    transition: opacity 0.2s, background 0.2s;
}

.new-chat-btn:hover,
.add-folder-btn:hover {
    opacity: 0.9;
    background: var(--primary-gradient-colour);
}

/* Folders Section */
.folder-section {
    margin-bottom: 1rem;
}

.folder-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0.75rem;
    background: var(--primary-colour);
    border-radius: 6px;
    cursor: pointer;
    border: 1px solid var(--border-color);
    margin-bottom: 0.5rem;
    font-size: 14px;
    font-weight: 600;
    color: var(--secondary-colour);
    transition: opacity 0.2s;
}

.folder-header:hover {
    opacity: 0.8;
}

/* Text under folders */
.folder-all-chats {
    font-size: 12px;
    color: var(--secondary-colour);
    opacity: 0.7;
    margin-left: 0.75rem;
    margin-bottom: 0.5rem;
}

`;
export default styles;
