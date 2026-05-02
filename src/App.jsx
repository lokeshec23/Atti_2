import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import TaskBoard from './components/TaskBoard';
import AIAssistant from './components/AIAssistant';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import TeamDirectory from './components/TeamDirectory';
import Settings from './components/Settings';
import Modal from './components/Modal';
import { Bell, Search, LogOut, Bot } from 'lucide-react';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  tasks:     'Task Board',
  team:      'Team Directory',
  settings:  'Settings',
};

function App() {
  const [activeTab,      setActiveTab]      = useState('dashboard');
  const [user,           setUser]           = useState(null);
  const [isLoginView,    setIsLoginView]    = useState(true);
  const [isAIModalOpen,  setIsAIModalOpen]  = useState(false);

  // Ref for the floating AI button so Modal can restore focus on close
  const aiFloatBtnRef = useRef(null);

  // ── Bootstrap user session ───────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { /* ignore corrupt data */ }
    }
  }, []);

  // ── Apply saved theme on mount ───────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('theme_preference');
    const theme = saved ? JSON.parse(saved) : 'light';
    const resolved =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        : theme;
    document.documentElement.setAttribute('data-theme', resolved);
  }, []);

  // ── Update page title ────────────────────────────────────
  useEffect(() => {
    document.title = `${PAGE_TITLES[activeTab] || 'CollabNode'} · CollabNode`;
  }, [activeTab]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const handleLogin = useCallback(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // ── Auth screens ─────────────────────────────────────────
  if (!user) {
    return isLoginView ? (
      <Login onLogin={handleLogin} onSwitch={() => setIsLoginView(false)} />
    ) : (
      <Register onRegister={handleLogin} onSwitch={() => setIsLoginView(true)} />
    );
  }

  const userInitial = user.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <>
      {/* ── Skip Navigation ─────────────────────────── */}
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      <div className="app-container">
        {/* ── Sidebar ─────────────────────────────────── */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAI={() => setIsAIModalOpen(true)}
        />

        {/* ── Main ────────────────────────────────────── */}
        <main className="main-content" id="main-content" tabIndex="-1">
          {/* Header */}
          <header className="header" role="banner">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-color)' }}>
              {PAGE_TITLES[activeTab]}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search
                  size={15}
                  aria-hidden="true"
                  style={{
                    position: 'absolute', left: '0.7rem', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-secondary)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="search"
                  placeholder="Search…"
                  aria-label="Search application"
                  style={{
                    padding: '0.45rem 0.75rem 0.45rem 2.1rem',
                    borderRadius: '8px',
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-color)',
                    color: 'var(--text-color)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    width: '200px',
                    transition: 'border-color 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent-color)')}
                  onBlur={(e)  => (e.target.style.borderColor = 'var(--border-color)')}
                />
              </div>

              {/* Notifications */}
              <button
                className="icon-btn"
                aria-label="Notifications (1 new)"
                style={{ position: 'relative' }}
              >
                <Bell size={19} aria-hidden="true" />
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute', top: '2px', right: '2px',
                    width: '7px', height: '7px',
                    background: 'var(--danger)', borderRadius: '50%',
                  }}
                />
              </button>

              {/* User avatar + logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  aria-hidden="true"
                  title={user.name}
                  style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-color), #8b5cf6)',
                    color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.9rem',
                    flexShrink: 0,
                  }}
                >
                  {userInitial}
                </div>
                <button
                  onClick={handleLogout}
                  className="icon-btn"
                  aria-label={`Log out as ${user.name}`}
                  title="Log out"
                >
                  <LogOut size={17} aria-hidden="true" />
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="content-area">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'tasks'     && <TaskBoard />}
            {activeTab === 'team'      && <TeamDirectory />}
            {activeTab === 'settings'  && <Settings />}
          </div>
        </main>
      </div>

      {/* ── AI Modal ──────────────────────────────────── */}
      <Modal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        title="Team AI Assistant"
        triggerRef={aiFloatBtnRef}
      >
        <div style={{ height: '500px' }}>
          <AIAssistant />
        </div>
      </Modal>

      {/* ── Floating AI Button ────────────────────────── */}
      <button
        ref={aiFloatBtnRef}
        onClick={() => setIsAIModalOpen(true)}
        aria-label="Open AI Assistant"
        aria-haspopup="dialog"
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'var(--accent-color)',
          color: '#fff', border: 'none',
          boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.5)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100,
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          fontFamily: 'inherit',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform  = 'scale(1.1) rotate(5deg)';
          e.currentTarget.style.boxShadow  = '0 12px 28px -4px rgba(99,102,241,0.65)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform  = 'scale(1) rotate(0deg)';
          e.currentTarget.style.boxShadow  = '0 8px 20px -4px rgba(99, 102, 241, 0.5)';
        }}
      >
        <Bot size={26} aria-hidden="true" />
      </button>
    </>
  );
}

export default App;
