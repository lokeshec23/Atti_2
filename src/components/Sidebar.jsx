import React from 'react';
import { LayoutDashboard, CheckSquare, Users, Settings, Sparkles, Bot } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenAI }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={18} /> },
    { id: 'team', label: 'Team', icon: <Users size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Sparkles className="text-accent" style={{ color: 'var(--accent-color)' }} />
        <span>CollabNode</span>
      </div>
      <ul className="nav-links">
        {navItems.map(item => (
          <li 
            key={item.id} 
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            {item.label}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 'auto', padding: '1rem' }}>
        <button 
          onClick={onOpenAI}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            background: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--accent-color)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'var(--transition)'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = 'var(--accent-color)'; e.currentTarget.style.color = 'white'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'; e.currentTarget.style.color = 'var(--accent-color)'; }}
        >
          <Bot size={18} />
          AI Assistant
        </button>
      </div>
    </aside>
  );
}
