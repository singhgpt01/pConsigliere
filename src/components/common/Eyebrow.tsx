import React from 'react';

export interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const Eyebrow: React.FC<EyebrowProps> = ({ children, className = '', style }) => {
  return (
    <span className={`section-eyebrow ${className}`.trim()} style={style}>
      {children}
    </span>
  );
};
