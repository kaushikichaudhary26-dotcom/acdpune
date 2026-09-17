import { useEffect, useState } from 'react';

/**
 * Returns true when the user prefers reduced motion.
 * All animation components should check this and fall back
 * to simple fades or skip transforms entirely.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (event: MediaQueryListEvent) => setPrefersReduced(event.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
