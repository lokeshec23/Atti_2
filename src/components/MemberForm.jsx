import React, { useState, useEffect } from 'react';

/**
 * Form for adding or editing a team member.
 */
export default function MemberForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    location: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    
    onSubmit({
      ...formData,
      name: formData.name.trim(),
      role: formData.role.trim(),
      email: formData.email.trim(),
      location: formData.location.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="member-name" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          Full Name *
        </label>
        <input
          id="member-name"
          type="text"
          required
          placeholder="e.g. Alice Johnson"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-color)',
            color: 'var(--text-color)',
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="member-role" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          Role
        </label>
        <input
          id="member-role"
          type="text"
          placeholder="e.g. Senior Frontend Engineer"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          style={{
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-color)',
            color: 'var(--text-color)',
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="member-email" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          Email *
        </label>
        <input
          id="member-email"
          type="email"
          required
          placeholder="alice@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={{
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-color)',
            color: 'var(--text-color)',
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="member-location" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          Location
        </label>
        <input
          id="member-location"
          type="text"
          placeholder="e.g. San Francisco, CA"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          style={{
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-color)',
            color: 'var(--text-color)',
            fontSize: '1rem'
          }}
        />
      </div>

      <button
        type="submit"
        style={{
          marginTop: '1rem',
          padding: '0.875rem',
          borderRadius: '6px',
          border: 'none',
          background: 'var(--accent-color)',
          color: 'white',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'var(--transition)'
        }}
      >
        {initialData ? 'Update Member' : 'Add to Team'}
      </button>
    </form>
  );
}
