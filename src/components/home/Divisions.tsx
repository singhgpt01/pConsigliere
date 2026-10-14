import React from 'react';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';
import { Button } from '../common/Button';
import { divisionsData } from '../../data/commodities';

export interface DivisionsProps {
  onOpenTechnologies: () => void;
}

export const Divisions: React.FC<DivisionsProps> = ({ onOpenTechnologies }) => {
  return (
    <Section id="divisions">
      <Container>
        <SectionHeading
          eyebrow="CORPORATE STRUCTURE"
          title="One Group. Distinct Areas of Focus."
          lead="Consigliere Holdings structures its commercial activities into dedicated operating units aligned with long-term commercial objectives."
        />

        <Reveal>
          <div className="divisions-grid">
            {divisionsData.map((division) => (
              <div key={division.id} className="division-panel">
                <span
                  className="division-label"
                  style={{ color: division.isPending ? 'var(--text-muted)' : 'var(--color-accent-gold)' }}
                >
                  {division.label}
                </span>
                <h3 className="division-name">{division.name}</h3>
                <p className="division-desc">{division.description}</p>
                <div className="division-cta-wrap">
                  {division.isPending ? (
                    <Button
                      variant="secondary"
                      onClick={onOpenTechnologies}
                      style={{ width: '100%' }}
                    >
                      {division.primaryAction}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      href={division.anchor || '#commodities'}
                      style={{ width: '100%' }}
                    >
                      {division.primaryAction}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
};
