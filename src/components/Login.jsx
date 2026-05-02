import React, { useState, useId, useRef, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { STORAGE_KEYS } from '../utils/constants';
import { isValidEmail, validatePassword } from '../utils/sanitize';

export default function Login({ onLogin, onSwitch }) {
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [showPwd,    setShowPwd]    = useState(false);
  const [error,      setError]      = useState('');
  const [isLoading,  setIsLoading]  = useState(false);
  const [attempts,   setAttempts]   = useState(0);

  const emailId   = useId();
  const passwordId = useId();
  const errorId   = useId();
  const emailRef  = useRef(null);

  /** Auto-focus email on mount */
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ── Client-side validation ───────────────────
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    const pwdCheck = validatePassword(password);
    if (!pwdCheck.valid) {
      setError(pwdCheck.message);
      return;
    }

    // ── Rate limiting (5 attempts) ───────────────
    if (attempts >= 5) {
      setError('Too many failed attempts. Please refresh the page to try again.');
      return;
    }

    setIsLoading(true);

    // Simulate auth delay (replace with real API call)
    await new Promise(res => setTimeout(res, 600));

    // ── Check against registered users ──────────
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USERS);
      const users  = stored ? JSON.parse(stored) : [];
      const match  = users.find(u => u.email === email.toLowerCase());

      if (match) {
        // Note: in a real app use bcrypt/argon2 server-side
        // Here we just check the stored password (demo only)
        if (match.password === password) {
          const sessionUser = { email: match.email, name: match.name };
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sessionUser));
          onLogin();
        } else {
          setAttempts(a => a + 1);
          setError('Incorrect email or password.');
        }
      } else {
        // Allow first-time login with any credentials (demo fallback)
        const sessionUser = { email: email.toLowerCase(), name: email.split('@')[0] };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sessionUser));
        onLogin();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex', height: '100vh',
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
            Welcome back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sign in to continue to CollabNode
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
          aria-label="Sign in form"
          noValidate
          style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
        >
          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor={emailId} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color)' }}>
              Email
            </label>
            <input
              id={emailId}
              ref={emailRef}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={!!error}
              placeholder="you@example.com"
              className="form-input"
            />
          </div>

          {/* Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor={passwordId} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id={passwordId}
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                required
                minLength={8}
                value={password}
                onChange={e => setPassword(e.target.value)}
                aria-describedby={error ? errorId : undefined}
                aria-invalid={!!error}
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
                  color: 'var(--text-secondary)', display: 'flex',
                  padding: '0.25rem',
                }}
              >
                {showPwd
                  ? <EyeOff size={16} aria-hidden="true" />
                  : <Eye size={16} aria-hidden="true" />
                }
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', justifyContent: 'center', marginTop: '0.5rem' }}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onSwitch}
            style={{
              background: 'none', border: 'none',
              color: 'var(--accent-color)', cursor: 'pointer',
              fontWeight: 600, padding: 0, fontFamily: 'inherit',
              fontSize: 'inherit',
            }}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
