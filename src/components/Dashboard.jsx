import React from 'react';
import { Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Tasks', value: '24', icon: <CheckCircle size={24} className="text-primary" /> },
    { label: 'In Progress', value: '8', icon: <Clock size={24} className="text-warning" /> },
    { label: 'Team Members', value: '12', icon: <Users size={24} className="text-info" /> },
    { label: 'Productivity', value: '87%', icon: <TrendingUp size={24} className="text-success" /> }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Dashboard Overview</h2>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{
            background: 'var(--surface-color)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ 
              background: 'var(--bg-color)', 
              padding: '1rem', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{
        background: 'var(--surface-color)',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        minHeight: '300px'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Recent Activity</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Activity feed will appear here...</p>
      </div>
    </div>
  );
}
