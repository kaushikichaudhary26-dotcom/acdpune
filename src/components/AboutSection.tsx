import { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Users, TrendingUp, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import useSitePhotos, { fallbackSitePhotos } from '@/hooks/use-site-photos';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { fadeUp, staggerContainer, scaleSpring } from '@/lib/motion-variants';

const valueProps = [
  {
    icon: Cloud,
    title: 'Cloud Confidence',
    body: 'Practical workshops with real AWS architecture patterns.',
  },
  {
    icon: Users,
    title: 'Real Community',
    body: 'Monthly sessions with builders across cloud, data, and AI.',
  },
  {
    icon: TrendingUp,
    title: 'Clearer Path',
    body: 'A student and professional ecosystem that grows together.',
  },
] as const;

const cardCaptions = [
  {
    title: 'Community Meetups',
    subtitle: 'Monthly sessions with builders across cloud, data, and AI.',
  },
  {
    title: 'Hands-On Learning',
    subtitle: 'Practical workshops with real AWS architecture patterns.',
  },
  {
    title: 'Mentors & Volunteers',
    subtitle: 'A student and professional ecosystem that grows together.',
  },
  {
    title: 'ACD Pune 2026',
    subtitle: '700+ attendees, 20+ speakers, and high-energy collaboration.',
  },
  {
    title: 'Always On',
    subtitle: 'Not a one-day event. A year-round learning community.',
  },
] as const;

/* ── Card-stack shuffle animation ──────────────────────── */
const AUTOPLAY_INTERVAL = 4000;

const stackVariants = {
  front: {
    x: 0,
    y: 0,
    scale: 1,
    rotateZ: 0,
    zIndex: 30,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 28 },
  },
  second: {
    x: 14,
    y: -10,
    scale: 0.96,
    rotateZ: 2.5,
    zIndex: 20,
    opacity: 0.85,
    transition: { type: 'spring', stiffness: 300, damping: 28 },
  },
  third: {
    x: 28,
    y: -20,
    scale: 0.92,
    rotateZ: 5,
    zIndex: 10,
    opacity: 0.6,
    transition: { type: 'spring', stiffness: 300, damping: 28 },
  },
  hidden: {
    x: 0,
    y: 40,
    scale: 0.88,
    rotateZ: -2,
    zIndex: 0,
    opacity: 0,
    transition: { type: 'spring', stiffness: 300, damping: 28 },
  },
  exit: {
    x: -300,
    y: -40,
    scale: 0.85,
    rotateZ: -12,
    opacity: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

const CommunityCardStack = ({
  cards,
  reducedMotion,
}: {
  cards: { title: string; subtitle: string; image: string }[];
  reducedMotion: boolean;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const advance = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const goBack = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  // Autoplay
  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(advance, AUTOPLAY_INTERVAL);
    return () => clearInterval(interval);
  }, [advance, reducedMotion]);

  const getVariant = (cardIndex: number) => {
    const offset = (cardIndex - activeIndex + cards.length) % cards.length;
    if (offset === 0) return 'front';
    if (offset === 1) return 'second';
    if (offset === 2) return 'third';
    return 'hidden';
  };

  return (
    <div className="community-stack-container">
      {/* Card stack */}
      <div className="community-stack">
        <AnimatePresence mode="popLayout">
          {cards.map((card, index) => {
            const variant = getVariant(index);
            if (variant === 'hidden') return null;

            return (
              <motion.article
                key={`${card.title}-${index}`}
                className="community-stack-card group"
                variants={reducedMotion ? {} : stackVariants}
                animate={variant}
                exit="exit"
                onClick={variant === 'front' ? advance : undefined}
                style={{ cursor: variant === 'front' ? 'pointer' : 'default' }}
                layout
              >
                <img
                  src={card.image}
                  alt={card.title}
                  loading="lazy"
                  className="community-stack-img"
                />
                <div className="community-stack-overlay" />
                <div className="community-stack-caption">
                  <span className="community-stack-eyebrow">{card.title}</span>
                  <p className="community-stack-subtitle">{card.subtitle}</p>
                </div>
                {/* Card index indicator */}
                {variant === 'front' && (
                  <div className="community-stack-counter">
                    {activeIndex + 1} / {cards.length}
                  </div>
                )}
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="community-stack-controls">
        <button onClick={goBack} className="community-stack-btn" aria-label="Previous card">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="community-stack-dots">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`community-stack-dot ${i === activeIndex ? 'active' : ''}`}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>
        <button onClick={advance} className="community-stack-btn" aria-label="Next card">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

/* ── About Section ─────────────────────────────────────── */
const AboutSection = () => {
  const { photos } = useSitePhotos();
  const reducedMotion = useReducedMotion();

  const aboutPhotos = useMemo(() => {
    const selected = photos
      .filter((photo) => photo.photoUrl && (photo.section === 'about' || photo.section === 'both' || !photo.section))
      .map((photo) => photo.photoUrl as string);

    return selected.length > 0 ? selected : fallbackSitePhotos;
  }, [photos]);

  const communityCards = useMemo(
    () => cardCaptions.map((card, index) => ({
      ...card,
      image: aboutPhotos[index % aboutPhotos.length],
    })),
    [aboutPhotos],
  );

  return (
    <section id="about" className="section-padding scroll-mt-24 bg-[#0A0A0A]">
      <div className="site-container">
        {/* ── Value Proposition Cards ──────────────────── */}
        <div className="text-center">
          <motion.div
            className="section-eyebrow justify-center text-[#FF9900]"
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            The Essence
          </motion.div>
          <motion.h2
            className="section-title mt-3"
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            Where Innovation Meets Community
          </motion.h2>
          <motion.p
            className="mx-auto mt-5 section-body text-center"
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            AWS User Group Pune is a community-led movement for builders, students, and
            professionals who learn cloud by doing, sharing, and mentoring.
          </motion.p>
        </div>

        <motion.div
          className="mt-12 grid gap-6 md:grid-cols-3"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {valueProps.map((card) => (
            <motion.article
              key={card.title}
              variants={fadeUp}
              whileHover={reducedMotion ? {} : {
                y: -4,
                borderColor: 'rgba(255, 153, 0, 0.4)',
                boxShadow: '0 0 0 1px rgba(255, 153, 0, 0.3), 0 8px 32px rgba(255, 153, 0, 0.08)',
              }}
              className="flex flex-col items-start rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#141414] p-8 transition-colors"
            >
              <motion.div
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF9900]/[0.1] text-[#FF9900]"
                variants={scaleSpring}
                initial="rest"
                whileHover="hover"
              >
                <card.icon className="h-5 w-5" />
              </motion.div>
              <h3 className="mt-6 text-[18px] font-semibold text-white">{card.title}</h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-[#C8C6BE]">{card.body}</p>
            </motion.article>
          ))}
        </motion.div>

        {/* ── Card shuffle stack ────────────────────────── */}
        <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <motion.div
              className="mt-5 space-y-5 section-body"
              initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              <p>
                AWS User Group Pune is a community-led movement for builders, students, and
                professionals who learn cloud by doing, sharing, and mentoring.
              </p>
              <p>
                From regular meetups to deep-dive workshops, we create hands-on spaces where
                ideas become projects and newcomers grow into contributors.
              </p>
              <p>
                ACD Pune 2026 was one high-impact milestone, but the bigger story is the
                year-round community that keeps shipping, learning, and helping each other.
              </p>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.16 }}
            >
              {['20K+ Community', 'Monthly Meetups', 'Mentor Network', 'Builder Culture'].map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-white/[0.02] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CommunityCardStack cards={communityCards} reducedMotion={reducedMotion} />
          </motion.div>
        </div>

        <motion.div
          className="glass-card mt-16"
          initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <div className="text-center">
            <div className="section-eyebrow justify-center text-[#FF9900]">Built for the Community</div>
            <h3 className="mt-3 text-[clamp(24px,3vw,32px)] font-semibold tracking-[-0.02em] text-white">
              Built for the Community
            </h3>
            <p className="mx-auto mt-5 max-w-[760px] text-[16px] leading-[1.75] text-[#C8C6BE]">
              Developers, students, architects, DevOps engineers, founders, and cloud enthusiasts
              come together here to share practical knowledge and build meaningful careers.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              'Developers',
              'Students',
              'DevOps Engineers',
              'Solutions Architects',
              'Platform Teams',
              'SREs',
              'MLOps Practitioners',
            ].map((role) => (
              <span
                key={role}
                className="rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0A0A0A]/40 px-4 py-2 text-[12px] font-medium text-[#C8C6BE]"
              >
                {role}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
