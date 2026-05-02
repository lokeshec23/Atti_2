import React, { useCallback, useState } from 'react';
import { Save, Moon, Sun, Bell, Monitor, CheckCircle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/constants';

/* ── Simple Toast ────────────────────────────────────────── */
function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast-container" role="status" aria-live="polite" aria-atomic="true">
      <div className="toast" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CheckCircle size={16} aria-hidden="true" />
        {message}
      </div>
    </div>
  );
}

/* ── Toggle Switch ───────────────────────────────────────── */
function ToggleSwitch({ checked, onChange, id, label }) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  }, [checked, onChange]);

  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      onKeyDown={handleKeyDown}
      style={{
        width: '48px', height: '26px',
        background: checked ? 'var(--accent-color)' : 'var(--border-color)',
        borderRadius: '13px', border: 'none', cursor: 'pointer',
        position: 'relative', transition: 'background 0.3s ease',
        flexShrink: 0, padding: 0,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute', width: '20px', height: '20px',
          background: 'white', borderRadius: '50%', top: '3px',
          left: checked ? '25px' : '3px',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
        }}
      />
    </button>
  );
}

/* ── Section Card ────────────────────────────────────────── */
function SettingsCard({ children }) {
  return (
    <div
      style={{
        background: 'var(--surface-color)', border: '1px solid var(--border-color)',
        borderRadius: '16px', padding: '1.75rem',
        display: 'flex', flexDirection: 'column', gap: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {children}
    </div>
  );
}

function SettingsRow({ label, description, control, labelId }) {
  return (
    <div
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 1.25rem', background: 'var(--bg-color)',
        borderRadius: '12px', gap: '1rem', flexWrap: 'wrap',
      }}
    >
      <div style={{ flex: 1, minWidth: '160px' }}>
        <p id={labelId} style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-color)', margin: 0 }}>
          {label}
        </p>
        {description && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
            {description}
          </p>
        )}
      </div>
      <div role="group" aria-labelledby={labelId}>{control}</div>
    </div>
  );
}

/* ── Settings Page ───────────────────────────────────────── */
export default function Settings() {
  const [theme, setTheme]                 = useLocalStorage(STORAGE_KEYS.THEME, 'light');
  const [notifications, setNotifications] = useLocalStorage(STORAGE_KEYS.NOTIFICATIONS, true);
  const [toastMsg, setToastMsg]           = useState('');

  const THEME_ICONS = { light: Sun, dark: Moon, system: Monitor };

  const applyTheme = useCallback((value) => {
    setTheme(value);
    const resolved = value === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : value;
    document.documentElement.setAttribute('data-theme', resolved);
  }, [setTheme]);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  }, []);

  const handleSave = useCallback(() => {
    showToast('Settings saved successfully!');
  }, [showToast]);

  return (
    <div style={{ padding: '2rem', maxWidth: '760px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-color)', marginBottom: '0.35rem' }}>
          Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Customize your workspace experience
        </p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Appearance */}
        <SettingsCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sun size={20} aria-hidden="true" style={{ color: 'var(--accent-color)' }} />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-color)' }}>
              Appearance
            </h2>
          </div>

          <SettingsRow
            labelId="theme-label"
            label="Theme"
            description="Choose how CollabNode looks to you"
            control={
              <div role="radiogroup" aria-labelledby="theme-label" style={{ display: 'flex', gap: '0.5rem' }}>
                {(['light', 'dark', 'system']).map(opt => {
                  const Icon     = THEME_ICONS[opt];
                  const isActive = theme === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => applyTheme(opt)}
                      role="radio"
                      aria-checked={isActive}
                      aria-label={`${opt.charAt(0).toUpperCase() + opt.slice(1)} theme`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.5rem 0.85rem', borderRadius: '8px',
                        border: isActive ? '2px solid var(--accent-color)' : '2px solid var(--border-color)',
                        background: isActive ? 'rgba(99,102,241,0.1)' : 'var(--surface-color)',
                        color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                        cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                        fontFamily: 'inherit', transition: 'var(--transition)',
                        textTransform: 'capitalize',
                      }}
                    >
                      <Icon size={14} aria-hidden="true" />
                      {opt}
                    </button>
                  );
                })}
              </div>
            }
          />
        </SettingsCard>

        {/* Notifications */}
        <SettingsCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Bell size={20} aria-hidden="true" style={{ color: 'var(--accent-color)' }} />
            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-color)' }}>
              Notifications
            </h2>
          </div>

          <SettingsRow
            labelId="notif-label"
            label="Desktop Notifications"
            description="Get alerts for task updates and team messages"
            control={
              <ToggleSwitch
                id="notif-toggle"
                checked={notifications}
                onChange={setNotifications}
                label="Toggle desktop notifications"
              />
            }
          />
        </SettingsCard>

        {/* Save */}
        <button
          onClick={handleSave}
          className="btn btn-primary"
          style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem', fontSize: '0.95rem' }}
          aria-label="Save and apply settings"
        >
          <Save size={18} aria-hidden="true" />
          Save &amp; Apply
        </button>
      </div>

      <Toast message={toastMsg} />
    </div>
  );
}
