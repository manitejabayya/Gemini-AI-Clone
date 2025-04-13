import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './Components/SideBar/Sidebar';
import Main from './Components/Main/Main';
import checkAvailableModels from './config/modelCheck';

function App() {
  const [modelStatus, setModelStatus] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  
  // Check models on load
  useEffect(() => {
    const checkModels = async () => {
      try {
        const status = await checkAvailableModels();
        setModelStatus(status);
      } catch (error) {
        console.error("Error checking models:", error);
        setModelStatus("Error checking models");
      }
    };
    
    checkModels();
    
    // Check if sidebar state is stored in localStorage
    const storedSidebarState = localStorage.getItem('sidebarCollapsed');
    if (storedSidebarState) {
      setSidebarCollapsed(JSON.parse(storedSidebarState));
    }
    
    // Load messages from localStorage if available
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);
  
  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);
  
  // Save messages to localStorage when they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const handleNewChat = () => {
    setCurrentChatId(Math.random().toString(36).substring(2));
    // Clear messages in Main component
    setMessages([]);
  };
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };
  
  const setCurrentChat = (chatId) => {
    setCurrentChatId(chatId);
    // Filter messages for the selected chat
    // This would require chatId to be stored with each message
  };
  
  const updateMessages = (newMessages) => {
    // Add chatId to each message
    const messagesWithChatId = newMessages.map(msg => ({
      ...msg,
      chatId: currentChatId || Math.random().toString(36).substring(2)
    }));
    setMessages(messagesWithChatId);
  };

  return (
    <div className="app">
      <Sidebar 
        onNewChat={handleNewChat} 
        messages={messages}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        setCurrentChat={setCurrentChat}
      />
      <Main 
        initialMessages={messages.filter(msg => 
          !currentChatId || msg.chatId === currentChatId
        )}
        setMessages={updateMessages}
        sidebarCollapsed={isSidebarCollapsed}
      />
    </div>
  );
}

export default App;