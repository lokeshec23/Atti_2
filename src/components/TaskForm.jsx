import React, { useState, useId, useCallback } from 'react';
import { TASK_STATUS, PRIORITY } from '../utils/constants';

/**
 * Form for creating or editing a task.
 * All fields use useId() for label association, aria-required, and aria-invalid.
 */
export default function TaskForm({ onSubmit, initialData = null, defaultStatus = TASK_STATUS.TODO }) {
  const [formData, setFormData] = useState(() => ({
    title:    initialData?.title    ?? '',
    desc:     initialData?.desc     ?? '',
    priority: initialData?.priority ?? PRIORITY.MEDIUM,
    status:   initialData?.status   ?? defaultStatus,
  }));
  const [titleError, setTitleError] = useState('');

  const titleId    = useId();
  const descId     = useId();
  const priorityId = useId();
  const statusId   = useId();
  const titleErrId = useId();

  const update = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = formData.title.trim();
    if (!title) {
      setTitleError('Task title is required.');
      return;
    }
    if (title.length > 200) {
      setTitleError('Title must be 200 characters or fewer.');
      return;
    }
    setTitleError('');
    onSubmit({
      title,
      desc:     formData.desc.trim().slice(0, 2000),
      priority: formData.priority,
      status:   formData.status,
    });
  };

  const inputStyle = {
    padding: '0.75rem', borderRadius: '8px',
    border: '1.5px solid var(--border-color)',
    background: 'var(--bg-color)', color: 'var(--text-color)',
    fontSize: '0.95rem', fontFamily: 'inherit', width: '100%',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none',
  };
  const labelStyle = { fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-color)' };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label={initialData ? 'Edit task form' : 'Create task form'}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      {/* Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label htmlFor={titleId} style={labelStyle}>
          Task Title <span aria-hidden="true" style={{ color: 'var(--danger)' }}>*</span>
        </label>
        <input
          id={titleId}
          type="text"
          required
          aria-required="true"
          aria-invalid={!!titleError}
          aria-describedby={titleError ? titleErrId : undefined}
          placeholder="e.g. Implement Auth Flow"
          value={formData.title}
          onChange={e => { update('title', e.target.value); setTitleError(''); }}
          className="form-input"
        />
        {titleError && (
          <p id={titleErrId} role="alert" style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '0.1rem' }}>
            {titleError}
          </p>
        )}
      </div>

      {/* Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <label htmlFor={descId} style={labelStyle}>
          Description <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(optional)</span>
        </label>
        <textarea
          id={descId}
          rows={3}
          placeholder="Detailed explanation of the task…"
          value={formData.desc}
          onChange={e => update('desc', e.target.value)}
          className="form-input form-textarea"
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Priority + Status */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label htmlFor={priorityId} style={labelStyle}>Priority</label>
          <select
            id={priorityId}
            value={formData.priority}
            onChange={e => update('priority', e.target.value)}
            className="form-input form-select"
          >
            <option value={PRIORITY.LOW}>Low</option>
            <option value={PRIORITY.MEDIUM}>Medium</option>
            <option value={PRIORITY.HIGH}>High</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label htmlFor={statusId} style={labelStyle}>Status</label>
          <select
            id={statusId}
            value={formData.status}
            onChange={e => update('status', e.target.value)}
            className="form-input form-select"
          >
            <option value={TASK_STATUS.TODO}>To Do</option>
            <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
            <option value={TASK_STATUS.DONE}>Done</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
      >
        {initialData ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
}
