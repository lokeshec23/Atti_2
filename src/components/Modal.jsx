import React, { useEffect, useRef, useCallback, useId } from 'react';
import { X } from 'lucide-react';

/**
 * Accessible Modal component.
 *
 * Features:
 * - ARIA dialog semantics (role, aria-modal, aria-labelledby, aria-describedby)
 * - Escape key closes modal
 * - Focus trapped inside while open
 * - Focus restored to triggering element on close
 * - Background scroll locked while open
 * - Smooth animations respecting prefers-reduced-motion
 * - Unique IDs via useId() (SSR safe, no collisions)
 */
export default function Modal({ isOpen, onClose, title, children, triggerRef, description }) {
  const modalRef    = useRef(null);
  const closeBtnRef = useRef(null);
  const titleId     = useId();
  const descId      = useId();

  // ── Focus trap & scroll lock ──────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Auto-focus close button (or first focusable element)
    const raf = requestAnimationFrame(() => closeBtnRef.current?.focus());

    const getFocusable = () =>
      Array.from(
        modalRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = getFocusable();
        if (focusable.length === 0) { e.preventDefault(); return; }
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow || '';
      triggerRef?.current?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      aria-hidden="false"
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000, padding: '1rem',
        animation: 'modalFadeIn 0.25s ease both',
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface-color)',
          borderRadius: '20px',
          width: '100%', maxWidth: '560px',
          maxHeight: 'min(90vh, 800px)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 25px 60px -12px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.06)',
          border: '1px solid var(--border-color)',
          animation: 'modalSlideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
          overflow: 'hidden', position: 'relative',
        }}
      >
        {/* Decorative glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: '-80px', right: '-80px',
            width: '180px', height: '180px',
            background: 'var(--accent-color)',
            filter: 'blur(80px)', opacity: 0.08, pointerEvents: 'none',
          }}
        />

        {/* Header */}
        <div
          style={{
            padding: '1.5rem 1.75rem 1.25rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '1px solid var(--border-color)',
            flexShrink: 0, position: 'relative', zIndex: 1,
          }}
        >
          <h2
            id={titleId}
            style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-color)', letterSpacing: '-0.02em' }}
          >
            {title}
          </h2>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close dialog"
            className="icon-btn modal-close-btn"
            style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0 }}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Optional description */}
        {description && (
          <p
            id={descId}
            style={{ padding: '0.75rem 1.75rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)', flexShrink: 0 }}
          >
            {description}
          </p>
        )}

        {/* Body */}
        <div style={{ padding: '1.5rem 1.75rem 1.75rem', overflowY: 'auto', flex: 1, position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(32px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .modal-overlay { animation: none; }
          .modal-overlay > div { animation: none; }
        }
        .modal-close-btn:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          color: var(--danger) !important;
          transform: rotate(90deg);
          transition: var(--transition), transform 0.3s !important;
        }
      `}</style>
    </div>
  );
}
