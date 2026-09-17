import type { Variants } from 'framer-motion';

// ── Shared Framer Motion variants ─────────────────────────────────────

/** Fade-up: element enters from below with opacity transition */
export const fadeUp: Variants = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

/** Stagger container: staggers children with configurable delay */
export const staggerContainer = (stagger = 0.1): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
});

/** Fade-in from right (used for testimonial carousel) */
export const fadeInRight: Variants = {
  hidden: { x: 40, opacity: 0 },
  show: { x: 0, opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } },
};

/** Scale-spring for icon hover */
export const scaleSpring: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.15, transition: { type: 'spring', stiffness: 400, damping: 15 } },
};

/** Page-level route transition */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: 'easeIn' } },
};

/** Card hover with glow (used as whileHover inline) */
export const cardHover = {
  y: -4,
  transition: { duration: 0.25, ease: 'easeOut' },
};
