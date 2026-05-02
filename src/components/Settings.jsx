import React from 'react';
import { Save, Moon, Sun, Bell } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Settings() {
  const [theme, setTheme] = useLocalStorage('theme_preference', 'dark');
  const [notifications, setNotifications] = useLocalStorage('notification_preference', true);

  const handleSave = () => {
    // With useLocalStorage, data is saved automatically on change,
    // but we can provide feedback here.
    alert('Settings synchronized and saved!');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Settings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Customize your workspace experience</p>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        
        <div style={{
          background: 'var(--surface-color)',
          padding: '2rem',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Sun size={20} style={{ color: 'var(--accent-color)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Appearance</h3>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 500 }}>Theme Preference</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Choose how the platform looks to you</p>
              </div>
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  background: 'var(--surface-color)',
                  color: 'var(--text-color)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Bell size={20} style={{ color: 'var(--accent-color)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Notifications</h3>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-color)', borderRadius: '12px' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 500 }}>Desktop Notifications</p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Get alerts for task updates and team messages</p>
              </div>
              <div 
                onClick={() => setNotifications(!notifications)}
                style={{
                  width: '48px',
                  height: '24px',
                  background: notifications ? 'var(--accent-color)' : 'var(--border-color)',
                  borderRadius: '12px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease'
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: 'white',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: notifications ? '26px' : '2px',
                  transition: 'left 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '1rem',
              background: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '1rem',
              transition: 'var(--transition)'
            }}
            onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.filter = 'none'}
          >
            <Save size={20} /> Save & Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}
