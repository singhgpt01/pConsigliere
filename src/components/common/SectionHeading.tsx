import React from 'react';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  className?: string;
  maxWidth?: string | number;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  lead,
  className = '',
  maxWidth = '780px'
}) => {
  return (
    <div className={className} style={{ maxWidth }}>
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <h2 className="section-heading">{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
    </div>
  );
};
