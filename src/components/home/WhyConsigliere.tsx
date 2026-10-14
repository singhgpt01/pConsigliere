import React from 'react';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';
import { pillarsData } from '../../data/commodities';

export const WhyConsigliere: React.FC = () => {
  return (
    <Section
      id="principles"
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--color-bg-secondary)'
      }}
    >
      <Container>
        <SectionHeading
          eyebrow="OUR PRINCIPLES"
          title="Commercial Relationships Deserve a Disciplined Approach."
        />

        <Reveal>
          <div className="pillars-grid">
            {pillarsData.map((pillar, idx) => (
              <div key={idx} className="pillar-card">
                <h3 className="pillar-title">{pillar.title}</h3>
                <p className="pillar-desc">{pillar.description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
};
