import { useState, useEffect } from 'react';

export interface ScrollState {
  scrollY: number;
  isScrolled: boolean;
  activeSection: string;
}

export function useScrollProgress(sectionIds: string[] = ['about', 'commodities', 'approach', 'divisions', 'contact']): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    isScrolled: false,
    activeSection: 'hero'
  });

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const scrolled = currentY > 40;

          let currentSection = 'hero';
          const scrollPos = currentY + 220;

          for (let i = sectionIds.length - 1; i >= 0; i--) {
            const el = document.getElementById(sectionIds[i]);
            if (el && el.offsetTop <= scrollPos) {
              currentSection = sectionIds[i];
              break;
            }
          }

          if (currentY < 240) {
            currentSection = 'hero';
          }

          setScrollState({
            scrollY: currentY,
            isScrolled: scrolled,
            activeSection: currentSection
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  return scrollState;
}
