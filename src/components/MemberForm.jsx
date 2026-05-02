import React, { useState, useId, useCallback } from 'react';
import { isValidEmail } from '../utils/sanitize';

/**
 * Form for adding or editing a team member.
 * Uses useId() for accessible label/input association.
 * Validates required fields and email format.
 */
export default function MemberForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    name:     initialData?.name     ?? '',
    role:     initialData?.role     ?? '',
    email:    initialData?.email    ?? '',
    location: initialData?.location ?? '',
  });
  const [errors, setErrors] = useState({});

  const nameId     = useId();
  const roleId     = useId();
  const emailId    = useId();
  const locationId = useId();
  const nameErrId  = useId();
  const emailErrId = useId();

  const update = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error on change
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }
    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      name:     formData.name.trim(),
      role:     formData.role.trim(),
      email:    formData.email.trim().toLowerCase(),
      location: formData.location.trim(),
    });
  };

  const labelStyle = { fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color)' };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={initialData ? 'Edit member form' : 'Add team member form'}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      {/* Full Name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label htmlFor={nameId} style={labelStyle}>
          Full Name <span aria-hidden="true" style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input
          id={nameId}
          type="text"
          required
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? nameErrId : undefined}
          placeholder="e.g. Alice Johnson"
          value={formData.name}
          onChange={e => update('name', e.target.value)}
          className="form-input"
        />
        {errors.name && (
          <p id={nameErrId} role="alert" style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>
            {errors.name}
          </p>
        )}
      </div>

      {/* Role */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label htmlFor={roleId} style={labelStyle}>
          Role <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(optional)</span>
        </label>
        <input
          id={roleId}
          type="text"
          placeholder="e.g. Senior Frontend Engineer"
          value={formData.role}
          onChange={e => update('role', e.target.value)}
          className="form-input"
        />
      </div>

      {/* Email */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label htmlFor={emailId} style={labelStyle}>
          Email <span aria-hidden="true" style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input
          id={emailId}
          type="email"
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? emailErrId : undefined}
          placeholder="alice@example.com"
          value={formData.email}
          onChange={e => update('email', e.target.value)}
          className="form-input"
        />
        {errors.email && (
          <p id={emailErrId} role="alert" style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Location */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label htmlFor={locationId} style={labelStyle}>
          Location <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(optional)</span>
        </label>
        <input
          id={locationId}
          type="text"
          placeholder="e.g. San Francisco, CA"
          value={formData.location}
          onChange={e => update('location', e.target.value)}
          className="form-input"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
      >
        {initialData ? 'Update Member' : 'Add to Team'}
      </button>
    </form>
  );
}
