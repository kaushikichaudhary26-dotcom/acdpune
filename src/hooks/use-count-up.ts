import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Scroll-triggered counter animation.
 * Returns the current animated number and a ref to attach to the element.
 * Counting starts when the element enters the viewport.
 *
 * Uses easeOutExpo easing for a satisfying rapid-start / slow-finish curve.
 */
export function useCountUp(target: number, duration = 2000) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo — fast start, slow finish
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  return { value, ref };
}
