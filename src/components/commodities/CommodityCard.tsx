import React from 'react';
import { CommodityItem } from '../../data/commodities';
import { Button } from '../common/Button';

export interface CommodityCardProps {
  commodity: CommodityItem;
  onEnquire: (commodityName: string) => void;
}

export const CommodityCard: React.FC<CommodityCardProps> = ({ commodity, onEnquire }) => {
  return (
    <div className="commodity-card">
      <span className="commodity-meta-tag">{commodity.categoryLabel}</span>
      <h3 className="commodity-title">{commodity.name}</h3>
      <div className="commodity-tagline">{commodity.tagline}</div>

      <p className="commodity-desc">{commodity.overview}</p>

      <div className="commodity-specs-list">
        {commodity.specs.map((spec, sIdx) => (
          <div key={sIdx} className="spec-item">
            <span className="label">{spec.label}</span>
            <span className="value">{spec.val}</span>
          </div>
        ))}
      </div>

      <div className="commodity-disclaimer-note">
        {commodity.availabilityNote}
      </div>

      <div className="commodity-card-footer">
        <Button
          variant="editorial"
          onClick={() => onEnquire(commodity.name)}
          style={{ padding: 0 }}
        >
          <span>Enquire About This Commodity</span>
          <span>→</span>
        </Button>
      </div>
    </div>
  );
};
