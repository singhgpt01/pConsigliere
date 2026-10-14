import React, { useRef, useEffect } from 'react';
import { Container } from '../layout/Container';
import { Button } from '../common/Button';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export const Hero: React.FC = () => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (backdropRef.current && scrollY < window.innerHeight) {
            backdropRef.current.style.transform = `translate3d(0, ${scrollY * 0.12}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReduced]);

  return (
    <section className="hero-wrap" id="hero">
      <div
        ref={backdropRef}
        className="hero-backdrop"
        style={{ backgroundImage: `url('assets/images/hero-port.jpg')` }}
      />
      <div className="hero-overlay-gradient" />
      <div className="hero-overlay-vignette" />

      <Container>
        <div className="hero-content">
          <span className="hero-eyebrow">
            GLOBAL COMMODITIES | COMMERCIAL FACILITATION
          </span>

          <h1 className="hero-title">
            Facilitating the Flow<br />
            of Global Commerce.
          </h1>

          <p className="hero-lead">
            Connecting commercial counterparties across energy, industrial, and agricultural commodity markets.
          </p>

          <div className="hero-actions">
            <Button variant="primary" href="#commodities">
              Explore Our Commodities
            </Button>
            <Button variant="secondary" href="#contact">
              Discuss a Requirement
            </Button>
          </div>
        </div>
      </Container>

      {/* Animated Scroll Indicator */}
      <div className="hero-scroll-indicator" aria-hidden="true">
        <span>Scroll</span>
        <div className="scroll-track-line" />
      </div>
    </section>
  );
};
