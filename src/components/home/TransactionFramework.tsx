import React, { useState } from 'react';
import { Container } from '../layout/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';

interface FrameworkStage {
  step: string;
  title: string;
  description: string;
  items: string[];
  protocolNote: string;
}

const frameworkStages: FrameworkStage[] = [
  {
    step: "01",
    title: "Mutual Counterparty Qualification",
    description: "We establish the identity, authority, commercial requirements, and preliminary readiness of the parties involved.",
    items: [
      "Corporate and counterparty identification & standing",
      "Product specifications, quantity, destination & delivery terms",
      "Preliminary assessment of financial readiness & commercial capacity",
      "Initial understanding of proposed supply & delivery structure"
    ],
    protocolNote: "Confidential terminal account details and sensitive operational information need not be disclosed prematurely."
  },
  {
    step: "02",
    title: "Commercial Agreement",
    description: "We facilitate alignment on the commercial terms and contractual responsibilities governing the proposed transaction.",
    items: [
      "Product specification, assay standards & volume commitments",
      "Pricing basis, index references & delivery location",
      "Agreed delivery structure & confirmed payment mechanisms",
      "Contractual terms covering measurement, title, risk & conditions"
    ],
    protocolNote: "Parties progress through indicative terms or term sheet, written acceptance or ICPO, and SPA execution as applicable."
  },
  {
    step: "03",
    title: "Conditions Precedent & Operational Verification",
    description: "Following contractual agreement, we coordinate the relevant financial, supply, terminal, and operational verification requirements.",
    items: [
      "Confirmation of agreed commercial payment arrangements",
      "Appropriate verification of supply capability & entitlement",
      "Authorised coordination of terminal or vessel requirements",
      "Confirmation of relevant operational nominations & acceptance"
    ],
    protocolNote: "Irreversible product movement does not commence before applicable conditions precedent are satisfied or formally waived. Verification is conducted through direct authorized channels."
  },
  {
    step: "04",
    title: "Delivery, Documentation & Settlement",
    description: "We coordinate the agreed delivery process and the documentation required to support contractual delivery and settlement.",
    items: [
      "Applicable quantity & quality determination by independent surveyor",
      "Relevant terminal, inspection, and official delivery documentation",
      "Contractual title and risk transfer provisions",
      "Settlement and payment against agreed contractual triggers"
    ],
    protocolNote: "The applicable delivery model is mutually agreed for each specific transaction."
  }
];

const deliveryModels = [
  {
    title: "In-Tank Account Transfer",
    subtitle: "Existing Terminal Inventory",
    desc: "Title transfer of verified stationary product held in shore tanks between approved customer accounts within the same terminal facility, supported by terminal injection/transfer confirmations."
  },
  {
    title: "Refinery Allocation Credit",
    subtitle: "Primary Producer Supply",
    desc: "Refinery production volume credited directly to the Seller's commercial account prior to coordinated title and documentation release to the Buyer."
  },
  {
    title: "Direct Pipeline / Injection",
    subtitle: "Continuous Throughput",
    desc: "Direct pipeline pumping or connected terminal batch delivery injected directly into the Buyer's nominated storage installation or connected grid pipeline system."
  },
  {
    title: "Tank-to-Vessel Loading",
    subtitle: "Maritime Cargo Loading",
    desc: "Discharge from shore tankage directly across the terminal jetty into the Buyer's chartered and terminal-accepted maritime vessel, subject to laycan and Q&Q inspection."
  }
];

