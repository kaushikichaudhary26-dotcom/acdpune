import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Search } from 'lucide-react';
import useFAQs, { FAQItem } from '@/hooks/use-faq';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

// ── Fallback FAQ data matching spec ──────────────────────────────────

const fallbackFaqs: FAQItem[] = [
  // Group 1: Getting Involved
  { question: 'What is AWS Community Day Pune?', answer: 'AWS Community Day Pune is a community-led conference organized by the AWS User Group Pune, featuring talks, workshops, and networking around AWS technologies, cloud computing, AI/ML, and DevOps. It brings together builders, learners, and industry experts from across the region.', category: 'Getting Involved' },
  { question: 'How can I become a sponsor or speaker?', answer: 'You can reach out to us at aws.acd.pune@gmail.com with your proposal. For speakers, we look for practical, hands-on topics relevant to AWS and cloud technologies. For sponsors, we offer various tiers with visibility across our 20K+ member community.', category: 'Getting Involved' },
  { question: 'Is this free to attend?', answer: 'Yes! AWS Community Day Pune and our regular meetups are completely free to attend. We believe in keeping cloud learning accessible to everyone — students, professionals, and enthusiasts alike.', category: 'Getting Involved' },
  { question: 'What level of AWS knowledge do I need?', answer: 'All levels are welcome. Our events range from beginner-friendly introductions to advanced architecture deep-dives. Whether you\'re just starting with cloud or you\'re an experienced Solutions Architect, you\'ll find sessions relevant to you.', category: 'Getting Involved' },
  // Group 2: Community & Learning
  { question: 'What topics do meetups cover?', answer: 'Our meetups cover a wide range of topics including serverless architecture, containers & Kubernetes on AWS, AI/ML with SageMaker, data engineering, DevOps practices, security best practices, cost optimization, and emerging services.', category: 'Community & Learning' },
  { question: 'How do I join the Women in Tech track?', answer: 'Our Women in Tech initiative is open to everyone. Join our Meetup group and look for events tagged with "Women in Tech" or "SheBuilds." You can also follow our LinkedIn for announcements about dedicated sessions, mentorship programs, and networking events.', category: 'Community & Learning' },
  { question: 'Can I propose a talk or workshop?', answer: 'Absolutely! We actively encourage community members to share their knowledge. Submit your talk proposal via our Meetup page or email us at aws.acd.pune@gmail.com. We provide mentorship for first-time speakers too.', category: 'Community & Learning' },
  { question: 'How do I stay updated on events?', answer: 'Join our Meetup group (AWS User Group Pune) for event notifications, follow us on LinkedIn for updates, and enable browser notifications on this website. We also share updates via our community channels regularly.', category: 'Community & Learning' },
];

const groupConfig = [
  { key: 'Getting Involved', label: 'Getting Involved' },
  { key: 'Community & Learning', label: 'Community & Learning' },
] as const;

const FAQSection = () => {
  const { faqs: apiFaqs, loading, error } = useFAQs();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeValue, setActiveValue] = useState<string>('');
  const reducedMotion = useReducedMotion();

  // Use API FAQs if available, otherwise use fallbacks
  const faqs = apiFaqs.length > 0 ? apiFaqs : fallbackFaqs;

  // Filter FAQs by search query
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const query = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query),
    );
  }, [faqs, searchQuery]);

  // Group filtered FAQs
  const groupedFaqs = useMemo(() => {
    return groupConfig
      .map((group) => ({
        ...group,
        items: filteredFaqs.filter((faq) => {
          // Match by category or auto-classify
          if (faq.category) return faq.category === group.key;
          // Auto-classify based on content keywords
          const source = faq.question.toLowerCase();
          if (group.key === 'Getting Involved') {
            return /(sponsor|speaker|attend|free|knowledge|community day|what is)/.test(source);
          }
          return true;
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [filteredFaqs]);

  return (
    <section id="faq" className="section-padding scroll-mt-24 bg-[#0A0A0A]">
      <div className="site-container">
        <div className="text-center">
          <motion.div
            className="section-eyebrow justify-center text-[#FF9900]"
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            Community Help Desk
          </motion.div>
          <motion.h2
            className="section-title mt-3"
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            className="mx-auto mt-5 section-body text-center"
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            Answers about AWS User Group Pune, meetups, learning tracks, and community participation.
          </motion.p>
        </div>

        <div className="mx-auto mt-16 max-w-[860px]">
          {/* ── Search filter ────────────────────────────── */}
          <motion.div
            className="relative mb-8"
            initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#141414] py-3 pl-11 pr-4 text-[15px] text-white placeholder:text-[#9CA3AF] focus:border-[#FF9900]/40 focus:outline-none focus:ring-1 focus:ring-[#FF9900]/30 transition-all"
            />
          </motion.div>

          {loading ? (
            <div className="py-6 text-center text-[#9CA3AF]">Loading FAQs...</div>
          ) : error && apiFaqs.length === 0 ? (
            // Show fallbacks even on error
            <FAQGroups
              groups={groupedFaqs}
              activeValue={activeValue}
              onValueChange={setActiveValue}
              reducedMotion={reducedMotion}
            />
          ) : filteredFaqs.length > 0 ? (
            <FAQGroups
              groups={groupedFaqs}
              activeValue={activeValue}
              onValueChange={setActiveValue}
              reducedMotion={reducedMotion}
            />
          ) : (
            <div className="py-6 text-center text-[#9CA3AF]">
              {searchQuery ? 'No FAQs match your search.' : 'No FAQs available right now.'}
            </div>
          )}
        </div>

        <motion.p
          className="mt-12 text-center text-[15px] text-[#9CA3AF]"
          initial={reducedMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          Still have a question for the community team?{' '}
          <a
            href="mailto:aws.acd.pune@gmail.com"
            className="font-medium text-[#FF9900] hover:text-[#FFB133]"
          >
            Contact us
          </a>
        </motion.p>
      </div>
    </section>
  );
};

/** Renders grouped FAQ accordion items */
const FAQGroups = ({
  groups,
  activeValue,
  onValueChange,
  reducedMotion,
}: {
  groups: { key: string; label: string; items: FAQItem[] }[];
  activeValue: string;
  onValueChange: (value: string) => void;
  reducedMotion: boolean;
}) => (
  <>
    {groups.map((group, groupIndex) => (
      <motion.div
        key={group.key}
        className={groupIndex > 0 ? 'mt-12' : ''}
        initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: groupIndex * 0.08 }}
      >
        <div className="section-eyebrow text-[#FF9900]">{group.label}</div>
        <Accordion
          type="single"
          collapsible
          className="mt-5"
          value={activeValue}
          onValueChange={onValueChange}
        >
          <AnimatePresence>
            {group.items.map((faq, index) => {
              const itemValue = `${group.key}-${index}`;
              const isActive = activeValue === itemValue;

              return (
                <AccordionItem
                  key={faq.$id || itemValue}
                  value={itemValue}
                  className={`border-b border-[rgba(255,255,255,0.08)] transition-all duration-200 ${
                    isActive ? 'border-l-2 border-l-[#FF9900] pl-4' : 'border-l-2 border-l-transparent pl-4'
                  }`}
                >
                  <AccordionTrigger className="gap-6 py-5 text-left text-[18px] font-medium text-white hover:no-underline hover:text-white">
                    <span>{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 pr-10 text-[15px] leading-[1.75] text-[#C8C6BE]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </AnimatePresence>
        </Accordion>
      </motion.div>
    ))}
  </>
);

export default FAQSection;
