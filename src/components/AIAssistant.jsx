import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Bot, Send, Trash2, Sparkles } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS, GEMINI_MODEL, GEMINI_SYSTEM_PROMPT } from '../utils/constants';
import { sanitizeText } from '../utils/sanitize';

/** Read API key from environment — set VITE_GEMINI_API_KEY in your .env file */
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? '';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

const INITIAL_MESSAGE = {
  id: 1,
  role: 'model',
  text: "Hello! I'm your Team AI Assistant. I can help you summarize activity, suggest tasks, plan sprints, or answer productivity questions. How can I help today?",
};

/**
 * Converts our message list to the Gemini `contents` format for multi-turn chat.
 * @param {Array<{role: string, text: string}>} messages
 * @returns {Array<{role: string, parts: [{text: string}]}>}
 */
function toGeminiContents(messages) {
  return messages
    .filter(m => m.id !== 1) // skip the hardcoded greeting
    .map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));
}

export default function AIAssistant() {
  const [messages, setMessages] = useLocalStorage(STORAGE_KEYS.AI_HISTORY, [INITIAL_MESSAGE]);
  const [input, setInput]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState('');
  const messagesEndRef           = useRef(null);
  const inputRef                 = useRef(null);
  const messageRegionId          = 'ai-message-region';

  const isApiConfigured = useMemo(() => Boolean(GEMINI_API_KEY), []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /** Focus input on mount for keyboard users */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = useCallback(async (customInput = null) => {
    const rawText = customInput ?? input;
    const text    = sanitizeText(rawText, 'message');
    if (!text || isLoading) return;

    const userMsg = { id: Date.now(), role: 'user', text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!customInput) setInput('');
    setIsLoading(true);
    setError('');

    // ── Demo mode (no API key configured) ──────────────────
    if (!isApiConfigured) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'model',
          text: "I'm in demo mode — no Gemini API key is configured. Add your key in `.env` as `VITE_GEMINI_API_KEY` to unlock full AI capabilities.",
          isDemo: true,
        },
      ]);
      setIsLoading(false);
      return;
    }

    // ── Live Gemini API — multi-turn conversation ───────────
    try {
      const response = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: GEMINI_SYSTEM_PROMPT }],
          },
          contents: toGeminiContents(nextMessages),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message ?? `HTTP ${response.status}`);
      }

      const data = await response.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text
        ?? 'No response received — please try again.';

      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: 'model', text: aiText },
      ]);
    } catch (err) {
      console.error('[AIAssistant] Gemini error:', err);
      const msg = err.message.includes('API_KEY')
        ? 'Invalid API key. Please check your VITE_GEMINI_API_KEY.'
        : 'Connection error. Please check your network and try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
      // Return focus to input after response
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, isLoading, messages, setMessages, isApiConfigured]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleClearChat = useCallback(() => {
    // No window.confirm — use inline reset with undo-friendly UX
    setMessages([{
      ...INITIAL_MESSAGE,
      id: Date.now(),
      text: 'Chat cleared. How can I help you now?',
    }]);
    setError('');
  }, [setMessages]);

  const suggestTasks = useCallback(() => {
    handleSend('Suggest 3 high-priority tasks for a team collaboration software project. Keep each suggestion brief.');
  }, [handleSend]);

  return (
    <div
      className="ai-panel"
      style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        background: 'var(--surface-color)', borderRadius: '12px',
        border: '1px solid var(--border-color)', overflow: 'hidden',
      }}
    >
      {/* ── Header ──────────────────────────────────── */}
      <div
        className="ai-header"
        style={{
          padding: '1rem', borderBottom: '1px solid var(--border-color)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(99, 102, 241, 0.05)', flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            aria-hidden="true"
            style={{
              background: 'var(--accent-color)', color: 'white',
              padding: '0.4rem', borderRadius: '8px', display: 'flex',
            }}
          >
            <Bot size={20} />
          </div>
          <span style={{ fontWeight: 600 }}>Team AI Assistant</span>
          {!isApiConfigured && (
            <span
              style={{
                fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem',
                borderRadius: '4px', background: 'rgba(245,158,11,0.15)',
                color: 'var(--warning)', textTransform: 'uppercase',
              }}
            >
              Demo
            </span>
          )}
        </div>
        <button
          onClick={handleClearChat}
          className="icon-btn"
          aria-label="Clear chat history"
          title="Clear Chat"
          style={{ color: 'var(--text-secondary)' }}
        >
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </div>

      {/* ── Message List ────────────────────────────── */}
      <div
        id={messageRegionId}
        role="log"
        aria-live="polite"
        aria-label="AI conversation"
        className="ai-messages"
        style={{
          flex: 1, overflowY: 'auto', padding: '1.5rem',
          display: 'flex', flexDirection: 'column', gap: '1rem',
        }}
      >
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: '0.25rem',
            }}
          >
            <div
              style={{
                padding: '0.875rem 1.125rem',
                borderRadius: msg.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                background: msg.role === 'user' ? 'var(--accent-color)' : 'var(--bg-color)',
                color: msg.role === 'user' ? 'white' : 'var(--text-color)',
                border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)',
                fontSize: '0.95rem', lineHeight: 1.5, whiteSpace: 'pre-wrap',
              }}
            >
              {msg.text}
              {msg.isDemo && (
                <div
                  style={{
                    marginTop: '0.75rem', padding: '0.75rem',
                    background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px',
                    border: '1px dashed var(--accent-color)',
                  }}
                >
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                    Demo Task Suggestions:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
                    <li>Implement role-based access control (High)</li>
                    <li>Add keyboard-accessible drag-and-drop (High)</li>
                    <li>Write unit tests for core hooks (Medium)</li>
                  </ul>
                </div>
              )}
            </div>
            <span
              aria-hidden="true"
              style={{
                fontSize: '0.7rem', color: 'var(--text-secondary)',
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {msg.role === 'model' ? 'AI Assistant' : 'You'}
            </span>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div
            aria-label="AI is thinking"
            role="status"
            style={{
              alignSelf: 'flex-start', background: 'var(--bg-color)',
              padding: '0.75rem 1rem', borderRadius: '12px',
              border: '1px solid var(--border-color)',
              display: 'flex', gap: '0.4rem', alignItems: 'center',
            }}
          >
            {[0, 0.2, 0.4].map((delay, i) => (
              <span
                key={i}
                aria-hidden="true"
                style={{
                  width: '6px', height: '6px',
                  background: 'var(--text-secondary)',
                  borderRadius: '50%',
                  animation: `aiPulse 1s infinite ${delay}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Error message */}
        {error && (
          <p
            role="alert"
            style={{
              alignSelf: 'flex-start', color: 'var(--danger)',
              fontSize: '0.85rem', padding: '0.5rem 0.75rem',
              background: 'rgba(239,68,68,0.08)', borderRadius: '8px',
              border: '1px solid rgba(239,68,68,0.2)',
            }}
          >
            {error}
          </p>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Area ──────────────────────────────── */}
      <div
        style={{
          padding: '1.25rem', borderTop: '1px solid var(--border-color)',
          background: 'var(--surface-color)', flexShrink: 0,
        }}
      >
        {/* Quick-action chips */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={suggestTasks}
            disabled={isLoading}
            aria-label="Ask AI to suggest tasks"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.4rem 0.8rem', borderRadius: '20px',
              background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-color)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            <Sparkles size={14} aria-hidden="true" /> Suggest Tasks
          </button>
        </div>

        {/* Input row */}
        <div style={{ position: 'relative', display: 'flex', gap: '0.75rem' }}>
          <label htmlFor="ai-input" className="sr-only">
            Message the AI Assistant
          </label>
          <textarea
            id="ai-input"
            ref={inputRef}
            rows={1}
            placeholder="Ask AI to help with your team..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-controls={messageRegionId}
            style={{
              flex: 1, padding: '0.75rem 1rem',
              borderRadius: '10px', border: '1px solid var(--border-color)',
              background: 'var(--bg-color)', color: 'var(--text-color)',
              fontSize: '0.95rem', resize: 'none', fontFamily: 'inherit',
              lineHeight: 1.5,
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            style={{
              padding: '0.75rem', borderRadius: '10px',
              background: 'var(--accent-color)', color: 'white',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: (isLoading || !input.trim()) ? 0.6 : 1,
              transition: 'opacity 0.2s',
              flexShrink: 0,
            }}
          >
            <Send size={18} aria-hidden="true" />
          </button>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>

      <style>{`
        @keyframes aiPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .sr-only {
          position: absolute; width: 1px; height: 1px;
          padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0,0,0,0); white-space: nowrap; border: 0;
        }
      `}</style>
    </div>
  );
}
