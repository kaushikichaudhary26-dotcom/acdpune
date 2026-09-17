const TeamSectionSkeleton = () => {
  return (
    <section id="team" className="section-padding scroll-mt-24 bg-[var(--bg-primary)]">
      <div className="site-container">
        <div className="text-center">
          <div className="section-eyebrow justify-center text-primary">Community Team</div>
          <div className="mx-auto mt-3 h-12 w-72 rounded-full bg-white/[0.06]" />
          <div className="mx-auto mt-5 h-6 w-[32rem] max-w-full rounded-full bg-white/[0.06]" />
        </div>

        <div className="mt-16">
          <div className="section-eyebrow text-primary">Core Team</div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={`core-skeleton-${index}`} className="glass-card flex min-h-[280px] flex-col items-center text-center">
                <div className="h-20 w-20 animate-pulse rounded-full bg-white/[0.08]" />
                <div className="mt-5 h-5 w-32 animate-pulse rounded-full bg-white/[0.08]" />
                <div className="mt-3 h-7 w-24 animate-pulse rounded-full bg-white/[0.08]" />
                <div className="mt-auto h-9 w-9 animate-pulse rounded-full bg-white/[0.08]" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="section-eyebrow">Volunteers</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={`volunteer-skeleton-${index}`} className="glass-card flex min-h-[220px] flex-col items-center p-6 text-center opacity-[0.85]">
                <div className="h-14 w-14 animate-pulse rounded-full bg-white/[0.08]" />
                <div className="mt-4 h-4 w-28 animate-pulse rounded-full bg-white/[0.08]" />
                <div className="mt-auto h-9 w-9 animate-pulse rounded-full bg-white/[0.08]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSectionSkeleton;
