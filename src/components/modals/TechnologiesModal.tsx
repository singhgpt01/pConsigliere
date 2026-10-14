import React, { useEffect } from 'react';
import { Button } from '../common/Button';

export interface TechnologiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnologiesModal: React.FC<TechnologiesModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop-layer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tech-modal-title"
    >
      <div className="modal-content-panel" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-trigger"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <span className="section-eyebrow">DIVISION OVERVIEW</span>
        <h3
          id="tech-modal-title"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.65rem',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}
        >
          Consigliere Technologies
        </h3>

        <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: '1.5rem' }}>
          Consigliere Technologies is a dedicated business division under the Consigliere Holdings umbrella.
        </p>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>
          In keeping with our group's policy of strict commercial integrity and transparency, formal technical capabilities, operational software tools, and service offerings will be published as its commercial mandates and corporate frameworks are formally finalized.
        </p>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            STATUS: UNDER FORMAL FORMATION
          </span>
          <Button
            variant="secondary"
            onClick={onClose}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.78rem' }}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
