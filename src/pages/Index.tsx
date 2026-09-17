import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';

import TeamSection from '@/components/TeamSection';
import HighlightsSection from '@/components/HighlightsSection';
import JoinCommunitySection from '@/components/JoinCommunitySection';
import FAQSection from '@/components/FAQSection';
import Footer from '@/components/Footer';

import EventMarquee from '@/components/EventMarquee';

import BackToTop from '@/components/BackToTop';
import { communityContent } from '@/content/community';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { pageTransition } from '@/lib/motion-variants';

const Index = () => {
  const mainRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    const bindRevealNodes = () => {
      root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
        if (element.dataset.revealBound === 'true') return;
        element.dataset.revealBound = 'true';
        element.classList.add('reveal-up');
        observer.observe(element);
      });
    };

    bindRevealNodes();

    const mutationObserver = new MutationObserver(() => {
      bindRevealNodes();
    });

    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>{communityContent.seoTitle}</title>
        <meta
          name="description"
          content={communityContent.seoDescription}
        />
        <meta
          name="keywords"
          content={communityContent.seoKeywords}
        />
        <meta property="og:title" content={communityContent.seoTitle} />
        <meta
          property="og:description"
          content={communityContent.seoDescription}
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://awsugpune.in" />
      </Helmet>

      <motion.div
        className="min-h-screen bg-background"
        variants={reducedMotion ? {} : pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <EventMarquee />
        <Header />
        <main ref={mainRef}>
          <HeroSection />
          <AboutSection />
          <FAQSection />
          <TeamSection />
          <HighlightsSection />
          <JoinCommunitySection />
        </main>

        <Footer />
        <BackToTop />
      </motion.div>
    </>
  );
};

export default Index;
