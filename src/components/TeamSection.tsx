import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, ChevronRight, X, ExternalLink } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import { useAvatar } from '@/hooks/use-avatar';
import useTeam, { TeamMember } from '../hooks/use-team';
import TeamSectionSkeleton from './TeamSectionSkeleton';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { fadeUp, staggerContainer } from '@/lib/motion-variants';

interface TeamMemberCardProps {
  member: TeamMember;
  isCoreTeam?: boolean;
  onSelect?: (member: TeamMember) => void;
}

const TeamMemberCard = ({ member, isCoreTeam = false, onSelect }: TeamMemberCardProps) => {
  const avatarUrl = useAvatar(member.name);
  const displaySrc = member.photoUrl && member.photoUrl !== '' ? member.photoUrl : avatarUrl;
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      variants={fadeUp}
      whileHover={reducedMotion ? {} : { y: -4 }}
      onClick={() => onSelect?.(member)}
      className="glass-card group flex flex-col items-center text-center cursor-pointer"
    >
      {/* Avatar with amber ring on hover */}
      <div className="relative">
        <img
          src={displaySrc}
          alt={member.name}
          loading="lazy"
          className="h-20 w-20 rounded-full object-cover ring-2 ring-[rgba(255,255,255,0.08)] transition-all duration-300 group-hover:ring-[#FF9900] group-hover:ring-[3px]"
        />
      </div>

      {/* Name slides up 4px on hover */}
      <h3 className="mt-5 text-[17px] font-semibold text-white transition-transform duration-300 group-hover:-translate-y-1">
        {member.name}
      </h3>

      {isCoreTeam && (
        <span className="mt-3 rounded-lg border border-[#FF9900]/[0.35] bg-[#FF9900]/10 px-3 py-1 text-[12px] font-semibold text-[#FF9900]">
          {member.role || 'Core Team'}
        </span>
      )}

      {!isCoreTeam && member.role && (
        <p className="mt-2 text-[13px] text-[#9CA3AF]">{member.role}</p>
      )}

      {/* LinkedIn icon appears on hover */}
      {member.linkedin ? (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-white/[0.02] text-[#9CA3AF] opacity-0 scale-[0.8] transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 hover:border-[#FF9900]/30 hover:text-white"
          aria-label={`${member.name}'s LinkedIn`}
        >
          <Linkedin className="h-4 w-4" />
        </a>
      ) : (
        <div className="mt-auto h-9" />
      )}
    </motion.article>
  );
};

