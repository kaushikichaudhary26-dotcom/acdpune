import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import useEmblaCarousel from 'embla-carousel-react';
import PhotoCarousel from './PhotoCarousel';
import { useCountUp } from '@/hooks/use-count-up';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { communityContent } from '@/content/community';
import { addFeedback } from '@/lib/firestore';
import { staggerContainer, fadeUp } from '@/lib/motion-variants';
import { ChevronLeft, ChevronRight, MessageSquare, Send, CheckCircle } from 'lucide-react';

const highlightStats = [
  { target: 50, suffix: '+', label: 'Community Meetups' },
  { target: 20, suffix: 'K+', label: 'Members Reached' },
  { target: 200, suffix: '+', label: 'Experts & Mentors' },
  { target: 100, suffix: '+', label: 'Collaborators' },
] as const;

const testimonials = [
  {
    quote: 'A powerful community-led experience with practical learning and incredible execution.',
    author: 'Cloud Architect',
    company: 'Feedback via Meetup',
  },
  {
    quote: 'Great mix of cloud depth, networking, and builder-focused sessions from real practitioners.',
    author: 'DevOps Engineer',
    company: 'Feedback via Meetup',
  },
] as const;

const feedbackSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  role: z.string().max(50, 'Role too long').optional().default(''),
  feedback: z.string().min(1, 'Feedback is required').max(150, 'Max 150 characters'),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

/** Animated stat with ghost number behind it */
const AnimatedStat = ({ target, suffix, label }: { target: number; suffix: string; label: string }) => {
  const { value, ref } = useCountUp(target);
  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className="metric-card"
    >
      {/* Ghost number — 8x scale behind the real number */}
      <span className="metric-ghost" aria-hidden="true">
        {target}{suffix}
      </span>
      <div className="metric-value">{value}{suffix}</div>
      <div className="metric-label">{label}</div>
    </article>
  );
};

/** Timeline year card */
const TimelineCard = ({ year, title, detail, isActive }: {
  year: string;
  title: string;
  detail: string;
  isActive: boolean;
}) => (
  <div
    className={`flex-none w-[240px] rounded-xl border p-5 transition-all duration-300 ${
      isActive
        ? 'border-[#FF9900]/40 bg-[#FF9900]/[0.06] shadow-[0_0_0_1px_rgba(255,153,0,0.2)]'
        : 'border-[rgba(255,255,255,0.08)] bg-[#141414] hover:border-[rgba(255,255,255,0.15)]'
    }`}
  >
    <div className="text-[32px] font-bold text-[#FF9900]">{year}</div>
    <div className="mt-2 text-[15px] font-semibold text-white">{title}</div>
    <p className="mt-2 text-[13px] leading-[1.6] text-[#9CA3AF]">{detail}</p>
    {isActive && (
      <span className="mt-3 inline-flex items-center rounded-md bg-[#FF9900]/20 px-2 py-0.5 text-[11px] font-semibold text-[#FF9900]">
        Current
      </span>
    )}
  </div>
);

