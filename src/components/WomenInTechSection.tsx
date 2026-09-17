import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight, GraduationCap, Handshake, MicVocal, Sparkles, Users2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useInterval } from '@/hooks/use-interval';
import { fadeUp, staggerContainer } from '@/lib/motion-variants';
import afreenBano from '@/assets/panelist/Afreen Bano.jpeg';
import priyankaSinghSolanki from '@/assets/panelist/Priyanka Singh Solanki.jpeg';
// import wingsSvg from '@/assets/wings.svg';

const pillars = [
  { title: 'Learning without gatekeeping', description: 'Hands-on sessions, role models, and approachable community spaces help more women build AWS confidence step by step.', icon: GraduationCap },
  { title: 'Visibility in technical rooms', description: 'Women in Tech is also about being seen as speakers, builders, mentors, organizers, and decision-makers in cloud conversations.', icon: MicVocal },
  { title: 'Networks that compound', description: 'The best communities do more than host events. They create friendships, referrals, mentorship, and long-term momentum.', icon: Users2 },
] as const;

const voices = [
  { name: 'Afreen Bano', role: 'Community voice', image: afreenBano, quote: 'AWSUG Pune gave me the platform to go from an attendee to a speaker and a community organizer. That progression changed my career trajectory.' },
  { name: 'Priyanka Singh Solanki', role: 'Cloud leadership', image: priyankaSinghSolanki, quote: "The Women in Tech initiative here isn't performative — it's practical. Real workshops, real mentors, real outcomes." },
] as const;

const outcomes = [
  { label: 'Belonging', title: 'A place to ask the first question', description: 'A strong Women in Tech community lowers the pressure to already know everything before showing up.' },
  { label: 'Momentum', title: 'From attendee to speaker to mentor', description: 'The long-term goal is not attendance alone. It is more women growing into visible technical and community leadership.' },
  { label: 'AWSUG Pune', title: 'Community first, always practical', description: 'The section is rooted in real AWSUG Pune energy: meetups, collaborations, shared journeys, and cloud learning with purpose.' },
] as const;

