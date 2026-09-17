import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, CalendarDays, Zap } from 'lucide-react';
import { useAnnouncements } from '@/hooks/use-announcements';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const DISMISS_KEY = 'marquee-dismissed';

const EventMarquee = () => {
  const { announcements, loading } = useAnnouncements();
  const reducedMotion = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, 'true');
  };

  const isVisible = !loading && announcements.length > 0 && !dismissed;

  useEffect(() => {
    document.documentElement.classList.toggle('has-event-marquee', isVisible);

    return () => {
      document.documentElement.classList.remove('has-event-marquee');
    };
  }, [isVisible]);

  if (!isVisible) return null;

  // Build the repeating content — duplicate for seamless infinite scroll
  const items = announcements.map((a) => (
    <a
      key={a.$id}
      href={a.meetupLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group marquee-item"
    >
      <CalendarDays className="marquee-item-icon" />
      <span className="marquee-item-text">{a.message}</span>
      <ExternalLink className="marquee-item-link" />
      <span className="marquee-item-separator">✦</span>
    </a>
  ));

  return (
    <AnimatePresence>
      <motion.div
        initial={reducedMotion ? {} : { height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-40 overflow-hidden"
        id="event-marquee"
      >
        <div className="marquee-bar">
          {/* Animated background gradient */}
          <div className="marquee-bg" />

          {/* Shimmer sweep effect */}
          <div className="marquee-shimmer" />

          {/* LIVE badge on the left */}
          <div className="marquee-badge">
            <Zap className="marquee-badge-icon" />
            <span className="marquee-badge-text">UPCOMING</span>
            <span className="marquee-badge-dot" />
          </div>

          {/* Marquee track */}
          <div className="marquee-overflow">
            <div
              className="marquee-track"
              style={reducedMotion ? { animation: 'none' } : undefined}
            >
              {/* Render items 4x for seamless loop */}
              {items}
              {items}
              {items}
              {items}
            </div>
          </div>

          {/* Fade edges */}
          <div className="marquee-fade-left" />
          <div className="marquee-fade-right" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="marquee-close"
            aria-label="Dismiss announcement"
          >
            <X className="h-3 w-3" />
          </button>

          {/* Top edge glow */}
          <div className="marquee-edge-glow" />
          {/* Bottom edge glow */}
          <div className="marquee-edge-glow-bottom" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventMarquee;
