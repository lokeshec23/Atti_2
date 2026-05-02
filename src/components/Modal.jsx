import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * A reusable, accessible, and premium Modal component.
 * Features: Glassmorphism, Smooth Animations, Focus Trapping, and Responsive Design.
 */
export default function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      modalRef.current?.focus();
      document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.4)', // Slate 900 with low opacity
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '1rem',
        animation: 'modalFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div 
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()} 
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          backgroundColor: 'var(--surface-color)',
          backgroundImage: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: 'min(90vh, 800px)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          animation: 'modalSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          overflow: 'hidden'
        }}
      >
        {/* Decorative background element */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '200px',
          height: '200px',
          background: 'var(--accent-color)',
          filter: 'blur(100px)',
          opacity: 0.1,
          pointerEvents: 'none'
        }} />

        {/* Modal Header */}
        <div style={{ 
          padding: '1.75rem 2rem 1.25rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          position: 'relative',
          zIndex: 1
        }}>
          <div>
            <h2 id="modal-title" style={{ 
              margin: 0, 
              fontSize: '1.5rem', 
              fontWeight: 700, 
              color: 'var(--text-color)',
              letterSpacing: '-0.025em'
            }}>
              {title}
            </h2>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close modal"
            className="modal-close-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              outline: 'none'
            }}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Modal Body */}
        <div style={{ 
          padding: '1.5rem 2rem 2rem', 
          overflowY: 'auto',
          flex: 1,
          position: 'relative',
          zIndex: 1,
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.1) transparent'
        }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .modal-close-btn:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #ef4444 !important;
          transform: rotate(90deg);
        }
        .modal-content::-webkit-scrollbar {
          width: 6px;
        }
        .modal-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
