import React from 'react';
import { brandData } from '../../data/commodities';
import { footerColumns } from '../../data/navigation';
import { Container } from './Container';

export interface FooterProps {
  onOpenTechnologies: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTechnologies }) => {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent, isModalTrigger?: boolean) => {
    if (isModalTrigger) {
      e.preventDefault();
      onOpenTechnologies();
    }
  };

  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-top-grid">
          <div>
            <div className="brand-identity" style={{ marginBottom: '1.15rem' }}>
              <div className="brand-monogram">C</div>
              <div className="brand-title-wrap">
                <span className="brand-wordmark">CONSIGLIERE HOLDINGS</span>
                <span className="brand-sub">Commercial Facilitation</span>
              </div>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.75', maxWidth: '360px', marginBottom: '1.25rem' }}>
              {brandData.supportingStatement} {brandData.positioning} Connecting qualified counterparties across selected international energy, industrial, and agricultural markets.
            </p>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Domain: <a href={brandData.domain} style={{ color: 'var(--color-accent-gold)' }}>consigliereholdings.com</a>
            </div>
          </div>

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

        {/* Commodity Availability Legal Disclaimer */}
        <div className="footer-disclaimer-text">
          <strong>Commercial Disclaimer:</strong> Consigliere Holdings operates as an independent commercial facilitator and intermediary, connecting qualified buyers, suppliers, procurement partners, and other commercial counterparties across international commodity markets. All commodity availability, specifications, allocations, quantities, prices, and transaction terms are strictly subject to commercial confirmation, independent surveyor assay, and counterparty qualification. Consigliere Holdings does not claim title ownership of refining assets, storage facilities, maritime vessels, or physical inventories unless specifically and independently verified.
        </div>

        <div className="footer-bottom-bar">
          <div>
            © {currentYear} Consigliere Holdings Ltd. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <span>Commercial Intermediation</span>
            <span>International Facilitation</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};
