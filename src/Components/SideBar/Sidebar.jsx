import React from 'react';
import './Sidebar.css';

const Sidebar = ({ onNewChat, messages, isCollapsed, toggleSidebar, setCurrentChat }) => {
  
  const getUniqueChats = () => {
    if (!messages || messages.length === 0) return [];
    

    const userMessages = messages
      .filter(msg => msg.sender === 'user')
      .map(msg => ({
        id: msg.chatId || Math.random().toString(36).substring(2),
        text: msg.text.slice(0, 30) + (msg.text.length > 30 ? '...' : '')
      }));
    

    const uniqueChats = [];
    const chatIds = new Set();
    
    userMessages.forEach(msg => {
      if (!chatIds.has(msg.id)) {
        chatIds.add(msg.id);
        uniqueChats.push(msg);
      }
    });
    
    return uniqueChats;
  };

  const chatHistory = getUniqueChats();

  return (
    <>
      {/* Hamburger menu button that's always visible when sidebar is hidden */}
      {isCollapsed && (
        <button className="floating-menu-button" onClick={toggleSidebar}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      )}
      
      {/* The sidebar that can be hidden */}
      <div className={`sidebar ${isCollapsed ? 'hidden' : ''}`}>
        <div className="sidebar-header">
          <button className="menu-button" onClick={toggleSidebar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <h1>Gemini</h1>
        </div>
        
        <button className="new-chat-button" onClick={onNewChat}>
          <span>+</span>
          <span className="new-chat-text"></span>
        </button>
        
        <div className="sidebar-history">
          {chatHistory.length > 0 ? (
            chatHistory.map(chat => (
              <div 
                key={chat.id} 
                className="history-item"
                onClick={() => setCurrentChat && setCurrentChat(chat.id)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
                </svg>
                <span>{chat.text}</span>
              </div>
            ))
          ) : (
            <div className="no-history">No chat history yet</div>
          )}
        </div>
        
        <div className="sidebar-footer">
          <button className="help-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 17V17.01M12 14C12 11 15 11.5 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          <button className="history-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;