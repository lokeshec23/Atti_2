import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User } from 'lucide-react';
const GEMINI_API_KEY = "AIzaSyCbgVTkqwaE35810ZStHf8YusW8KvQeQ4k"; // User will replace this

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: 'Hello! I can help you organize tasks or summarize team activity. What do you need?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      if (GEMINI_API_KEY === "AIzaSyCbgVTkqwaE35810ZStHf8YusW8KvQeQ4k") {
        setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: "Please add your Gemini API key in the code to use the AI Assistant." }]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: input }]
            }
          ]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        const aiText = data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: aiText }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: "Sorry, I couldn't generate a response." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', text: "Error connecting to AI service." }]);
    } finally {
      setIsLoading(false);
    }
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