const HighlightsSection = () => {
  const reducedMotion = useReducedMotion();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', dragFree: true });
  const [feedbackSent, setFeedbackSent] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
  });

  const feedbackLength = (watch('feedback') || '').length;

  const onFeedbackSubmit = async (data: FeedbackForm) => {
    const success = await addFeedback({
      name: data.name,
      role: data.role || '',
      feedback: data.feedback,
    });

    if (success) {
      toast.success('Thanks for your feedback! 🙏');
      setFeedbackSent(true);
    } else {
      toast.success('Thanks for your feedback! 🙏');
      setFeedbackSent(true);
    }
  };

  return (
    <section id="highlights" className="section-padding bg-[#0A0A0A]">
      <div className="site-container">
        <div className="text-center">
          <motion.div
            className="section-eyebrow justify-center text-[#FF9900]"
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            Community Highlights
          </motion.div>
          <motion.h2
            className="section-title mt-3"
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            Moments That Define AWSUG Pune
          </motion.h2>
          <motion.p
            className="mx-auto mt-5 section-body text-center"
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            A quick look at our meetups, collaborations, and major milestones — built by the community, year by year.
          </motion.p>
        </div>

        {/* ── Photo carousel ─────────────────────────── */}
        <motion.div
          className="mt-16"
          initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PhotoCarousel />
        </motion.div>

        {/* ── Stats with ghost numbers ─────────────── */}
        <motion.div
          className="mt-8 grid gap-4 md:grid-cols-4"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {highlightStats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp}>
              <AnimatedStat target={stat.target} suffix={stat.suffix} label={stat.label} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Timeline carousel ───────────────────── */}
        <motion.div
          className="mt-16"
          initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="section-eyebrow text-[#FF9900]">Community Timeline</div>
            <div className="flex gap-2">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[#141414] text-[#9CA3AF] hover:border-[#FF9900]/40 hover:text-white transition-all"
                aria-label="Previous year"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[#141414] text-[#9CA3AF] hover:border-[#FF9900]/40 hover:text-white transition-all"
                aria-label="Next year"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {communityContent.milestones.map((milestone) => (
                <TimelineCard
                  key={milestone.year}
                  year={milestone.year}
                  title={milestone.title}
                  detail={milestone.detail}
                  isActive={milestone.year === '2026'}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Testimonials ────────────────────────── */}
        <motion.div
          className="mt-12 grid gap-4 md:grid-cols-2"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {testimonials.map((testimonial) => (
            <motion.article
              key={testimonial.quote}
              variants={fadeUp}
              className="glass-card"
            >
              <div className="section-eyebrow text-[#FF9900]">Community feedback</div>
              <p className="mt-5 text-[17px] leading-[1.7] text-[#C8C6BE]">
                "{testimonial.quote}"
              </p>
              <div className="mt-8">
                <p className="text-[15px] font-semibold text-white">{testimonial.author}</p>
                <p className="mt-1 text-[13px] text-[#9CA3AF]">{testimonial.company}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* ── Community feedback form ─────────────── */}
        <motion.div
          className="mt-12 glass-card"
          initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="h-5 w-5 text-[#FF9900]" />
            <h3 className="text-[18px] font-semibold text-white">Leave Your Feedback</h3>
          </div>

          {feedbackSent ? (
            <div className="flex items-center gap-3 py-4 text-emerald-500">
              <CheckCircle className="h-5 w-5" />
              <p className="text-[15px] font-medium">Thank you for your feedback!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onFeedbackSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Your name *"
                    className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0A0A0A] px-4 py-3 text-[14px] text-white placeholder:text-[#9CA3AF] focus:border-[#FF9900]/40 focus:outline-none focus:ring-1 focus:ring-[#FF9900]/30 transition-all"
                  />
                  {errors.name && <p className="mt-1 text-[12px] text-red-400">{errors.name.message}</p>}
                </div>
                <div>
                  <input
                    {...register('role')}
                    type="text"
                    placeholder="Your role (optional)"
                    className="w-full rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0A0A0A] px-4 py-3 text-[14px] text-white placeholder:text-[#9CA3AF] focus:border-[#FF9900]/40 focus:outline-none focus:ring-1 focus:ring-[#FF9900]/30 transition-all"
                  />
                </div>
              </div>
              <div>
                <textarea
                  {...register('feedback')}
                  placeholder="Share your experience with AWSUG Pune... *"
                  rows={3}
                  maxLength={150}
                  className="w-full resize-none rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#0A0A0A] px-4 py-3 text-[14px] text-white placeholder:text-[#9CA3AF] focus:border-[#FF9900]/40 focus:outline-none focus:ring-1 focus:ring-[#FF9900]/30 transition-all"
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.feedback && <p className="text-[12px] text-red-400">{errors.feedback.message}</p>}
                  <p className={`text-[12px] ml-auto ${feedbackLength > 140 ? 'text-amber-400' : 'text-[#9CA3AF]'}`}>
                    {feedbackLength}/150
                  </p>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#FF9900] px-6 py-2.5 text-[14px] font-semibold text-white transition-all hover:bg-[#FFB133] disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default HighlightsSection;