const WomenInTechSection = () => {
  const reducedMotion = useReducedMotion();
  const [activeVoice, setActiveVoice] = useState(0);

  const advanceTestimonial = useCallback(() => {
    setActiveVoice((prev) => (prev + 1) % voices.length);
  }, []);

  useInterval(advanceTestimonial, 5000);

  return (
    <section id="women-in-tech" className="scroll-mt-24 relative overflow-hidden">
      {/* ── Top fade: blend from dark bg into purple ── */}
      <div className="h-16 md:h-24" style={{ background: 'linear-gradient(to bottom, #0A0A0A, #1A1525)' }} />

      {/* ── Main purple-themed container ── */}
      <div className="relative" style={{ background: 'linear-gradient(180deg, #1A1525 0%, #2A2040 20%, #3B3242 50%, #2A2040 80%, #1A1525 100%)' }}>
        {/* Subtle purple radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(109,100,173,0.08) 0%, transparent 60%)',
        }} />

        <div className="relative z-10 mx-auto w-full max-w-[1120px] px-5 sm:px-6 md:px-8 py-14 md:py-28">

          {/* ── Two-column layout (stacks on mobile) ── */}
          <div className="grid gap-10 md:gap-14 lg:grid-cols-[1fr_0.92fr]">

            {/* ── Left: editorial ── */}
            <div>
              {/* Eyebrow — wraps better on mobile with flex-wrap */}
              <motion.div className="flex flex-wrap items-center gap-1.5 sm:gap-2"
                initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="h-3.5 w-3.5 text-[#9361A1] shrink-0" />
                <span className="text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.1em] text-[#9361A1]">Her Tech Era</span>
                <span className="text-[11px] sm:text-[13px] text-[#9CA3AF]">→</span>
                <span className="text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.1em] text-[#C8C6BE]">Women in Tech</span>
              </motion.div>

              {/* Title — responsive sizing */}
              <motion.div className="mt-4 relative"
                initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: 0.08 }}
              >
                {/* Wings watermark behind title */}
                {/* <img src={wingsSvg} alt="" aria-hidden="true" className="pointer-events-none absolute left-0 top-1/2 w-[120%] max-w-[600px] -translate-y-1/2 opacity-[0.06] select-none" /> */}
                <h2 className="relative text-[clamp(24px,5.5vw,36px)] font-semibold leading-[1.2] tracking-[-0.025em] text-white">
                  Cloud confidence, community, and a clearer path to lead.
                </h2>
              </motion.div>

              {/* Tagline — cursive */}
              <motion.p className="mt-3 text-[clamp(14px,2.5vw,22px)] text-[#9361A1]/80"
                style={{ fontFamily: "'Dancing Script', cursive" }}
                initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: 0.12 }}
              >
                Scaling Heights, Building Dreams
              </motion.p>

              {/* Body text */}
              <motion.p className="mt-4 md:mt-5 text-[14px] md:text-[16px] leading-[1.7] text-[#C8C6BE]/90 max-w-[560px]"
                initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: 0.16 }}
              >
                In the AWS ecosystem, Women in Tech is about helping more women learn,
                build, speak, mentor, and lead across cloud, AI, DevOps, data, platform,
                and architecture. For AWS User Group Pune, that means turning inclusion
                into something visible: approachable meetups, role models on stage, real
                conversations, and a community where growth feels possible.
              </motion.p>

              {/* Pillars */}
              <motion.div className="mt-8 md:mt-10 space-y-5 md:space-y-6"
                variants={staggerContainer(0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
              >
                {pillars.map((pillar) => (
                  <motion.div key={pillar.title} variants={fadeUp} className="flex items-start gap-3 sm:gap-4">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#6D64AD]/[0.15] text-[#9361A1]">
                      <pillar.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[14px] sm:text-[15px] font-semibold text-white">{pillar.title}</div>
                      <p className="mt-1.5 sm:mt-2 text-[13px] sm:text-[14px] leading-[1.6] text-[#C8C6BE]/80">{pillar.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* ── Right: testimonial carousel ── */}
            <motion.div className="space-y-4"
              initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.22 }}
            >
              <div className="text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.1em] text-[#9361A1] flex items-center gap-2">
                Community voices
              </div>
              <h3 className="text-[clamp(20px,3vw,32px)] font-semibold tracking-[-0.02em] leading-[1.25] text-white">
                Real conversations. Shared journeys. More women shaping cloud.
              </h3>

              <div className="mt-5 md:mt-6 relative min-h-[200px] sm:min-h-[220px]">
                <AnimatePresence mode="wait">
                  <motion.article
                    key={activeVoice}
                    initial={reducedMotion ? {} : { x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={reducedMotion ? {} : { x: -40, opacity: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="flex flex-col rounded-xl border border-[#6D64AD]/20 bg-[#1A1525]/80 p-5 sm:p-6 backdrop-blur-sm"
                  >
                    <p className="flex-1 text-[14px] sm:text-[15px] leading-[1.7] text-[#C8C6BE] italic">
                      "{voices[activeVoice].quote}"
                    </p>
                    <div className="mt-5 sm:mt-6 flex items-center gap-3">
                      <img
                        src={voices[activeVoice].image}
                        alt={voices[activeVoice].name}
                        className="h-11 w-11 sm:h-12 sm:w-12 rounded-full object-cover ring-1 ring-[#6D64AD]/30"
                        loading="lazy"
                      />
                      <div>
                        <div className="text-[14px] sm:text-[15px] font-semibold text-white">{voices[activeVoice].name}</div>
                        <div className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">
                          {voices[activeVoice].role}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </AnimatePresence>

                {/* Dot indicators */}
                <div className="mt-4 flex items-center gap-2">
                  {voices.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveVoice(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === activeVoice ? 'w-6 bg-[#9361A1]' : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`View testimonial ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* CTA buttons — stack on mobile */}
              <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
                <Button asChild size="lg" className="h-11 rounded-full bg-[#6D64AD] px-6 text-[14px] font-semibold text-white hover:bg-[#5B54A0] w-full sm:w-auto justify-center">
                  <Link to="/her-tech-era">
                    Explore Her Tech Era
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>

                <Button asChild variant="heroOutline" size="lg" className="h-11 rounded-full border-[#6D64AD]/30 px-6 text-[14px] font-semibold text-white hover:bg-[#6D64AD]/10 w-full sm:w-auto justify-center">
                  <a href="https://www.linkedin.com/company/aws-user-group-pune/" target="_blank" rel="noopener noreferrer">
                    Follow on LinkedIn
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* ── Value cards with purple top border ── */}
          <motion.div className="mt-10 md:mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3"
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            {outcomes.map((outcome) => (
              <motion.article
                key={outcome.title}
                variants={fadeUp}
                whileHover={reducedMotion ? {} : {
                  y: -4,
                  boxShadow: '0 0 0 1px rgba(109,100,173,0.3), 0 12px 36px rgba(109,100,173,0.08)',
                }}
                className="rounded-xl border border-[#6D64AD]/15 bg-[#141420]/60 p-6 sm:p-8 backdrop-blur-sm"
                style={{ borderTopColor: '#6D64AD', borderTopWidth: 2 }}
              >
                <div className="text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.1em] text-[#9361A1]">{outcome.label}</div>
                <h4 className="mt-2 sm:mt-3 text-[18px] sm:text-[24px] font-semibold tracking-[-0.02em] leading-[1.3] text-white">
                  {outcome.title}
                </h4>
                <p className="mt-3 sm:mt-4 text-[13px] sm:text-[15px] leading-[1.7] text-[#C8C6BE]">
                  {outcome.description}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Bottom fade: blend back to dark bg ── */}
      <div className="h-16 md:h-24" style={{ background: 'linear-gradient(to bottom, #1A1525, #0A0A0A)' }} />
    </section>
  );
};

export default WomenInTechSection;
