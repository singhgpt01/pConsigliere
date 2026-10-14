import React from 'react';
import { Container } from './Container';
import { brandData } from '../../data/commodities';
import { footerColumns } from '../../data/navigation';

export interface FooterProps {
  onOpenTechnologies?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTechnologies }) => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent, isModalTrigger?: boolean) => {
    if (isModalTrigger && onOpenTechnologies) {
      e.preventDefault();
      onOpenTechnologies();
    }
  };

  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-top-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <a href="#" className="brand-identity">
              <div className="brand-monogram">C</div>
              <div className="brand-title-wrap">
                <span className="brand-wordmark">CONSIGLIERE HOLDINGS</span>
                <span className="brand-sub">Commercial Facilitation</span>
              </div>
            </a>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-sand)', lineHeight: '1.7', maxWidth: '340px', marginTop: '1rem', marginBottom: '1.25rem' }}>
              International commodity commercial facilitation connecting vetted counterparties across global energy, industrial, and agricultural markets.
            </p>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-sand)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div>Commercial Desk: <a href={`mailto:${brandData.deskEmail}`} style={{ color: 'var(--color-brass-light)' }}>{brandData.deskEmail}</a></div>
              <div>Direct Communication: <a href={`mailto:${brandData.contactEmail}`} style={{ color: 'var(--color-brass-light)' }}>{brandData.contactEmail}</a></div>
            </div>
          </div>

          {/* Navigation & Commodity Columns */}
          {footerColumns.map((col, idx) => (
            <div key={idx}>
              <h4 className="footer-col-header">{col.title}</h4>
              <div className="footer-menu-list">
                {col.links.map((link, lIdx) => (
                  <a
                    key={lIdx}
                    href={link.href}
                    className="footer-menu-link"
                    onClick={(e) => handleLinkClick(e, link.isModalTrigger)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Commercial Disclaimer */}
        <div className="footer-disclaimer-box">
          <strong style={{ color: 'var(--color-brass-light)' }}>Commercial Intermediation Disclosure:</strong> Consigliere Holdings operates as an independent commercial facilitator and transaction coordinator. All commodity transactions, specifications, refinery allocations, volumes, and delivery schedules are subject to counterparty verification, independent inspection (SGS/Saybolt), and definitive bilateral contract execution. Consigliere Holdings does not hold title to physical refining assets, storage facilities, or vessels unless expressly verified.
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div>
            © {currentYear} Consigliere Holdings Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.75rem' }}>
            <span>Commercial Facilitation</span>
            <span>Structured Trade Intermediation</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
