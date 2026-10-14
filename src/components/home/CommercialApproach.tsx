import React from 'react';
import { Container } from '../layout/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';

interface ApproachStage {
  num: string;
  title: string;
  desc: string;
}

const approachStages: ApproachStage[] = [
  {
    num: "01",
    title: "Define the Requirement",
    desc: "Thoroughly specify product parameters, target volumes, preferred delivery incoterms (CIF/FOB), and overarching commercial objectives to establish an unambiguous framework."
  },
  {
    num: "02",
    title: "Qualify the Counterparties",
    desc: "Engage vetted market participants directly. Clarify principal representation, legal responsibilities, compliance parameters, and procedural expectations from the outset."
  },
  {
    num: "03",
    title: "Coordinate Commercial Details",
    desc: "Facilitate the disciplined exchange of verified documentation, technical assays, banking parameters, and logistical scheduling under mutual due diligence."
  },
  {
    num: "04",
    title: "Facilitate Agreed Milestones",
    desc: "Provide continuous commercial coordination, tracking, and alignment between counterparties through agreed milestones from contract lodgment to successful execution."
  }
];

export const CommercialApproach: React.FC = () => {
  return (
    <section className="section-padding approach-wrap" id="approach">
      <Container>
        <SectionHeading
          eyebrow="OUR APPROACH"
          title="Structured Engagement. Clear Commercial Intent."
          lead="Our facilitation framework guides participants through an orderly commercial trajectory, reducing uncertainty and ensuring mutual accountability at every phase."
        />

        {/* 4 Clear Stages Grid */}
        <Reveal>
          <div className="approach-steps-grid">
            {approachStages.map((stage) => (
              <div key={stage.num} className="approach-step-card">
                <div className="step-num">{stage.num}</div>
                <h3 className="step-title">{stage.title}</h3>
                <p className="step-desc">{stage.desc}</p>
              </div>
            ))}
          </div>

          <div className="approach-notice-box">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-brass)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0, marginTop: '2px' }}
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              <strong style={{ color: 'var(--color-walnut)' }}>Facilitation Scope Disclosure:</strong> The stages above describe our structured commercial coordination methodology. They do not constitute an unconditional guarantee of product availability, banking release, or transaction completion, which remain the direct contractual responsibility of the respective transacting principals.
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};
