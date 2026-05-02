import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import TaskBoard from './components/TaskBoard'
import AIAssistant from './components/AIAssistant'
import { Bell, Search } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('tasks')

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search..." 
                style={{ padding: '0.5rem 0.5rem 0.5rem 2rem', borderRadius: '4px', border: '1px solid var(--border-color)', outline: 'none' }}
              />
            </div>
            <button className="icon-btn" style={{ position: 'relative' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%' }}></span>
            </button>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              US
            </div>
          </div>
        </header>

        <div className="content-area">
          {activeTab === 'tasks' && <TaskBoard />}
          {activeTab === 'dashboard' && <div>Dashboard Overview coming soon...</div>}
          {activeTab === 'team' && <div>Team Directory coming soon...</div>}
          {activeTab === 'settings' && <div>Settings coming soon...</div>}
          
          {/* AI Assistant is permanently visible in this layout on the side */}
          <AIAssistant />
        </div>
      </main>
    </div>
  )
}

export default App
