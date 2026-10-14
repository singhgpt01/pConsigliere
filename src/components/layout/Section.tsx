import React from 'react';

export interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  noPadding?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  id,
  children,
  className = '',
  style,
  noPadding = false
}) => {
  const paddingClass = noPadding ? '' : 'section-padding';
  return (
    <section id={id} className={`${paddingClass} ${className}`.trim()} style={style}>
      {children}
    </section>
  );
};
