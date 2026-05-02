import React, { useState, useEffect } from 'react';

/**
 * Form for creating or editing a task.
 * Includes validation and clean UI.
 */
export default function TaskForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    priority: 'medium',
    status: 'todo'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    // Simple sanitization: trim all fields
    const sanitizedData = {
      ...formData,
      title: formData.title.trim(),
      desc: formData.desc.trim()
    };
    
    onSubmit(sanitizedData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="task-title" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          Task Title *
        </label>
        <input
          id="task-title"
          type="text"
          required
          placeholder="e.g. Implement Auth Flow"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
        <label htmlFor="task-desc" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          Description
        </label>
        <textarea
          id="task-desc"
          rows="3"
          placeholder="Detailed explanation of the task..."
          value={formData.desc}
          onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
          style={{
            padding: '0.75rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-color)',
            color: 'var(--text-color)',
            fontSize: '1rem',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="task-priority" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Priority
          </label>
          <select
            id="task-priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            style={{
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-color)',
              color: 'var(--text-color)',
              fontSize: '1rem'
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="task-status" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Status
          </label>
          <select
            id="task-status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            style={{
              padding: '0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-color)',
              color: 'var(--text-color)',
              fontSize: '1rem'
            }}
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
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
          transition: 'var(--transition)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
        onMouseOver={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
        onMouseOut={(e) => e.currentTarget.style.filter = 'none'}
      >
        {initialData ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
}
