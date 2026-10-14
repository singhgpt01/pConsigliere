import React from 'react';
import { CommodityItem } from '../../data/commodities';
import { Button } from '../common/Button';

export interface CommodityFeatureProps {
  commodity: CommodityItem;
  onEnquire: (commodityName: string) => void;
}

export const CommodityFeature: React.FC<CommodityFeatureProps> = ({ commodity, onEnquire }) => {
  return (
    <div className="spotlight-panel">
      <div>
        <span className="spotlight-badge">
          Featured Facilitation • {commodity.categoryLabel}
        </span>
        <h3 className="spotlight-title">{commodity.name}</h3>
        <div className="spotlight-tagline">{commodity.tagline}</div>
        <p className="spotlight-desc">{commodity.overview}</p>

        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            onClick={() => onEnquire(commodity.name)}
          >
            Enquire About This Commodity
          </Button>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            {commodity.availabilityNote}
          </span>
        </div>
      </div>

      <div className="spotlight-specs-container">
        {commodity.specs.map((spec, idx) => (
          <div
            key={idx}
            className="spec-item"
            style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '3px' }}
          >
            <span className="label" style={{ fontSize: '0.7rem', textTransform: 'uppercase' }}>
              {spec.label}
            </span>
            <span className="value" style={{ fontSize: '0.86rem' }}>
              {spec.val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
