import React from 'react';
import { Container } from '../layout/Container';
import { Reveal } from '../common/Reveal';

export interface FeaturedCommodityProps {
  onEnquire: (commodityName: string) => void;
}

export const FeaturedCommodity: React.FC<FeaturedCommodityProps> = ({ onEnquire }) => {
  const commodityName = "EN590 10 PPM Ultra-Low-Sulphur Diesel";

  return (
    <section className="section-padding featured-commodity-wrap" id="featured-commodity">
      <Container>
        <Reveal>
          <div className="featured-split-card">
            {/* Left: Commercial Product Description */}
            <div className="featured-info-col">
              <span className="featured-badge">
                Featured Facilitation · Refined Petroleum
              </span>
              <h2 className="featured-title">{commodityName}</h2>
              <div className="featured-tagline">
                Automotive Gasoil · Euro 5 & Euro 6 Standard
              </div>
              <p className="featured-desc">
                Facilitating reliable commercial engagements for high-grade automotive gasoil meeting strict European EN 590 standards. We connect vetted commercial buyers with confirmed refinery off-takes and qualified trading principals.
              </p>

              <div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => onEnquire(commodityName)}
                >
                  Enquire on EN590 Diesel
                </button>
              </div>
            </div>

            {/* Right: Compact Commercial Specifications Panel */}
            <div className="featured-specs-col">
              <div>
                <div className="featured-specs-header">Commercial Specification Summary</div>
                <div className="featured-specs-table">
                  <div className="spec-row">
                    <span className="spec-name">Governing Standard</span>
                    <span className="spec-val">EN 590 / Euro 5 & Euro 6</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">Sulphur Content</span>
                    <span className="spec-val">Max 10 PPM (10 mg/kg)</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">Cetane Index / Number</span>
                    <span className="spec-val">Min 46.0 / Min 51.0</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">Flash Point</span>
                    <span className="spec-val">Min 55°C</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">Commercial Terms Handled</span>
                    <span className="spec-val">CIF / FOB (Per verified mandate)</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-name">Assay Verification</span>
                    <span className="spec-val">SGS / Saybolt Independent Inspection</span>
                  </div>
                </div>
              </div>

              <div className="featured-mandate-note">
                Commercial facilitation is subject to formal counterparty qualification, mandate verification, and bilateral trade documentation. Full refinery assays provided upon formal request.
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
};
