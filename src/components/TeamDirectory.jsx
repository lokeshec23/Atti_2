import React, { useState, useMemo } from 'react';
import { Mail, Phone, MapPin, Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Modal from './Modal';
import MemberForm from './MemberForm';

const initialMembers = [
  { id: 1, name: 'Alice Johnson', role: 'Frontend Developer', email: 'alice@example.com', location: 'New York' },
  { id: 2, name: 'Bob Smith', role: 'Backend Developer', email: 'bob@example.com', location: 'London' },
  { id: 3, name: 'Charlie Davis', role: 'Product Manager', email: 'charlie@example.com', location: 'San Francisco' },
  { id: 4, name: 'Diana Prince', role: 'UX Designer', email: 'diana@example.com', location: 'Austin' }
];

export default function TeamDirectory() {
  const [members, setMembers] = useLocalStorage('team_members', initialMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const handleAddMember = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDeleteMember = (id) => {
    if (window.confirm('Remove this member from the team?')) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleFormSubmit = (data) => {
    if (editingMember) {
      setMembers(prev => prev.map(m => m.id === editingMember.id ? { ...data, id: m.id } : m));
    } else {
      setMembers(prev => [...prev, { ...data, id: Date.now() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Team Directory</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your team members and their roles</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by name, role, email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.75rem 1rem 0.75rem 2.75rem',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                background: 'var(--surface-color)',
                color: 'var(--text-color)',
                width: '320px',
                fontSize: '0.95rem'
              }}
            />
          </div>
          <button 
            onClick={handleAddMember}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            <Plus size={20} /> Add Member
          </button>
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredMembers.map(member => (
          <div key={member.id} className="member-card" style={{
            background: 'var(--surface-color)',
            padding: '1.75rem',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, var(--accent-color), #8b5cf6)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>{member.name}</h3>
                  <p style={{ color: 'var(--accent-color)', fontSize: '0.875rem', fontWeight: 500, margin: '0.25rem 0 0 0' }}>{member.role}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleEditMember(member)}
                  style={{ background: 'var(--bg-color)', border: 'none', color: 'var(--text-secondary)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteMember(member.id)}
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: 'var(--danger)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Mail size={16} style={{ color: 'var(--accent-color)' }} /> <span>{member.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <MapPin size={16} style={{ color: 'var(--accent-color)' }} /> <span>{member.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '1.2rem' }}>No members found matching your search.</p>
        </div>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingMember ? 'Edit Member Info' : 'Add New Member'}
      >
        <MemberForm onSubmit={handleFormSubmit} initialData={editingMember} />
      </Modal>
    </div>
  );
}
