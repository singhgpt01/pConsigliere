import React, { useState, useMemo } from 'react';
import { Container } from '../layout/Container';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';
import { commoditiesData, CommodityItem } from '../../data/commodities';

export interface CommoditiesProps {
  onSelectCommodity: (commodityName: string) => void;
}

export const Commodities: React.FC<CommoditiesProps> = ({ onSelectCommodity }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Commodities' },
    { id: 'energy', label: 'Energy & Petroleum' },
    { id: 'industrial', label: 'Industrial & Fertilizers' },
    { id: 'agriculture', label: 'Agricultural Commodities' }
  ];

  const filteredCommodities = useMemo(() => {
    if (activeCategory === 'all') return commoditiesData;
    return commoditiesData.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="section-padding portfolio-wrap" id="commodities">
      <Container>
        <SectionHeading
          eyebrow="COMMODITY PORTFOLIO"
          title="Connecting Supply with International Demand."
          lead="We facilitate structured commercial engagements across selected energy, industrial, and agricultural markets, subject to counterparty verification and transaction feasibility."
        />

        {/* Category Filters */}
        <div className="category-tabs" role="tablist" aria-label="Commodity Categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              className={`category-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 3-Column Balanced Commodity Cards Grid */}
        <div className="commodities-grid">
          {filteredCommodities.map((item: CommodityItem) => (
            <Reveal key={item.id}>
              <div className="commodity-card">
                <span className="card-category-tag">{item.categoryLabel}</span>
                <h3 className="card-title">{item.name}</h3>
                <div className="card-tagline">{item.tagline}</div>
                <p className="card-desc">{item.overview}</p>

                {item.specs && item.specs.length > 0 && (
                  <div className="card-specs-list">
                    {item.specs.slice(0, 3).map((spec, sIdx) => (
                      <div key={sIdx} className="card-spec-item">
                        <span className="label">{spec.label}</span>
                        <span className="value">{spec.val}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="card-footer">
                  <button
                    type="button"
                    className="card-enquire-link"
                    onClick={() => onSelectCommodity(item.name)}
                  >
                    <span>Enquire</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Custom Specification Enquiry Callout */}
        <div className="custom-requirement-card">
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-walnut)', fontWeight: 600, marginBottom: '0.25rem' }}>
              Specific Commodity or Tailored IncoTerms?
            </div>
            <div style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)' }}>
              Looking for a particular petroleum fraction, fertilizer compound, or origin specification not detailed above?
            </div>
          </div>
          <a href="#contact" className="btn btn-secondary">
            Submit a Custom Requirement
          </a>
        </div>
      </Container>
    </section>
  );
};
