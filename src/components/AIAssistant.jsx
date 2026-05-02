import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Send, User, Trash2, Sparkles, Plus } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const GEMINI_API_KEY = AIzaSyCbgVTkqwaE35810ZStHf8YusW8KvQeQ4k; // User will replace this

export default function AIAssistant() {
  const [messages, setMessages] = useLocalStorage('ai_chat_history', [
    { id: 1, role: 'assistant', text: 'Hello! I am your Team AI Assistant. I can help you summarize activity or even suggest new tasks for your project. How can I help today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async (customInput = null) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = { id: Date.now(), role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customInput) setInput('');
    setIsLoading(true);

    try {
      if (GEMINI_API_KEY === AIzaSyCbgVTkqwaE35810ZStHf8YusW8KvQeQ4k) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: 'assistant',
          text: "I'm in demo mode. To enable my full capabilities, please provide a valid Gemini API key. In the meantime, I can simulate task suggestions!",
          isDemo: true
        }]);
        setIsLoading(false);
        return;
      }

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: textToSend }] }]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        const aiText = data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: aiText }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: "I encountered an issue processing that. Could you try rephrasing?" }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: "Connection error. Please check your network." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all conversation history?')) {
      setMessages([{ id: 1, role: 'assistant', text: 'Chat cleared. How can I help you now?' }]);
    }
  };

  const suggestTasks = () => {
    handleSend("Suggest 3 high-priority tasks for a team collaboration software project.");
  };

  return (
    <div className="ai-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
      <div className="ai-header" style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(99, 102, 241, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--accent-color)', color: 'white', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
            <Bot size={20} />
          </div>
          <span style={{ fontWeight: 600 }}>Team AI Assistant</span>
        </div>
        <button
          onClick={handleClearChat}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px' }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          title="Clear Chat"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="ai-messages" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem'
          }}>
            <div style={{
              padding: '0.875rem 1.125rem',
              borderRadius: msg.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
              background: msg.role === 'user' ? 'var(--accent-color)' : 'var(--bg-color)',
              color: msg.role === 'user' ? 'white' : 'var(--text-color)',
              border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)',
              fontSize: '0.95rem',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
              {msg.isDemo && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px dashed var(--accent-color)' }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', fontWeight: 600 }}>Demo Task Suggestions:</p>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
                    <li>Implement RBAC (High)</li>
                    <li>Optimize LocalStorage (Medium)</li>
                    <li>Add Accessibility Labels (High)</li>
                  </ul>
                </div>
              )}
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'assistant' ? 'AI Assistant' : 'You'}
            </span>
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', background: 'var(--bg-color)', padding: '0.75rem 1rem', borderRadius: '12px', display: 'flex', gap: '0.4rem' }}>
            <span style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'pulse 1s infinite' }}></span>
            <span style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'pulse 1s infinite 0.2s' }}></span>
            <span style={{ width: '6px', height: '6px', background: 'var(--text-secondary)', borderRadius: '50%', animation: 'pulse 1s infinite 0.4s' }}></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', background: 'var(--surface-color)' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <button
            onClick={suggestTasks}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.8rem',
              borderRadius: '20px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-color)',
              border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            <Sparkles size={14} /> Suggest Tasks
          </button>
        </div>
        <div style={{ position: 'relative', display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Ask AI to help with your team..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-color)',
              color: 'var(--text-color)',
              fontSize: '0.95rem'
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            style={{
              padding: '0.75rem',
              borderRadius: '10px',
              background: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: (isLoading || !input.trim()) ? 0.6 : 1
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
