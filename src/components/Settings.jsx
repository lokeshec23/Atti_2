import React, { useState } from 'react';
import { Save } from 'lucide-react';

export default function Settings() {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    alert('Settings saved locally!');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Settings</h2>
      
      <div style={{
        background: 'var(--surface-color)',
        padding: '2rem',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Appearance</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Theme Preference</span>
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                background: 'var(--bg-color)',
                color: 'var(--text-color)',
                border: '1px solid var(--border-color)'
              }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Notifications</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <input 
              type="checkbox" 
              id="notif" 
              checked={notifications} 
              onChange={(e) => setNotifications(e.target.checked)}
              style={{ width: '1.2rem', height: '1.2rem' }}
            />
            <label htmlFor="notif">Enable Desktop Notifications</label>
          </div>
        </div>

        <button 
          onClick={handleSave}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.75rem',
            background: 'var(--accent-color)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 500,
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          <Save size={18} /> Save Preferences
        </button>
      </div>
    </div>
  );
}
