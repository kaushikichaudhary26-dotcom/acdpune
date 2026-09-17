import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Cloud, Users, Mic2 } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useAuth } from '@/hooks/use-auth';
import { fadeUp, staggerContainer } from '@/lib/motion-variants';

const joinCards = [
  {
    title: 'AWS Builder',
    description: 'Get notified about upcoming sessions, workshops, and deep-dive cloud labs.',
    icon: Cloud,
    href: 'https://www.meetup.com/aws-user-group-pune/',
    cta: 'Join Meetup',
    featured: true,
  },
  {
    title: 'Community Learner',
    description: 'Stay updated with announcements, highlights, and connect with fellow builders.',
    icon: Users,
    href: 'https://www.linkedin.com/company/aws-user-group-pune/',
    cta: 'Follow on LinkedIn',
    featured: false,
  },
  {
    title: 'Speaker / Leader',
    description: 'Contribute practical sessions, mentor newcomers, and support community growth.',
    icon: Mic2,
    href: 'mailto:aws.acd.pune@gmail.com?subject=AWSUG%20Pune%20Speaker',
    cta: 'Express Interest',
    featured: false,
  },
] as const;

const fireConfetti = () => {
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FF9900', '#FACC15', '#ffffff'],
  });
};

const JoinCommunitySection = () => {
  const reducedMotion = useReducedMotion();
  const { user } = useAuth();

  const handleCtaClick = useCallback((href: string, title: string) => {
    if (href.startsWith('mailto:')) {
      // Direct open for mailto
      window.open(href, '_self');
      return;
    }

    toast('Redirecting to ' + (href.includes('meetup') ? 'Meetup.com' : 'LinkedIn') + ' ↗', {
      duration: 1500,
    });

    setTimeout(() => {
      window.open(href, '_blank', 'noopener,noreferrer');
    }, 1200);
  }, []);

  return (
    <section id="join" className="section-padding scroll-mt-24 bg-[#0A0A0A]">
      <div className="site-container">
        <div className="text-center">
          <motion.div
            className="section-eyebrow justify-center text-[#FF9900]"
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            Join The Community
          </motion.div>
          <motion.h2
            className="section-title mt-3"
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            Pick Your Path
          </motion.h2>
          <motion.p
            className="mx-auto mt-5 section-body text-center"
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            Learn, share, and build with AWS User Group Pune through the channel that fits you best.
          </motion.p>
        </div>

        <motion.div
          className="mt-16 grid gap-6 md:grid-cols-3"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {joinCards.map((item) => (
            <motion.article
              key={item.title}
              variants={fadeUp}
              whileHover={reducedMotion ? {} : { y: -4 }}
              className={`flex flex-col rounded-xl p-8 transition-all ${
                item.featured
                  ? 'gradient-border-card'
                  : 'border border-[rgba(255,255,255,0.08)] bg-[#141414] hover:border-[rgba(255,153,0,0.4)] hover:shadow-[0_0_0_1px_rgba(255,153,0,0.3),0_8px_32px_rgba(255,153,0,0.08)]'
              }`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  item.featured ? 'bg-[#FF9900]/[0.15] text-[#FF9900]' : 'bg-white/[0.05] text-[#C8C6BE]'
                }`}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-6 text-[18px] font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-[#C8C6BE]">{item.description}</p>

              <Button
                variant={item.featured ? 'hero' : 'heroOutline'}
                className={`mt-10 h-11 rounded-full text-[14px] font-semibold ${item.featured ? '' : 'text-white'}`}
                onClick={() => handleCtaClick(item.href, item.title)}
              >
                {item.cta}
              </Button>
            </motion.article>
          ))}
        </motion.div>

        {/* Confetti note for logged-in users */}
        {user && (
          <motion.div
            className="mt-8 text-center"
            initial={reducedMotion ? {} : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => {
                fireConfetti();
                toast.success('Welcome to AWSUG Pune! 🎉');
              }}
              className="text-[14px] text-[#FF9900] hover:text-[#FFB133] font-medium transition-colors"
            >
              🎉 Celebrate being part of AWSUG Pune!
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default JoinCommunitySection;
