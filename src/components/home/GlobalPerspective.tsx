import React from 'react';
import { Container } from '../layout/Container';
import { Reveal } from '../common/Reveal';

export const GlobalPerspective: React.FC = () => {
  return (
    <section className="section-padding reach-wrap" id="reach">
      <Container>
        <Reveal>
          <div className="reach-split-grid">
            {/* Left: Concise Narrative */}
            <div className="reach-text-col">
              <span className="section-eyebrow">INTERNATIONAL REACH</span>
              <h2 className="section-heading">
                Cross-Border Coordination across Global Trade Corridors.
              </h2>
              <p className="section-lead" style={{ marginBottom: '1.25rem' }}>
                Commodity flows require structured coordination across distinct jurisdictions, differing banking conventions, and established maritime logistics channels.
              </p>
              <p style={{ fontSize: '0.94rem', color: 'var(--color-text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                Consigliere Holdings facilitates connections linking origin producers, vetted trading houses, and institutional off-takers across key international hubs in Europe, the Middle East, the Americas, and Asia-Pacific.
              </p>

              <div className="corridor-metrics">
                <div>
                  <div className="corridor-metric-title">Energy & Distillates</div>
                  <div className="corridor-metric-sub">
                    ARA Hub, Middle East & US Gulf Coast export channels
                  </div>
                </div>
                <div>
                  <div className="corridor-metric-title">Industrial & Agricultural</div>
                  <div className="corridor-metric-sub">
                    Global fertilizer, sulphur, and agricultural commodity flows
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Tasteful Warm SVG Visual */}
            <div className="reach-graphic-box">
              <svg
                viewBox="0 0 520 280"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100%', height: 'auto', display: 'block' }}
                role="img"
                aria-label="Schematic diagram of international commodity trade facilitation corridors"
              >
                {/* Background & Subtle Coordinate Grid */}
                <rect width="520" height="280" rx="4" fill="#F5F0E7" stroke="#DCD2C4" />
                <line x1="40" y1="70" x2="480" y2="70" stroke="#DCD2C4" strokeDasharray="3 3" opacity="0.7" />
                <line x1="40" y1="140" x2="480" y2="140" stroke="#DCD2C4" opacity="0.9" />
                <line x1="40" y1="210" x2="480" y2="210" stroke="#DCD2C4" strokeDasharray="3 3" opacity="0.7" />
                <line x1="130" y1="30" x2="130" y2="250" stroke="#DCD2C4" strokeDasharray="3 3" opacity="0.6" />
                <line x1="260" y1="30" x2="260" y2="250" stroke="#DCD2C4" opacity="0.8" />
                <line x1="390" y1="30" x2="390" y2="250" stroke="#DCD2C4" strokeDasharray="3 3" opacity="0.6" />

                {/* Corridor Arcs */}
                <path d="M 130 130 Q 195 65 260 115" stroke="#B99A62" strokeWidth="2" fill="none" />
                <path d="M 260 115 Q 325 80 400 135" stroke="#B99A62" strokeWidth="2" fill="none" />
                <path d="M 145 175 Q 240 215 340 150" stroke="#654735" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.75" />

                {/* Nodes */}
                <circle cx="130" cy="130" r="5" fill="#30231D" stroke="#B99A62" strokeWidth="2" />
                <circle cx="260" cy="115" r="5" fill="#30231D" stroke="#B99A62" strokeWidth="2" />
                <circle cx="400" cy="135" r="5" fill="#30231D" stroke="#B99A62" strokeWidth="2" />
                <circle cx="340" cy="150" r="3.5" fill="#654735" />
                <circle cx="145" cy="175" r="3.5" fill="#654735" />

                {/* Node Labels */}
                <text x="130" y="112" fill="#30231D" fontSize="10.5" fontFamily="var(--font-serif)" fontWeight="600" textAnchor="middle">Americas</text>
                <text x="130" y="152" fill="#766B60" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">US GULF / LATAM</text>

                <text x="260" y="96" fill="#30231D" fontSize="10.5" fontFamily="var(--font-serif)" fontWeight="600" textAnchor="middle">Europe & Middle East</text>
                <text x="260" y="137" fill="#766B60" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">ARA / AG CORRIDORS</text>

                <text x="400" y="118" fill="#30231D" fontSize="10.5" fontFamily="var(--font-serif)" fontWeight="600" textAnchor="middle">Asia-Pacific</text>
                <text x="400" y="157" fill="#766B60" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">DESTINATION HUBS</text>
              </svg>

              <div
                style={{
                  marginTop: '1.25rem',
                  textAlign: 'center',
                  fontSize: '0.72rem',
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.08em'
                }}
              >
                INTERNATIONAL COMMODITY TRADE CORRIDOR FACILITATION
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};
