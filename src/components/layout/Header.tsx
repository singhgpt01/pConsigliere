import React, { useState } from 'react';
import { mainNavLinks } from '../../data/navigation';
import { Button } from '../common/Button';

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
            <div className="brand-title-wrap">
              <span className="brand-wordmark">CONSIGLIERE HOLDINGS</span>
              <span className="brand-sub">Commercial Facilitation</span>
            </div>
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

          {/* Actions & Mobile Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <Button
              variant="secondary"
              href="#contact"
              className="nav-cta nav-cta-desktop"
            >
              Discuss a Requirement
            </Button>

            <button
              type="button"
              className="nav-toggle-btn"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-panel">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {mainNavLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="nav-item"
                style={{ fontSize: '1.2rem' }}
                onClick={closeMobileMenu}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.75rem' }}>
            <Button
              variant="primary"
              href="#contact"
              style={{ width: '100%' }}
              onClick={closeMobileMenu}
            >
              Discuss a Requirement
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
