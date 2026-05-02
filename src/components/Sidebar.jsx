import React from 'react';
import { LayoutDashboard, CheckSquare, Users, Settings, Sparkles } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
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
    </aside>
  );
}
