import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowUpRight, GraduationCap, Handshake, MicVocal,
  Sparkles, Users2, Target, Lightbulb, Heart, Rocket, Calendar,
  Mic2, HandHeart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import JoinFormModal from '@/components/JoinFormModal';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { fadeUp, staggerContainer, pageTransition } from '@/lib/motion-variants';
import { type ApplicationRole } from '@/hooks/use-community-applications';
import afreenBano from '@/assets/panelist/Afreen Bano.jpeg';
import priyankaSinghSolanki from '@/assets/panelist/Priyanka Singh Solanki.jpeg';
// import wingsSvg from '@/assets/wings.svg';

/*
 * ── Standee color palette ─────────────────────────────────────
 * Dark:   #3B3242 (edges)
 * Mid:    #6D64AD (accent purple)
 * Bright: #9361A1 (center glow)
 * Deep:   #483184 (bottom indigo)
 */

const heroStats = [
  { value: '500+', label: 'Women Reached' },
  { value: '12+', label: 'WIT Sessions' },
  { value: '8+', label: 'Women Speakers' },
  { value: '3', label: 'Community Days' },
];

const pillars = [
  { title: 'Learn without gatekeeping', description: 'Hands-on sessions, role models, and approachable community spaces help more women build AWS confidence step by step.', icon: GraduationCap },
  { title: 'Visibility in technical rooms', description: 'Women in Tech is about being seen as speakers, builders, mentors, organizers, and decision-makers in cloud conversations.', icon: MicVocal },
  { title: 'Networks that compound', description: 'The best communities create friendships, referrals, mentorship, and long-term momentum — not just events.', icon: Users2 },
  { title: 'Mentorship that matters', description: 'Pairing early-career women with experienced cloud professionals for guidance, portfolio reviews, and career navigation.', icon: Handshake },
];

const timeline = [
  { date: 'Mar 2024', title: 'First WIT Panel', description: 'Inaugural "Women in Cloud" panel at AWS Community Day Pune with 4 women speakers.' },
  { date: 'Jun 2024', title: 'WIT Workshop Series', description: 'Hands-on workshop series covering AWS fundamentals, led by women cloud engineers.' },
  { date: 'Sep 2024', title: "It's Her Tech Era Launch", description: 'Official branding and LinkedIn campaign launch with community photo features.' },
  { date: 'Dec 2024', title: 'Community Day Feature', description: 'Dedicated Women in Tech track at AWS Community Day Pune 2024.' },
  { date: 'Mar 2025', title: 'Growing Strong', description: 'Expanded to regular monthly sessions with mentorship pairing program.' },
  { date: 'May 2025', title: 'AWS Community Day 2025', description: 'Women in Tech sessions featured prominently with record participation.' },
];

const voices = [
  { name: 'Afreen Bano', role: 'Community Voice', image: afreenBano, quote: 'AWSUG Pune gave me the platform to go from an attendee to a speaker and a community organizer. That progression changed my career trajectory.' },
  { name: 'Priyanka Singh Solanki', role: 'Cloud Leadership', image: priyankaSinghSolanki, quote: "The Women in Tech initiative here isn't performative — it's practical. Real workshops, real mentors, real outcomes." },
];

const values = [
  { icon: Target, title: 'Purpose-driven', description: 'Every session is designed to build tangible cloud skills, not just fill a diversity checkbox.' },
  { icon: Lightbulb, title: 'Builder-first', description: 'We believe in learning by doing — workshops, hackathons, and hands-on labs over passive lectures.' },
  { icon: Heart, title: 'Community-centered', description: 'A safe space where questions are encouraged, mistakes are learning, and everyone belongs.' },
  { icon: Rocket, title: 'Growth-oriented', description: 'From first meetup to first talk — we support every step of the leadership journey.' },
];

