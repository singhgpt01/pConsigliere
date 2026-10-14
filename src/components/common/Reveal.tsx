import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  threshold?: number;
  rootMargin?: string;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  style,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const currentElem = ref.current;
    if (!currentElem) return;

    // Immediately show if already within viewport
    const rect = currentElem.getBoundingClientRect();
    if (rect.top < window.innerHeight + 150) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '100px 0px 50px 0px' }
    );

    observer.observe(currentElem);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className={`reveal-fade-up ${isVisible ? 'is-visible' : ''} ${className}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
};
