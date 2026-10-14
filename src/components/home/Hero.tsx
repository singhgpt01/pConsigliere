import React from 'react';
import { Container } from '../layout/Container';

export const Hero: React.FC = () => {
  return (
    <section className="hero-wrap" id="hero">
      <div className="hero-ambient-glow" />

      <Container>
        <div className="hero-grid">
          {/* Left Column: Narrative & Action */}
          <div className="hero-content">
            <span className="hero-eyebrow">
              GLOBAL COMMODITIES · COMMERCIAL FACILITATION
            </span>

            <h1 className="hero-title">
              Facilitating the Flow<br />
              of Global Commerce.
            </h1>

            <p className="hero-lead">
              Connecting qualified commercial counterparties across energy, industrial, and agricultural commodity markets through structured engagement and coordinated commercial processes.
            </p>

            <div className="hero-actions">
              <a href="#commodities" className="btn hero-btn-primary">
                Explore Our Commodities
              </a>
              <a href="#contact" className="btn hero-btn-secondary">
                Discuss a Requirement
              </a>
            </div>

            {/* Quick Strategic Highlights */}
            <div className="hero-highlights-strip">
              <div className="hero-highlight-pill">
                <span className="pill-dot" />
                Refined Petroleum & Distillates
              </div>
              <div className="hero-highlight-pill">
                <span className="pill-dot" />
                Industrial Sulphur & Fertilizers
              </div>
              <div className="hero-highlight-pill">
                <span className="pill-dot" />
                Structured Bilateral Execution
              </div>
            </div>
          </div>

          {/* Right Column: Premium Maritime Trade Photograph */}
          <div className="hero-media-wrapper">
            <div className="hero-image-frame">
              <img
                src="/assets/images/hero-trade-vessel.jpg"
                alt="International commercial container cargo vessel at deepwater logistics terminal"
                className="hero-image-asset"
                loading="eager"
              />
              <div className="hero-image-overlay-gradient" />
              <div className="hero-image-caption">
                <div className="caption-badge">MARITIME LOGISTICS HUB</div>
                <div className="caption-text">International Deepwater Commercial Trade Corridor</div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Discreet Animated Scroll Indicator */}
      <div className="hero-scroll-indicator" aria-hidden="true">
        <span>Scroll</span>
        <div className="scroll-track-line" />
      </div>
    </section>
  );
};