/** Right-side sheet/drawer for member details */
const MemberDrawer = ({
  member,
  open,
  onClose,
}: {
  member: TeamMember | null;
  open: boolean;
  onClose: () => void;
}) => {
  const avatarUrl = useAvatar(member?.name || '');
  const displaySrc = member?.photoUrl && member.photoUrl !== '' ? member.photoUrl : avatarUrl;

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed right-0 top-0 z-[101] h-full w-full max-w-[420px] border-l border-[rgba(255,255,255,0.08)] bg-[#0A0A0A] p-8 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right overflow-y-auto">
          <Dialog.Close className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[#141414] text-white hover:bg-[#1E1E1E] transition-colors">
            <X className="h-5 w-5" />
          </Dialog.Close>

          {member && (
            <div className="pt-8">
              <img
                src={displaySrc}
                alt={member.name}
                className="mx-auto h-24 w-24 rounded-full object-cover ring-3 ring-[#FF9900]"
              />
              <h3 className="mt-6 text-center text-[22px] font-semibold text-white">
                {member.name}
              </h3>
              {member.role && (
                <p className="mt-2 text-center text-[14px] text-[#FF9900] font-medium">
                  {member.role}
                </p>
              )}

              <div className="mt-8 space-y-4">
                <div>
                  <div className="section-eyebrow text-[#9CA3AF] text-[11px]">Category</div>
                  <p className="mt-1 text-[14px] text-white capitalize">
                    {member.category || 'Team Member'}
                  </p>
                </div>

                {member.email && (
                  <div>
                    <div className="section-eyebrow text-[#9CA3AF] text-[11px]">Email</div>
                    <a
                      href={`mailto:${member.email}`}
                      className="mt-1 text-[14px] text-[#FF9900] hover:text-[#FFB133]"
                    >
                      {member.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Social links */}
              <div className="mt-8 flex gap-3">
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#141414] px-4 py-2.5 text-[13px] font-medium text-white hover:border-[#FF9900]/40 hover:bg-[#FF9900]/10 transition-all"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                    <ExternalLink className="h-3 w-3 text-[#9CA3AF]" />
                  </a>
                )}
                {member.twitter && (
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#141414] px-4 py-2.5 text-[13px] font-medium text-white hover:border-[#FF9900]/40 hover:bg-[#FF9900]/10 transition-all"
                  >
                    <X className="h-4 w-4" />
                    Twitter/X
                    <ExternalLink className="h-3 w-3 text-[#9CA3AF]" />
                  </a>
                )}
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const TeamSection = () => {
  const { core, volunteers, speakers, loading } = useTeam();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  const handleSelectMember = (member: TeamMember) => {
    setSelectedMember(member);
    setDrawerOpen(true);
  };

  if (loading) {
    return <TeamSectionSkeleton />;
  }

  const tabData = [
    { value: 'core', label: 'Core Team', members: core },
    { value: 'volunteers', label: 'Volunteers', members: volunteers },
    ...(speakers.length > 0 ? [{ value: 'speakers', label: 'Speakers', members: speakers }] : []),
  ];

  return (
    <>
      <section id="team" className="section-padding scroll-mt-24 bg-[#0A0A0A]">
        <div className="site-container">
          <div className="text-center">
            <motion.div
              className="section-eyebrow justify-center text-[#FF9900]"
              initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
            >
              Community Team
            </motion.div>
            <motion.h2
              className="section-title mt-3"
              initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              Meet The Team
            </motion.h2>
            <motion.p
              className="mx-auto mt-5 section-body text-center"
              initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.16 }}
            >
              The core team and volunteers who continuously drive and sustain the community year after year.
            </motion.p>
          </div>

          {/* ── Role-based tabs ──────────────────────── */}
          <Tabs.Root defaultValue="core" className="mt-16">
            <motion.div
              initial={reducedMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
            >
              <Tabs.List className="flex items-center gap-2 justify-center">
                {tabData.map((tab) => (
                  <Tabs.Trigger
                    key={tab.value}
                    value={tab.value}
                    className="rounded-full border border-[rgba(255,255,255,0.08)] px-5 py-2.5 text-[13px] font-semibold text-[#9CA3AF] transition-all data-[state=active]:bg-[#FF9900] data-[state=active]:text-white data-[state=active]:border-[#FF9900] hover:border-[rgba(255,255,255,0.2)] hover:text-white"
                  >
                    {tab.label} ({tab.members.length})
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </motion.div>

            {tabData.map((tab) => (
              <Tabs.Content key={tab.value} value={tab.value} className="mt-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab.value}
                    className="grid gap-5 sm:grid-cols-2 md:grid-cols-3"
                    variants={staggerContainer(0.06)}
                    initial="hidden"
                    animate="show"
                    exit={reducedMotion ? {} : { opacity: 0, transition: { duration: 0.15 } }}
                  >
                    {tab.members.map((member, index) => (
                      <TeamMemberCard
                        key={member.$id ?? `${tab.value}-${index}`}
                        member={member}
                        isCoreTeam={tab.value === 'core'}
                        onSelect={handleSelectMember}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </Tabs.Content>
            ))}
          </Tabs.Root>
        </div>
      </section>

      {/* ── Member detail drawer ─────────────────── */}
      <MemberDrawer
        member={selectedMember}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default TeamSection;
