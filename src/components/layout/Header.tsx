import React, { useState } from 'react';
import { mainNavLinks } from '../../data/navigation';

export interface HeaderProps {
  isScrolled: boolean;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({ isScrolled, activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`site-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container-wide nav-inner">
          {/* Brand Identity */}
          <a href="#" className="brand-identity" aria-label="Consigliere Holdings Home">
            <div className="brand-monogram">C</div>
            <span className="brand-wordmark">CONSIGLIERE HOLDINGS</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="nav-links" aria-label="Primary Navigation">
            {mainNavLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`nav-item ${activeSection === link.id ? 'active' : ''}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions & Mobile Menu Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
            <a
              href="#contact"
              className="btn btn-primary nav-cta-desktop"
            >
              Discuss a Requirement
            </a>

            <button
              type="button"
              className="nav-toggle-btn"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div className="brand-identity">
              <div className="brand-monogram">C</div>
              <span className="brand-wordmark" style={{ fontSize: '1rem' }}>CONSIGLIERE</span>
            </div>
            <button
              type="button"
              onClick={closeMobileMenu}
              style={{ padding: '0.5rem', color: 'var(--color-walnut)', background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {mainNavLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`mobile-nav-link ${activeSection === link.id ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
            <a
              href="#contact"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', textAlign: 'center' }}
              onClick={closeMobileMenu}
            >
              Discuss a Requirement
            </a>
          </div>
        </div>
      )}
    </>
  );
};
