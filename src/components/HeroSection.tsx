import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCountUp } from '@/hooks/use-count-up';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import ParticleGrid from '@/components/ParticleGrid';
import { staggerContainer, fadeUp } from '@/lib/motion-variants';
import shaniwarWadaSvg from '@/assets/shaniwar-wada.svg';

const heroStats = [
  { target: 20, suffix: 'K+', label: 'Members' },
  { target: 200, suffix: '+', label: 'Events' },
  { target: 50, suffix: '+', label: 'Speakers' },
  { target: 100, suffix: '+', label: 'Talks' },
] as const;

/** Animated stat chip */
const StatChip = ({ target, suffix, label }: { target: number; suffix: string; label: string }) => {
  const { value, ref } = useCountUp(target);
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-white/[0.03] px-5 py-2.5 backdrop-blur-sm"
    >
      <span className="text-[18px] font-bold tracking-tight text-[#FF9900]">
        {value}{suffix}
      </span>
      <span className="text-[13px] font-medium text-[#9CA3AF]">{label}</span>
    </div>
  );
};

/** Word-by-word animated title */
const AnimatedTitle = () => {
  const reducedMotion = useReducedMotion();
  const words = ['Where', 'Innovation', 'Meets', 'Community'];

  if (reducedMotion) {
    return (
      <h1 className="mt-4 text-[clamp(28px,5vw,60px)] font-bold leading-[1.1] text-white">
        Where Innovation Meets Community
      </h1>
    );
  }

  return (
    <motion.h1
      className="mt-4 flex flex-wrap items-center justify-center gap-x-[0.3em] text-[clamp(28px,5vw,60px)] font-bold leading-[1.1] text-white"
      variants={staggerContainer(0.08)}
      initial="hidden"
      animate="show"
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { y: 40, opacity: 0 },
            show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
};

const HeroSection = () => {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#0A0A0A] px-[22px] pt-[52px]"
    >
      {/* ── Background: Particle grid + Shaniwar Wada ──── */}
      <div className="absolute inset-0">
        {/* Particle grid (lowest layer) */}
        <ParticleGrid />
        {/* Radial gradient overlay for depth */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(255,153,0,0.04) 0%, transparent 60%)',
          }}
        />
        {/* Shaniwar Wada heritage silhouette — on top of particles */}
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none overflow-hidden">
          <img
            src={shaniwarWadaSvg}
            alt=""
            aria-hidden="true"
            className="md:w-full h-full md:h-auto object-contain select-none"
            style={{
              opacity: 0.18,
              filter: 'brightness(2) saturate(0.3)',
              transform: 'translateY(10%)',
            }}
          />
        </div>
      </div>

      {/* ── Content ───────────────────────────────────── */}
      <div className="site-shell relative z-10 mx-auto flex min-h-[calc(100svh-52px)] w-full flex-col items-center justify-center pb-16 pt-20 text-center">
        <motion.div
          className="section-eyebrow text-[#9CA3AF]"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0 }}
        >
          AWS USER GROUP PUNE
        </motion.div>

        {/* ── Animated headline ──────────────────────── */}
        <AnimatedTitle />

        <motion.div
          className="mt-3 h-px w-10 bg-white/20"
          initial={reducedMotion ? {} : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />

        {/* ── PUNE wordmark with scan-line ──────────── */}
        <motion.div
          className="mt-6 mb-6"
          initial={reducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <span className="scan-line-container hero-letter inline-block">
            PUNE
          </span>
        </motion.div>

        <motion.p
          className="mt-5 max-w-[560px] text-[18px] font-normal leading-[1.7] text-[#C8C6BE]"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Pune's largest builder-first cloud community — meetups, workshops,
          mentorship, and collaborative learning, powered by AWS.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Button
            asChild
            variant="hero"
            size="lg"
            className="h-12 rounded-full px-7 text-[16px] font-semibold"
          >
            <a
              href="https://www.meetup.com/aws-user-group-pune/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join the community →
            </a>
          </Button>

          <Button
            asChild
            variant="heroOutline"
            size="lg"
            className="h-12 rounded-full px-7 text-[16px] font-semibold text-white"
          >
            <a href="#about">Explore events</a>
          </Button>
        </motion.div>

        {/* ── Stats chips ──────────────────────────── */}
        <motion.div
          className="mt-12 flex flex-wrap items-center justify-center gap-3"
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          {heroStats.map((stat) => (
            <StatChip key={stat.label} target={stat.target} suffix={stat.suffix} label={stat.label} />
          ))}
        </motion.div>

        <a
          href="#about"
          aria-label="Scroll to About section"
          className="scroll-indicator absolute bottom-8 left-1/2 inline-flex -translate-x-1/2 flex-col items-center gap-2 text-[#9CA3AF] hover:text-white"
        >
          <span className="h-8 w-px bg-white/20" />
          <ChevronDown className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
