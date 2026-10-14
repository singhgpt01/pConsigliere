import React from 'react';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';
import { approachStepsData } from '../../data/commodities';

export const CommercialApproach: React.FC = () => {
  return (
    <Section id="approach">
      <Container>
        <SectionHeading
          eyebrow="HOW WE WORK"
          title="Structured Engagement. Clear Commercial Intent."
          lead="Our facilitation framework guides participants through an orderly commercial trajectory, reducing uncertainty and ensuring mutual accountability at every phase."
        />

        <Reveal>
          <div className="approach-timeline">
            {approachStepsData.map((step) => (
              <div key={step.number} className="timeline-card">
                <div className="step-marker">{step.number}</div>
                <h3 className="timeline-step-title">{step.title}</h3>
                <p className="timeline-step-desc">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="approach-notice-box">
            <svg
              className="notice-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div className="notice-text">
              <strong>Facilitation Scope Disclosure:</strong> The stages above describe our general facilitation approach and structured methodology. They do not constitute an unconditional guarantee of product availability, counterparty legitimacy, commercial delivery, banking release, or transaction completion, which remain the contractual and legal responsibilities of the respective transacting principals.
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
};
