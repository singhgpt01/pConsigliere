import React from 'react';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { Reveal } from '../common/Reveal';
import { Button } from '../common/Button';

export const About: React.FC = () => {
  return (
    <Section id="about">
      <Container>
        <Reveal>
          <div className="about-split-layout">
            {/* Left Column (52% Content Width) */}
            <div className="about-text-column">
              <span className="section-eyebrow">WHO WE ARE</span>
              <h2 className="section-heading">
                Built Around Commercial Connections.
              </h2>

              <p className="about-body-paragraph">
                Consigliere Holdings facilitates commercial engagement across international commodity markets, connecting qualified buyers, suppliers, and relevant commercial partners.
              </p>

              <p className="about-body-paragraph">
                Our approach emphasizes clear requirements, professional communication, counterparty alignment, and coordinated commercial engagement.
              </p>

              <div className="about-supporting-statement">
                “Independent facilitation. International perspective. Structured commercial engagement.”
              </div>

              <div>
                <Button variant="editorial" href="#approach" style={{ padding: 0 }}>
                  <span>Understand Our Commercial Approach</span>
                  <span>→</span>
                </Button>
              </div>
            </div>

            {/* Right Column (48% Content Width) */}
            <div className="about-image-column">
              <img
                src="assets/images/about-vessels.jpg"
                alt="International bulk commercial carriers navigating global maritime trade channels"
                loading="lazy"
                width="640"
                height="480"
              />
              <div className="about-image-caption-bar">
                <span>COMMERCIAL INTERMEDIATION</span>
                <span>GLOBAL CORRIDORS</span>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
};
