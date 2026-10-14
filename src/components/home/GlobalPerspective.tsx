import React from 'react';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { Reveal } from '../common/Reveal';

export const GlobalPerspective: React.FC = () => {
  return (
    <Section id="global" className="global-section">
      <Container>
        <Reveal>
          <div className="global-layout">
            <div>
              <span className="section-eyebrow">GLOBAL PERSPECTIVE</span>
              <h2 className="section-heading">
                Local Requirements. International Markets.
              </h2>
              <p className="section-lead" style={{ marginBottom: '1.5rem' }}>
                Commodity flows require cross-border coordination across distinct regulatory jurisdictions, commercial banking practices, and logistical hubs.
              </p>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: '1.75rem' }}>
                Consigliere Holdings supports commercial connections linking producers, established traders, and industrial buyers across the primary international trading corridors of Europe, the Middle East, the Americas, and the Asia-Pacific region.
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '2rem',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1.35rem',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1rem',
                      color: 'var(--color-accent-gold)',
                      fontWeight: '600'
                    }}
                  >
                    Energy & Petrochemicals
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    ARA, US Gulf Coast & Middle East Corridors
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1rem',
                      color: 'var(--color-accent-gold)',
                      fontWeight: '600'
                    }}
                  >
                    Agricultural Staples
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    South American & South Asian Origins
                  </div>
                </div>
              </div>
            </div>

            <div className="global-graphic-box">
              <svg
                className="corridor-lines-svg"
                viewBox="0 0 500 260"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Schematic diagram of international commodity corridors"
              >
                <rect width="500" height="260" rx="4" fill="#0A0C0F" />
                <line x1="40" y1="65" x2="460" y2="65" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="40" y1="130" x2="460" y2="130" stroke="rgba(255,255,255,0.08)" />
                <line x1="40" y1="195" x2="460" y2="195" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                <line x1="125" y1="30" x2="125" y2="230" stroke="rgba(255,255,255,0.04)" />
                <line x1="250" y1="30" x2="250" y2="230" stroke="rgba(255,255,255,0.06)" />
                <line x1="375" y1="30" x2="375" y2="230" stroke="rgba(255,255,255,0.04)" />

                <path d="M 120 115 Q 185 60 250 100" stroke="#C6A66B" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
                <path d="M 250 100 Q 315 75 390 120" stroke="#C6A66B" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
                <path d="M 140 160 Q 230 190 320 135" stroke="rgba(198,166,107,0.4)" strokeWidth="1.2" strokeDasharray="5 5" fill="none" />

                <circle cx="120" cy="115" r="4" fill="#C6A66B" />
                <circle cx="250" cy="100" r="4" fill="#C6A66B" />
                <circle cx="390" cy="120" r="4" fill="#C6A66B" />
                <circle cx="320" cy="135" r="3" fill="#A2A8B0" />
                <circle cx="140" cy="160" r="3" fill="#A2A8B0" />

                <text x="120" y="135" fill="#A2A8B0" fontSize="9" fontFamily="monospace" textAnchor="middle">Americas</text>
                <text x="250" y="88" fill="#F3F0E8" fontSize="9" fontFamily="monospace" textAnchor="middle">Europe / MidEast</text>
                <text x="390" y="140" fill="#A2A8B0" fontSize="9" fontFamily="monospace" textAnchor="middle">Asia-Pacific</text>
              </svg>

              <div
                style={{
                  marginTop: '1.25rem',
                  textAlign: 'center',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                ILLUSTRATIVE SCHEMATIC OF INTERNATIONAL COMMODITY FACILITATION CHANNELS
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
};