export const TransactionFramework: React.FC = () => {
  const [isModelsExpanded, setIsModelsExpanded] = useState(false);

  return (
    <section className="section-padding framework-wrap" id="framework">
      <Container>
        <SectionHeading
          eyebrow="OUR TRANSACTION FRAMEWORK"
          title="A Structured Process. Clear Commercial Accountability."
          lead="Consigliere Holdings facilitates structured commercial engagement between qualified counterparties, coordinating the progression from initial qualification and commercial agreement to operational verification, delivery, and settlement."
        />

        <div className="framework-supporting-statement">
          <p>
            Our approach emphasises defined responsibilities, appropriate verification, confidentiality, and alignment between contractual commitments and operational execution.
          </p>
        </div>

        {/* 4-Stage Transaction Cards Grid */}
        <div className="framework-stages-grid">
          {frameworkStages.map((stage) => (
            <Reveal key={stage.step}>
              <div className="framework-stage-card">
                <div className="stage-card-header">
                  <span className="stage-number">{stage.step}</span>
                  <div className="stage-accent-line" />
                </div>

                <h3 className="stage-card-title">{stage.title}</h3>
                <p className="stage-card-desc">{stage.description}</p>

                <div className="stage-details-box">
                  <div className="stage-details-title">Core Elements:</div>
                  <ul className="stage-details-list">
                    {stage.items.map((item, idx) => (
                      <li key={idx} className="stage-detail-item">
                        <span className="bullet-brass" aria-hidden="true">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="stage-protocol-note">
                  <span className="protocol-badge">PROTOCOL</span>
                  <p>{stage.protocolNote}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Confidentiality & Direct Verification Highlight Strip */}
        <Reveal>
          <div className="confidentiality-strip">
            <div className="confidentiality-badge-wrap">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-brass)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="confidentiality-title">CONFIDENTIALITY & DIRECT VERIFICATION</span>
            </div>
            <p className="confidentiality-copy">
              Commercially sensitive information is handled on a need-to-know basis. Where independent verification is required, it is coordinated through authorised representatives and independently verified contact channels, subject to the relevant party's authority and applicable confidentiality requirements.
            </p>
          </div>
        </Reveal>

        {/* Optional Expandable Delivery Models Area */}
        <Reveal>
          <div className="delivery-models-accordion">
            <button
              type="button"
              className="accordion-trigger-btn"
              onClick={() => setIsModelsExpanded(!isModelsExpanded)}
              aria-expanded={isModelsExpanded}
              aria-controls="delivery-models-content"
            >
              <span className="accordion-trigger-label">
                <span className="accordion-icon" aria-hidden="true">
                  {isModelsExpanded ? "−" : "+"}
                </span>
                Understand the Transaction Structure: Delivery Models
              </span>
              <span className="accordion-trigger-meta">
                {isModelsExpanded ? "Click to collapse" : "Click to view applicable delivery structures"}
              </span>
            </button>

            {isModelsExpanded && (
              <div id="delivery-models-content" className="delivery-models-panel">
                <div className="delivery-models-grid">
                  {deliveryModels.map((model, mIdx) => (
                    <div key={mIdx} className="delivery-model-card">
                      <div className="model-header">
                        <span className="model-num">0{mIdx + 1}</span>
                        <div>
                          <h4 className="model-title">{model.title}</h4>
                          <span className="model-subtitle">{model.subtitle}</span>
                        </div>
                      </div>
                      <p className="model-desc">{model.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* Closing Statement & Call to Action */}
        <Reveal>
          <div className="framework-closing-card">
            <div className="framework-closing-content">
              <h3 className="closing-heading">
                Every Transaction Has Its Own Operational Requirements.
              </h3>
              <p className="closing-body">
                The final transaction structure depends on the agreed Sale and Purchase Agreement, accepted terminal nominations, applicable operating rules, and confirmed banking arrangements.
              </p>
            </div>

            <div className="framework-closing-actions">
              <a href="#contact" className="btn btn-primary">
                Discuss a Requirement
              </a>
              <a href="#contact" className="link-editorial">
                <span>Contact Our Commercial Desk</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </Reveal>

        {/* Commercial & Legal Qualification */}
        <div className="framework-qualification-note">
          This framework is indicative. The executed SPA, applicable terminal operating rules, accepted nominations, and confirmed banking arrangements govern the final transaction.
        </div>
      </Container>
    </section>
  );
};
