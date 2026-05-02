import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Mail, MapPin, Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Modal from './Modal';
import MemberForm from './MemberForm';
import { STORAGE_KEYS } from '../utils/constants';

const INITIAL_MEMBERS = [
  { id: 1, name: 'Alice Johnson', role: 'Frontend Developer', email: 'alice@example.com', location: 'New York' },
  { id: 2, name: 'Bob Smith',     role: 'Backend Developer',  email: 'bob@example.com',   location: 'London' },
  { id: 3, name: 'Charlie Davis', role: 'Product Manager',    email: 'charlie@example.com', location: 'San Francisco' },
  { id: 4, name: 'Diana Prince',  role: 'UX Designer',        email: 'diana@example.com', location: 'Austin' },
];

/** Inline accessible confirm for delete */
function DeleteMemberConfirm({ memberName, onConfirm, onCancel }) {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="del-member-title"
      aria-describedby="del-member-desc"
      style={{
        background: 'var(--surface-color)', border: '1px solid var(--border-color)',
        borderRadius: '12px', padding: '1.25rem', boxShadow: 'var(--shadow-lg)',
        maxWidth: '320px', margin: '0 auto',
      }}
    >
      <p id="del-member-title" style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-color)' }}>
        Remove Member?
      </p>
      <p id="del-member-desc" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        <strong>{memberName}</strong> will be removed from the team directory.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button onClick={onCancel} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          Cancel
        </button>
        <button onClick={onConfirm} className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          Remove
        </button>
      </div>
    </div>
  );
}

export default function TeamDirectory() {
  const [members, setMembers]       = useLocalStorage(STORAGE_KEYS.TEAM_MEMBERS, INITIAL_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const addBtnRef = useRef(null);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return members;
    return members.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q),
    );
  }, [members, searchQuery]);

  const handleAddMember = useCallback(() => {
    setEditingMember(null);
    setConfirmDelete(null);
    setIsModalOpen(true);
  }, []);

  const handleEditMember = useCallback((member) => {
    setEditingMember(member);
    setConfirmDelete(null);
    setIsModalOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((member) => {
    setConfirmDelete(member);
    setEditingMember(null);
    setIsModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (confirmDelete) {
      setMembers(prev => prev.filter(m => m.id !== confirmDelete.id));
    }
    setConfirmDelete(null);
    setIsModalOpen(false);
  }, [confirmDelete, setMembers]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingMember(null);
    setConfirmDelete(null);
  }, []);

  const handleFormSubmit = useCallback((data) => {
    if (editingMember) {
      setMembers(prev => prev.map(m => m.id === editingMember.id ? { ...data, id: m.id } : m));
    } else {
      setMembers(prev => [...prev, { ...data, id: Date.now() }]);
    }
    setIsModalOpen(false);
  }, [editingMember, setMembers]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-color)', marginBottom: '0.35rem' }}>
            Team Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {members.length} member{members.length !== 1 ? 's' : ''} · Manage roles and contacts
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={16} aria-hidden="true"
              style={{
                position: 'absolute', left: '0.85rem', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-secondary)',
                pointerEvents: 'none',
              }}
            />
            <label htmlFor="member-search" className="sr-only">Search members</label>
            <input
              id="member-search"
              type="search"
              placeholder="Search by name, role, email…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search team members"
              style={{
                padding: '0.65rem 1rem 0.65rem 2.5rem',
                borderRadius: '12px', border: '1px solid var(--border-color)',
                background: 'var(--surface-color)', color: 'var(--text-color)',
                width: '280px', fontSize: '0.9rem', fontFamily: 'inherit',
              }}
            />
          </div>
          <button
            ref={addBtnRef}
            onClick={handleAddMember}
            className="btn btn-primary"
            aria-label="Add new team member"
          >
            <Plus size={18} aria-hidden="true" /> Add Member
          </button>
        </div>
      </header>

      {/* Member Grid */}
      {filteredMembers.length === 0 ? (
        <div
          role="status"
          style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}
        >
          <p style={{ fontSize: '1.1rem' }}>
            {searchQuery ? `No members found matching "${searchQuery}"` : 'No team members yet.'}
          </p>
        </div>
      ) : (
        <ul
          role="list"
          aria-label="Team members"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', listStyle: 'none' }}
        >
          {filteredMembers.map(member => (
            <li key={member.id}>
              <article
                className="member-card"
                aria-label={`${member.name}, ${member.role}`}
                style={{
                  background: 'var(--surface-color)', padding: '1.75rem',
                  borderRadius: '16px', border: '1px solid var(--border-color)',
                  display: 'flex', flexDirection: 'column', gap: '1.25rem',
                  position: 'relative',
                }}
              >
                {/* Avatar + name */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      aria-hidden="true"
                      style={{
                        width: '52px', height: '52px', borderRadius: '14px',
                        background: 'linear-gradient(135deg, var(--accent-color), #8b5cf6)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.35rem', fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)', flexShrink: 0,
                      }}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-color)' }}>
                        {member.name}
                      </h2>
                      <p style={{ color: 'var(--accent-color)', fontSize: '0.85rem', fontWeight: 500, margin: '0.2rem 0 0' }}>
                        {member.role || 'No role set'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => handleEditMember(member)}
                      className="icon-btn"
                      aria-label={`Edit ${member.name}`}
                    >
                      <Edit2 size={15} aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handleDeleteRequest(member)}
                      className="icon-btn"
                      aria-label={`Remove ${member.name} from team`}
                      style={{ color: 'var(--danger)' }}
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Contact details */}
                <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <Mail size={15} aria-hidden="true" style={{ color: 'var(--accent-color)', flexShrink: 0 }} />
                    <dt className="sr-only">Email</dt>
                    <dd style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      <a href={`mailto:${member.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {member.email}
                      </a>
                    </dd>
                  </div>
                  {member.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <MapPin size={15} aria-hidden="true" style={{ color: 'var(--accent-color)', flexShrink: 0 }} />
                      <dt className="sr-only">Location</dt>
                      <dd style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{member.location}</dd>
                    </div>
                  )}
                </dl>
              </article>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={confirmDelete ? 'Remove Member' : editingMember ? 'Edit Member' : 'Add Team Member'}
        triggerRef={addBtnRef}
      >
        {confirmDelete ? (
          <DeleteMemberConfirm
            memberName={confirmDelete.name}
            onConfirm={handleDeleteConfirm}
            onCancel={handleModalClose}
          />
        ) : (
          <MemberForm onSubmit={handleFormSubmit} initialData={editingMember} />
        )}
      </Modal>

      <style>{`
        .sr-only {
          position: absolute; width: 1px; height: 1px;
          padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0,0,0,0); white-space: nowrap; border: 0;
        }
      `}</style>
    </div>
  );
}
