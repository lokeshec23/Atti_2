import React, { useState, useId, useRef, useEffect } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { STORAGE_KEYS } from '../utils/constants';
import { isValidEmail, validatePassword } from '../utils/sanitize';

/** Visual password strength indicator */
function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /[0-9]/.test(password) },
  ];
  const strength = checks.filter(c => c.pass).length;
  const colors = ['var(--danger)', 'var(--warning)', 'var(--success)'];
  const labels = ['Weak', 'Fair', 'Strong'];

  return (
    <div aria-live="polite" aria-label={`Password strength: ${labels[strength - 1] ?? 'Weak'}`}>
      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.4rem' }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: i < strength ? colors[strength - 1] : 'var(--border-color)',
              transition: 'background 0.3s',
            }}
          />
        ))}
      </div>
      <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {checks.map(c => (
          <li key={c.label} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: c.pass ? 'var(--success)' : 'var(--text-secondary)' }}>
            {c.pass ? <Check size={10} aria-hidden="true" /> : <X size={10} aria-hidden="true" />}
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Register({ onRegister, onSwitch }) {
  const [name,            setName]            = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd,         setShowPwd]         = useState(false);
  const [error,           setError]           = useState('');
  const [isLoading,       setIsLoading]       = useState(false);

  const nameId    = useId();
  const emailId   = useId();
  const pwdId     = useId();
  const confirmId = useId();
  const errorId   = useId();
  const nameRef   = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ── Validation ────────────────────────────────
    if (!name.trim() || name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    const pwdCheck = validatePassword(password);
    if (!pwdCheck.valid) {
      setError(pwdCheck.message);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    await new Promise(res => setTimeout(res, 600));

    try {
      // Check if email already registered
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      const users  = stored ? JSON.parse(stored) : [];
      if (users.find(u => u.email === email.toLowerCase())) {
        setError('An account with this email already exists. Please sign in.');
        setIsLoading(false);
        return;
      }

      // Store new user (plain text password — demo only, not for production)
      const newUser = { email: email.toLowerCase(), name: name.trim(), password };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...users, newUser]));

      // Set session
      const sessionUser = { email: newUser.email, name: newUser.name };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sessionUser));
      onRegister();
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex', minHeight: '100vh',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-color)', padding: '1rem',
      }}
    >
      <div
        style={{
          background: 'var(--surface-color)', padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: '0 20px 60px -12px rgba(0,0,0,0.15)',
          width: '100%', maxWidth: '420px',
          border: '1px solid var(--border-color)',
        }}
      >
        {/* Brand mark */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            aria-hidden="true"
            style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: 'var(--accent-color)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', marginBottom: '1rem',
            }}
          >
            ✦
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '0.4rem' }}>
            Create an account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Join CollabNode and start collaborating
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            id={errorId}
            role="alert"
            aria-live="assertive"
            style={{
              marginBottom: '1rem', padding: '0.75rem 1rem',
              background: 'rgba(239,68,68,0.08)', color: 'var(--danger)',
              border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          aria-label="Create account form"
          noValidate
          style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}
        >
          {/* Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor={nameId} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color)' }}>
              Full Name
            </label>
            <input
              id={nameId}
              ref={nameRef}
              type="text"
              autoComplete="name"
              required
              minLength={2}
              value={name}
              onChange={e => setName(e.target.value)}
              aria-describedby={error ? errorId : undefined}
              aria-required="true"
              placeholder="Jane Smith"
              className="form-input"
            />
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor={emailId} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color)' }}>
              Email
            </label>
            <input
              id={emailId}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-required="true"
              placeholder="you@example.com"
              className="form-input"
            />
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor={pwdId} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id={pwdId}
                type={showPwd ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                aria-required="true"
                aria-describedby={`${pwdId}-strength`}
                placeholder="••••••••"
                className="form-input"
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-secondary)', display: 'flex', padding: '0.25rem',
                }}
              >
                {showPwd
                  ? <EyeOff size={16} aria-hidden="true" />
                  : <Eye size={16} aria-hidden="true" />
                }
              </button>
            </div>
            <div id={`${pwdId}-strength`}>
              <PasswordStrength password={password} />
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor={confirmId} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color)' }}>
              Confirm Password
            </label>
            <input
              id={confirmId}
              type={showPwd ? 'text' : 'password'}
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              aria-required="true"
              aria-invalid={confirmPassword.length > 0 && confirmPassword !== password}
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', justifyContent: 'center', marginTop: '0.5rem' }}
          >
            {isLoading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitch}
            style={{
              background: 'none', border: 'none',
              color: 'var(--accent-color)', cursor: 'pointer',
              fontWeight: 600, padding: 0, fontFamily: 'inherit', fontSize: 'inherit',
            }}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
