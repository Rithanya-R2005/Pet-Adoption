import React, { useState, useEffect, useRef } from 'react';
import './LiveChat.css';

const LiveChat = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: 'Hello! Welcome to PetAdopt. How can I help you today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [agentName] = useState('Sarah');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate agent response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me help you with that.",
        "I'd be happy to assist you with the adoption process.",
        "Thank you for your interest in pet adoption!",
        "I can help you find the perfect pet for your family.",
        "The adoption process is quite straightforward. Let me explain...",
        "We have many wonderful pets available for adoption.",
        "I'm here to answer any questions you might have about pet adoption."
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const agentMessage = {
        id: messages.length + 2,
        sender: 'agent',
        text: randomResponse,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const quickReplies = [
    "How do I adopt a pet?",
    "What pets are available?",
    "What's the adoption process?",
    "Can I visit the shelter?"
  ];

  const handleQuickReply = (reply) => {
    setNewMessage(reply);
  };

  return (
    <div className="live-chat">
      <div className="chat-header">
        <div className="agent-info">
          <div className="agent-avatar">👩‍💼</div>
          <div>
            <h3>{agentName}</h3>
            <span className="status online">Online</span>
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender}`}>
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">{message.timestamp}</span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message agent">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-replies">
        {quickReplies.map((reply, index) => (
          <button
            key={index}
            className="quick-reply-btn"
            onClick={() => handleQuickReply(reply)}
          >
            {reply}
          </button>
        ))}
      </div>

      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="submit" className="send-btn">
          ➤
        </button>
      </form>
    </div>
  );
};

export default LiveChat;
