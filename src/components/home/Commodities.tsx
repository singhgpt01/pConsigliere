import React, { useState, useMemo } from 'react';
import { Container } from '../layout/Container';
import { Section } from '../layout/Section';
import { SectionHeading } from '../common/SectionHeading';
import { Reveal } from '../common/Reveal';
import { Button } from '../common/Button';
import { CommodityCategory } from '../commodities/CommodityCategory';
import { CommodityFeature } from '../commodities/CommodityFeature';
import { CommodityCard } from '../commodities/CommodityCard';
import { commoditiesData, CommodityItem } from '../../data/commodities';

export interface CommoditiesProps {
  onSelectCommodity: (commodityName: string) => void;
}

export const Commodities: React.FC<CommoditiesProps> = ({ onSelectCommodity }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Commodities' },
    { id: 'energy', label: 'Energy' },
    { id: 'industrial', label: 'Industrial Commodities' },
    { id: 'agriculture', label: 'Agricultural Commodities' }
  ];

  const { spotlightCommodity, secondaryCommodities } = useMemo(() => {
    const list: CommodityItem[] =
      activeCategory === 'all'
        ? commoditiesData
        : commoditiesData.filter((item) => item.category === activeCategory);

    const featured = list.find((item) => item.featured) || list[0];
    const secondary = list.filter((item) => item.id !== featured?.id);

    return {
      spotlightCommodity: featured,
      secondaryCommodities: secondary
    };
  }, [activeCategory]);

  return (
    <Section id="commodities" className="commodities-section">
      <Container>
        <SectionHeading
          eyebrow="OUR COMMODITIES"
          title="Connecting Supply with Global Demand."
          lead="We facilitate commercial engagement across selected energy, industrial, and agricultural commodity markets, subject to product availability, counterparty qualification, and agreed transaction requirements."
        />

        {/* Category Tabs */}
        <CommodityCategory
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Featured Spotlight Panel */}
        {spotlightCommodity && (
          <Reveal key={`spotlight-${activeCategory}-${spotlightCommodity.id}`}>
            <CommodityFeature
              commodity={spotlightCommodity}
              onEnquire={onSelectCommodity}
            />
          </Reveal>
        )}

        {/* Secondary Editorial Commodities Grid */}
        <div className="commodities-grid">
          {secondaryCommodities.map((item) => (
            <Reveal key={item.id}>
              <CommodityCard
                commodity={item}
                onEnquire={onSelectCommodity}
              />
            </Reveal>
          ))}
        </div>

        {/* Custom Specification Box */}
        <div
          style={{
            marginTop: '2.75rem',
            padding: '1.35rem 1.85rem',
            background: 'var(--color-bg-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xs)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Looking for a specific petroleum fraction, fertilizer compound, or agricultural requirement not listed above?
          </div>
          <Button
            variant="secondary"
            href="#contact"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.76rem' }}
          >
            Submit Specific Specification
          </Button>
        </div>
      </Container>
    </Section>
  );
};
