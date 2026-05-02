import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User } from 'lucide-react';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: 'Hello! I can help you organize tasks or summarize team activity. What do you need?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      let aiText = "I've noted that down.";
      if (input.toLowerCase().includes('task') || input.toLowerCase().includes('create')) {
        aiText = "I can draft a task for you. Would you like me to add it to the 'To Do' column?";
      } else if (input.toLowerCase().includes('summary') || input.toLowerCase().includes('team')) {
        aiText = "Based on recent activity, the team is focusing heavily on backend setup and authentication today.";
      }

      setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: aiText }]);
    }, 1000);
  };

  return (
    <div className="ai-panel">
      <div className="ai-header">
        <Bot size={20} />
        <span>Team AI Assistant</span>
      </div>
      
      <div className="ai-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.role}`}>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="ai-input-area">
        <input 
          type="text" 
          className="ai-input" 
          placeholder="Ask AI to summarize tasks..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="ai-btn" onClick={handleSend}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
