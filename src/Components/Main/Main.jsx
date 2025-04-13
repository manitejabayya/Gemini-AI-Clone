import React, { useState, useRef, useEffect } from 'react';
import './Main.css';
import runChat from '../../config/gemini';

const Main = ({ initialMessages = [], setMessages, sidebarCollapsed }) => {
  const [prompt, setPrompt] = useState('');
  const [messages, setLocalMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Update local messages when initialMessages change
  useEffect(() => {
    setLocalMessages(initialMessages);
  }, [initialMessages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    // Add user message
    const userMessage = { text: prompt, sender: 'user' };
    const newMessages = [...messages, userMessage];
    setLocalMessages(newMessages);
    setMessages(newMessages);
    setPrompt('');
    setIsLoading(true);

    try {
      // Simulate AI typing
      setAiTyping(true);
      const response = await runChat(prompt);
      
      // Add AI response after a slight delay to show typing animation
      setTimeout(() => {
        const updatedMessages = [...newMessages, { text: response, sender: 'ai' }];
        setLocalMessages(updatedMessages);
        setMessages(updatedMessages);
        setIsLoading(false);
        setAiTyping(false);
      }, 500);
    } catch (error) {
      console.error('Error getting response:', error);
      const updatedMessages = [...newMessages, { 
        text: "Sorry, I encountered an error. Please try again.", 
        sender: 'ai', 
        error: true 
      }];
      setLocalMessages(updatedMessages);
      setMessages(updatedMessages);
      setIsLoading(false);
      setAiTyping(false);
    }
  };

  const getSuggestion = async (suggestion) => {
    setPrompt(suggestion);
    
    // Simulate pressing enter/submitting the form
    setTimeout(() => {
      handleSubmit();
    }, 100);
  };

  const suggestions = [
    {
      text: "Suggest beautiful places to see on an upcoming road trip",
      icon: "✏️"
    },
    {
      text: "Briefly summarize this concept: urban planning",
      icon: "💡"
    },
    {
      text: "Brainstorm team bonding activities for our work retreat",
      icon: "💬"
    },
    {
      text: "Improve the readability of the following code",
      icon: "</>"
    }
  ];

  return (
    <div className={`main ${sidebarCollapsed ? 'expanded' : ''}`}>
      {messages.length === 0 ? (
        <div className="welcome-container">
          <div className="welcome-text">
            <h1>
              <span className="blue-text">Hello,</span> 
              <span className="red-text"> Dev.</span>
            </h1>
            <h2>How can I help you today?</h2>
          </div>
          
          <div className="suggestions-container">
            {suggestions.map((suggestion, index) => (
              <div 
                key={index} 
                className="suggestion-card"
                onClick={() => getSuggestion(suggestion.text)}
              >
                <p>{suggestion.text}</p>
                <div className="suggestion-icon">{suggestion.icon}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="chat-container">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'} ${message.error ? 'error-message' : ''}`}
            >
              <div className="message-avatar">
                {message.sender === 'user' ? '👤' : '🤖'}
              </div>
              <div className="message-content">{message.text}</div>
            </div>
          ))}
          {aiTyping && (
            <div className="message ai-message typing">
              <div className="message-avatar">🤖</div>
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="prompt-form">
        <input
          type="text"
          placeholder="Enter a prompt here"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
          className="prompt-input"
        />
        <button type="button" className="attachment-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 8l-5 5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 13V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button type="submit" className="send-button" disabled={!prompt.trim() || isLoading}>
          {isLoading ? 
            <div className="loader"></div> : 
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        </button>
        <button type="button" className="mic-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Main;