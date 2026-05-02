import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function TeamDirectory() {
  const members = [
    { id: 1, name: 'Alice Johnson', role: 'Frontend Developer', email: 'alice@example.com', location: 'New York' },
    { id: 2, name: 'Bob Smith', role: 'Backend Developer', email: 'bob@example.com', location: 'London' },
    { id: 3, name: 'Charlie Davis', role: 'Product Manager', email: 'charlie@example.com', location: 'San Francisco' },
    { id: 4, name: 'Diana Prince', role: 'UX Designer', email: 'diana@example.com', location: 'Austin' }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Team Directory</h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {members.map(member => (
          <div key={member.id} style={{
            background: 'var(--surface-color)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--accent-color)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 'bold'
              }}>
                {member.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 500 }}>{member.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{member.role}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <Mail size={14} /> <span>{member.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <MapPin size={14} /> <span>{member.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
