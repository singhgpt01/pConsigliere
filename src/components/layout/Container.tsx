import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  wide?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  wide = false,
  className = '',
  style
}) => {
  const containerClass = wide ? 'container-wide' : 'container';
  return (
    <div className={`${containerClass} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
};
