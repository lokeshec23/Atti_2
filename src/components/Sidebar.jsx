import React from 'react';
import { LayoutDashboard, CheckSquare, Users, Settings, Bot, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks',     label: 'Tasks',     icon: CheckSquare },
  { id: 'team',      label: 'Team',      icon: Users },
  { id: 'settings',  label: 'Settings',  icon: Settings },
];

export default function Sidebar({ activeTab, setActiveTab, onOpenAI }) {
  function handleKeyDown(e, id) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveTab(id);
    }
  }

  return (
    <aside className="sidebar" aria-label="Application sidebar">
      {/* Brand */}
      <div className="sidebar-header">
        <Sparkles size={20} aria-hidden="true" style={{ color: 'var(--accent-color)' }} />
        <span>CollabNode</span>
      </div>

      {/* Navigation */}
      <nav aria-label="Main navigation">
        <ul className="nav-links" role="list">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <li key={id} role="none">
              <button
                className={`nav-item${activeTab === id ? ' active' : ''}`}
                onClick={() => setActiveTab(id)}
                onKeyDown={(e) => handleKeyDown(e, id)}
                aria-current={activeTab === id ? 'page' : undefined}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* AI Assistant shortcut */}
      <div style={{ padding: '0.75rem' }}>
        <button
          onClick={onOpenAI}
          aria-label="Open AI Assistant"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            background: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--accent-color)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'var(--transition)',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent-color)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
            e.currentTarget.style.color = 'var(--accent-color)';
          }}
        >
          <Bot size={18} aria-hidden="true" />
          AI Assistant
        </button>
      </div>
    </aside>
  );
}
