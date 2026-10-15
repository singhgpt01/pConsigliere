import React, { useEffect, useState } from 'react';
import { brandData } from '../../data/commodities';
import { Button } from '../common/Button';

export interface FormSubmissionData {
  fullName: string;
  companyName: string;
  businessEmail: string;
  country: string;
  commodity: string;
  quantity: string;
  destination: string;
  deliveryTerms: string;
  description: string;
  contactMethod?: string;
  referenceNumber?: string;
  submittedAt?: string;
}

export interface EnquiryConfirmationModalProps {
  isOpen: boolean;
  data: FormSubmissionData | null;
  onClose: () => void;
}

export const EnquiryConfirmationModal: React.FC<EnquiryConfirmationModalProps> = ({
  isOpen,
  data,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

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

  if (!isOpen || !data) return null;

  const handleCopy = () => {
    const text = `COMMERCIAL REQUIREMENT SPECIFICATION
Entity: ${data.companyName} (${data.country})
Contact: ${data.fullName} <${data.businessEmail}>
Commodity: ${data.commodity}
Volume: ${data.quantity}
Destination: ${data.destination} (${data.deliveryTerms})
Notes: ${data.description}
Preferred Channel: ${data.contactMethod}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const mailtoSubject = encodeURIComponent(`Commercial Requirement: ${data.commodity} - ${data.companyName}`);
  const mailtoBody = encodeURIComponent(
`Attn: Consigliere Holdings Commercial Desk

Full Name: ${data.fullName}
Company: ${data.companyName}
Jurisdiction: ${data.country}
Email: ${data.businessEmail}

Commodity: ${data.commodity}
Quantity: ${data.quantity}
Destination: ${data.destination}
Delivery Terms: ${data.deliveryTerms}

Technical Notes / Requirements:
${data.description}

Preferred Contact Method: ${data.contactMethod}`
  );

  return (
    <div
      className="modal-backdrop-layer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      <div
        className="modal-content-panel"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        <button
          type="button"
          className="modal-close-trigger"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <span className="section-eyebrow">COMMERCIAL DESK ACKNOWLEDGMENT</span>
        <h3
          id="enquiry-modal-title"
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.65rem',
            color: 'var(--text-primary)',
            marginBottom: '0.75rem'
          }}
        >
          Enquiry Summary Generated
        </h3>

        {data.referenceNumber && (
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{
              display: 'inline-block',
              padding: '0.35rem 0.75rem',
              background: 'var(--color-bg-secondary)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xs)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--color-brass-dark)'
            }}>
              Reference: {data.referenceNumber}
            </span>
          </div>
        )}

        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          Thank you, <strong>{data.fullName}</strong>. Your commercial requirement regarding <strong>{data.commodity}</strong> on behalf of <strong>{data.companyName}</strong> has been structured.
        </p>

        <div
          style={{
            background: 'var(--color-bg-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
            padding: '1.25rem',
            fontSize: '0.82rem',
            color: 'var(--text-secondary)',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem'
          }}
        >
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Target Quantity:</span>{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{data.quantity}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Destination Port:</span>{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{data.destination} ({data.deliveryTerms})</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Corporate Entity:</span>{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{data.companyName} ({data.country})</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Contact Email:</span>{' '}
            <strong style={{ color: 'var(--color-accent-gold)' }}>{data.businessEmail}</strong>
          </div>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.75rem' }}>
          Submissions are reviewed directly by the Consigliere Commercial Desk (<code>{brandData.contactEmail}</code>). You can copy these structured parameters or launch an email draft directly:
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            href={`mailto:${brandData.contactEmail}?subject=${mailtoSubject}&body=${mailtoBody}`}
            style={{ flex: '1', textAlign: 'center' }}
          >
            Send via Email Client
          </Button>

          <Button
            variant="secondary"
            onClick={handleCopy}
          >
            {copied ? '✓ Copied to Clipboard' : 'Copy Specifications'}
          </Button>
        </div>
      </div>
    </div>
  );
};
