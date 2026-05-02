import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TaskBoard from './components/TaskBoard'
import AIAssistant from './components/AIAssistant'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import TeamDirectory from './components/TeamDirectory'
import Settings from './components/Settings'
import { Bell, Search, LogOut } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('tasks')
  const [user, setUser] = useState(null)
  const [isLoginView, setIsLoginView] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  }

  if (!user) {
    return isLoginView ? (
      <Login 
        onLogin={() => setUser(JSON.parse(localStorage.getItem('user')))} 
        onSwitch={() => setIsLoginView(false)} 
      />
    ) : (
      <Register 
        onRegister={() => setUser(JSON.parse(localStorage.getItem('user')))} 
        onSwitch={() => setIsLoginView(true)} 
      />
    )
  }

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 500 }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search..." 
                style={{ padding: '0.5rem 0.5rem 0.5rem 2rem', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--bg-color)', color: 'var(--text-color)' }}
              />
            </div>
            <button className="icon-btn" style={{ position: 'relative' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%' }}></span>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button onClick={handleLogout} className="icon-btn" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className="content-area">
          {activeTab === 'tasks' && <TaskBoard />}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'team' && <TeamDirectory />}
          {activeTab === 'settings' && <Settings />}
          
          {/* AI Assistant is permanently visible in this layout on the side */}
          <AIAssistant />
        </div>
      </main>
    </div>
  )
}

export default App
