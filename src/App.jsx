import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
import { useLocalStorage } from './hooks/useLocalStorage';
import { STORAGE_KEYS, TASK_STATUS } from './utils/constants';

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  tasks:     'Task Board',
  team:      'Team Directory',
  settings:  'Settings',
};

function App() {
  const [activeTab,     setActiveTab]     = useState('dashboard');
  const [user,          setUser]          = useState(null);
  const [isLoginView,   setIsLoginView]   = useState(true);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');

  // Read tasks to compute real notification count (unread = in-progress tasks)
  const [tasks] = useLocalStorage(STORAGE_KEYS.TASKS, []);

  const aiFloatBtnRef = useRef(null);

  /** Count of in-progress tasks as "notifications" */
  const notifCount = useMemo(
    () => tasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS).length,
    [tasks],
  );

  // ── Bootstrap user session ───────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { /* ignore corrupt data */ }
    }
  }, []);

  // ── Apply saved theme on mount ───────────────────────────
  useEffect(() => {
    try {
      const saved  = localStorage.getItem(STORAGE_KEYS.THEME);
      const theme  = saved ? JSON.parse(saved) : 'light';
      const resolved = theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;
      document.documentElement.setAttribute('data-theme', resolved);
    } catch { /* fallback to light */ }
  }, []);

  // ── Update page title ────────────────────────────────────
  useEffect(() => {
    document.title = `${PAGE_TITLES[activeTab] ?? 'CollabNode'} · CollabNode`;
  }, [activeTab]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  }, []);

  const handleLogin = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  // ── Search: navigate to tasks tab and pass query ─────────
  const handleSearchKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setActiveTab('tasks');
    }
  }, [searchQuery]);

  // ── Auth screens ─────────────────────────────────────────
  if (!user) {
    return isLoginView
      ? <Login onLogin={handleLogin} onSwitch={() => setIsLoginView(false)} />
      : <Register onRegister={handleLogin} onSwitch={() => setIsLoginView(true)} />;
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
        <main className="main-content" id="main-content" tabIndex={-1}>
          {/* Header */}
          <header className="header" role="banner">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-color)' }}>
              {PAGE_TITLES[activeTab]}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Global Search */}
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
                <label htmlFor="global-search" className="sr-only">Search — press Enter to search tasks</label>
                <input
                  id="global-search"
                  type="search"
                  placeholder="Search tasks…"
                  aria-label="Search tasks — press Enter to navigate"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
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
                  onFocus={e => (e.target.style.borderColor = 'var(--accent-color)')}
                  onBlur={e  => (e.target.style.borderColor = 'var(--border-color)')}
                />
              </div>

              {/* Notifications */}
              <button
                className="icon-btn"
                aria-label={notifCount > 0 ? `${notifCount} task${notifCount !== 1 ? 's' : ''} in progress` : 'Notifications — no active tasks'}
                style={{ position: 'relative' }}
                onClick={() => setActiveTab('tasks')}
                title="View in-progress tasks"
              >
                <Bell size={19} aria-hidden="true" />
                {notifCount > 0 && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute', top: '2px', right: '2px',
                      minWidth: '7px', height: '7px',
                      background: 'var(--danger)', borderRadius: '50%',
                    }}
                  />
                )}
              </button>

              {/* User avatar + logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  aria-label={`Signed in as ${user.name}`}
                  title={user.name}
                  style={{
                    width: '34px', height: '34px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent-color), #8b5cf6)',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.9rem', flexShrink: 0,
                  }}
                >
                  <span aria-hidden="true">{userInitial}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="icon-btn"
                  aria-label={`Sign out (${user.name})`}
                  title="Sign out"
                >
                  <LogOut size={17} aria-hidden="true" />
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="content-area">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'tasks'     && <TaskBoard searchQuery={searchQuery} />}
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
        aria-expanded={isAIModalOpen}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'var(--accent-color)',
          color: '#fff', border: 'none',
          boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.5)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
          e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(99,102,241,0.65)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(99, 102, 241, 0.5)';
        }}
      >
        <Bot size={26} aria-hidden="true" />
      </button>

      <style>{`
        .sr-only {
          position: absolute; width: 1px; height: 1px;
          padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0,0,0,0); white-space: nowrap; border: 0;
        }
      `}</style>
    </>
  );
}

export default App;