const WomenInTechPage = () => {
  const reducedMotion = useReducedMotion();
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [joinModalRole, setJoinModalRole] = useState<ApplicationRole | undefined>();

  useEffect(() => {
    fetch('/her-tech-era-photos/manifest.json')
      .then((res) => res.json())
      .then((images: string[]) => setGalleryImages(images))
      .catch(() => setGalleryImages([]));
  }, []);

  const openJoinModal = (role?: ApplicationRole) => {
    setJoinModalRole(role);
    setJoinModalOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Her Tech Era — AWS User Group Pune | Scaling Heights, Building Dreams</title>
        <meta name="description" content="Empowering women in cloud computing through mentorship, workshops, and community. It's Her Tech Era at AWS User Group Pune." />
      </Helmet>

      <motion.div className="min-h-screen bg-[#0A0A0A]" variants={reducedMotion ? {} : pageTransition} initial="initial" animate="animate" exit="exit">
        <Header />

        {/* ═══ HERO — Purple gradient matching standee ═══ */}
        <section className="relative flex min-h-[85vh] items-center overflow-hidden pt-24 pb-20">
          {/* Purple gradient background */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(160deg, #3B3242 0%, #6D64AD 30%, #9361A1 50%, #7B52A0 70%, #483184 100%)',
          }} />
          {/* Circuit pattern overlay */}
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23fff' stroke-width='0.5'%3E%3Cpath d='M0 30h60M30 0v60'/%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          {/* Bottom fade to dark */}
          <div className="absolute bottom-0 left-0 right-0 h-40" style={{
            background: 'linear-gradient(to bottom, transparent, #0A0A0A)',
          }} />

          <div className="site-container relative z-10 text-center mx-auto px-6">
            <Link to="/" className="mb-8 inline-flex items-center gap-2 text-[13px] font-medium text-white/60 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>

            {/* Wings + Title — side by side layout */}
            <motion.div
              className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 mx-auto"
              initial={reducedMotion ? {} : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Left Wing (right_wing.svg faces left) */}
              <motion.img
                src="/wings/right_wing.svg"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none w-[100px] sm:w-[140px] md:w-[220px] lg:w-[300px]"
                style={{
                  filter: 'brightness(1.3) drop-shadow(0 0 40px rgba(147,97,161,0.4))',
                }}
                initial={reducedMotion ? {} : { x: -80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              />

              {/* Title */}
              <h1
                className="font-serif text-[clamp(42px,8vw,96px)] font-bold leading-[0.95] tracking-[-0.02em] text-white shrink-0"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                HER<br />TECH<br />ERA
              </h1>

              {/* Right Wing (left_wing.svg faces right) */}
              <motion.img
                src="/wings/left_wing.svg"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none w-[100px] sm:w-[140px] md:w-[220px] lg:w-[300px]"
                style={{
                  filter: 'brightness(1.3) drop-shadow(0 0 40px rgba(147,97,161,0.4))',
                }}
                initial={reducedMotion ? {} : { x: 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
              />
            </motion.div>

            {/* Tagline — cursive */}
            <motion.p className="mt-8 text-[clamp(20px,3.5vw,36px)] text-white/90"
              style={{ fontFamily: "'Dancing Script', cursive" }}
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Scaling Heights, Building Dreams
            </motion.p>

            {/* Sub-description */}
            <motion.p className="mx-auto mt-6 max-w-[560px] text-[16px] leading-[1.7] text-white/70"
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Empowering women in cloud, AI, DevOps, and architecture through mentorship, workshops, and community.
            </motion.p>

            {/* Stats */}
            <motion.div className="mt-10 flex flex-wrap justify-center gap-4"
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {heroStats.map((s) => (
                <div key={s.label} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-5 py-2.5 backdrop-blur-sm">
                  <span className="text-[18px] font-bold text-white">{s.value}</span>
                  <span className="text-[13px] font-medium text-white/60">{s.label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div className="mt-8 flex flex-wrap justify-center gap-3"
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Button asChild size="lg" className="h-12 rounded-full bg-white px-7 text-[14px] font-semibold text-[#483184] hover:bg-white/90">
                <a href="https://www.meetup.com/aws-user-group-women-in-tech-india/" target="_blank" rel="noopener noreferrer">Join Our Next Meetup</a>
              </Button>
              <Button asChild size="lg" className="h-12 rounded-full border-2 border-white/30 bg-transparent px-7 text-[14px] font-semibold text-white hover:bg-white/10">
                <a href="https://www.linkedin.com/company/aws-ug-for-women-in-tech-india/" target="_blank" rel="noopener noreferrer">
                  Follow on LinkedIn <ArrowUpRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ═══ PILLARS ═══ */}
        <section className="section-padding bg-[#0A0A0A]">
          <div className="site-container">
            <motion.div className="section-eyebrow text-[#9361A1]" initial={reducedMotion ? {} : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }}>
              What We Stand For
            </motion.div>
            <motion.h2 className="section-title mt-3" initial={reducedMotion ? {} : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: 0.08 }}>
              Four pillars of our initiative
            </motion.h2>
            <motion.div className="mt-12 grid gap-6 md:grid-cols-2" variants={staggerContainer(0.1)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
              {pillars.map((p) => (
                <motion.article key={p.title} variants={fadeUp} whileHover={reducedMotion ? {} : { y: -4, boxShadow: '0 0 0 1px rgba(109,100,173,0.4), 0 12px 36px rgba(109,100,173,0.1)' }} className="glass-card flex gap-5 p-8">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#6D64AD]/[0.15] text-[#9361A1]">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[17px] font-semibold text-white">{p.title}</h3>
                    <p className="mt-2 text-[14px] leading-[1.7] text-[#C8C6BE]">{p.description}</p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ GALLERY — Auto-populated from /public/her-tech-era-photos/ ═══ */}
        {galleryImages.length > 0 && (
          <section className="section-padding bg-[#0A0A0A]">
            <div className="site-container">
              <motion.div className="section-eyebrow text-[#9361A1]" initial={reducedMotion ? {} : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }}>
                <Calendar className="h-3.5 w-3.5" /> Community Day Highlights
              </motion.div>
              <motion.h2 className="section-title mt-3" initial={reducedMotion ? {} : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: 0.08 }}>
                It's Her Tech Era in action
              </motion.h2>
              <motion.div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" variants={staggerContainer(0.06)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
                {galleryImages.map((src, i) => (
                  <motion.div
                    key={src}
                    variants={fadeUp}
                    whileHover={reducedMotion ? {} : { scale: 1.03, boxShadow: '0 0 0 1px rgba(109,100,173,0.4), 0 12px 36px rgba(109,100,173,0.15)' }}
                    className={`relative overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#141414] cursor-pointer ${i === 0 || i === 3 ? 'md:row-span-2' : ''}`}
                  >
                    <img
                      src={`/her-tech-era-photos/${src}`}
                      alt={`Her Tech Era highlight ${i + 1}`}
                      className={`w-full object-cover transition-transform duration-500 hover:scale-105 ${i === 0 || i === 3 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* ═══ TIMELINE ═══ */}
        <section className="section-padding bg-[#0A0A0A]">
          <div className="site-container">
            <motion.div className="section-eyebrow text-[#9361A1]" initial={reducedMotion ? {} : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }}>Our Journey</motion.div>
            <motion.h2 className="section-title mt-3" initial={reducedMotion ? {} : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: 0.08 }}>
              From first panel to full initiative
            </motion.h2>
            <motion.div className="mt-12 relative" variants={staggerContainer(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#9361A1]/40 via-[#6D64AD]/20 to-transparent md:-translate-x-px" />
              {timeline.map((evt, i) => (
                <motion.div key={evt.date} variants={fadeUp} className={`relative flex gap-8 pb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="absolute left-4 md:left-1/2 top-1 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[#9361A1] bg-[#0A0A0A] z-10" />
                  <div className="hidden md:block md:w-1/2" />
                  <div className="ml-10 md:ml-0 md:w-1/2 md:px-8">
                    <div className="glass-card p-6">
                      <div className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#9361A1]">{evt.date}</div>
                      <h3 className="mt-2 text-[17px] font-semibold text-white">{evt.title}</h3>
                      <p className="mt-2 text-[14px] leading-[1.7] text-[#C8C6BE]">{evt.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section className="section-padding bg-[#0A0A0A]">
          <div className="site-container">
            <motion.div className="section-eyebrow text-[#9361A1]" initial={reducedMotion ? {} : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }}>Community Voices</motion.div>
            <motion.h2 className="section-title mt-3" initial={reducedMotion ? {} : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: 0.08 }}>
              Real conversations, shared journeys
            </motion.h2>
            <motion.div className="mt-10 grid gap-6 md:grid-cols-2" variants={staggerContainer(0.12)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
              {voices.map((v) => (
                <motion.article key={v.name} variants={fadeUp} className="glass-card p-8">
                  <p className="text-[16px] leading-[1.75] text-[#C8C6BE] italic">"{v.quote}"</p>
                  <div className="mt-6 flex items-center gap-4">
                    <img src={v.image} alt={v.name} className="h-14 w-14 rounded-full object-cover ring-2 ring-[#6D64AD]/30" loading="lazy" />
                    <div>
                      <div className="text-[15px] font-semibold text-white">{v.name}</div>
                      <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">{v.role}</div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ VALUES ═══ */}
        <section className="section-padding bg-[#0A0A0A]">
          <div className="site-container">
            <motion.div className="section-eyebrow text-[#9361A1]" initial={reducedMotion ? {} : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5 }}>Our Values</motion.div>
            <motion.h2 className="section-title mt-3" initial={reducedMotion ? {} : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: 0.08 }}>
              What drives this initiative
            </motion.h2>
            <motion.div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" variants={staggerContainer(0.08)} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
              {values.map((val) => (
                <motion.article key={val.title} variants={fadeUp} whileHover={reducedMotion ? {} : { y: -4 }} className="glass-card p-7 text-center" style={{ borderTopColor: '#6D64AD', borderTopWidth: 2 }}>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6D64AD]/[0.15] text-[#9361A1]">
                    <val.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-[16px] font-semibold text-white">{val.title}</h3>
                  <p className="mt-3 text-[13px] leading-[1.7] text-[#C8C6BE]">{val.description}</p>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ CTA BANNER — Purple gradient with two action buttons ═══ */}
        <section className="section-padding bg-[#0A0A0A]">
          <div className="site-container">
            <motion.div className="relative overflow-hidden rounded-2xl p-12 md:p-16 text-center"
              style={{ background: 'linear-gradient(135deg, #3B3242 0%, #6D64AD 40%, #9361A1 60%, #483184 100%)' }}
              initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
            >
              {/* <img src={wingsSvg} alt="" aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 w-[90%] max-w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-10 select-none" /> */}
              <div className="relative z-10">
                <Sparkles className="mx-auto h-8 w-8 text-white/80 mb-5" />
                <h2 className="text-[clamp(24px,3.5vw,40px)] font-bold tracking-[-0.02em] text-white">
                  Ready to be part of the era?
                </h2>
                <p className="mt-4 mx-auto max-w-[560px] text-[16px] leading-[1.7] text-white/70">
                  Whether you want to volunteer, speak at an offline or online session, or simply be part of the community — there's a place for you here.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Button
                    size="lg"
                    className="h-12 rounded-full bg-white px-8 text-[14px] font-semibold text-[#483184] hover:bg-white/90"
                    onClick={() => openJoinModal('speaker')}
                  >
                    <Mic2 className="mr-2 h-4 w-4" />
                    Speak at a Session
                  </Button>
                  <Button
                    size="lg"
                    className="h-12 rounded-full border-2 border-white/30 bg-transparent px-8 text-[14px] font-semibold text-white hover:bg-white/10"
                    onClick={() => openJoinModal('volunteer')}
                  >
                    <HandHeart className="mr-2 h-4 w-4" />
                    Support as Volunteer
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
        <BackToTop />
      </motion.div>

      {/* Join Form Modal */}
      <JoinFormModal
        open={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        initialRole={joinModalRole}
      />
    </>
  );
};

export default WomenInTechPage;
