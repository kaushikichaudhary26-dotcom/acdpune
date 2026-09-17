const SkeletonCard = ({ size = 'md' }: { size?: 'lg' | 'md' | 'sm' }) => {
    const sizeClasses = {
        lg: 'rounded-2xl',
        md: 'rounded-xl',
        sm: 'rounded-lg',
    };
    return (
        <div
            className={`bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 ${sizeClasses[size]} w-[200px] h-[200px] flex flex-col items-center justify-center p-6 animate-pulse`}
        >
            <div className="w-24 h-24 bg-gray-300 dark:bg-white/10 rounded-lg mb-4" />
            <div className="w-20 h-3 bg-gray-300 dark:bg-white/10 rounded-full" />
        </div>
    );
};

const SkeletonBadge = ({ width = 'w-32' }: { width?: string }) => (
    <div className="flex justify-center mb-8">
        <div className={`${width} h-8 bg-gray-200 dark:bg-white/10 rounded-full animate-pulse`} />
    </div>
);

const SkeletonDivider = () => (
    <div className="flex items-center gap-4 mb-14">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300/40 dark:via-white/10 to-transparent" />
    </div>
);

const SponsorsSkeleton = () => {
    return (
        <section id="sponsors" className="section-padding bg-background relative overflow-hidden">
            <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

            <div className="container mx-auto relative z-10">
                {/* Header skeleton */}
                <div className="text-center mb-16">
                    <div className="w-28 h-4 bg-gray-200 dark:bg-white/10 rounded-full mx-auto mb-4 animate-pulse" />
                    <div className="w-64 h-10 bg-gray-200 dark:bg-white/10 rounded-lg mx-auto mb-6 animate-pulse" />
                    <div className="w-96 max-w-full h-5 bg-gray-200 dark:bg-white/10 rounded-full mx-auto animate-pulse" />
                </div>

                {/* Title Sponsor skeleton */}
                <div className="mb-14">
                    <SkeletonBadge width="w-36" />
                    <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                        <SkeletonCard size="lg" />
                    </div>
                </div>

                <SkeletonDivider />

                {/* Gold Sponsors skeleton */}
                <div className="mb-14">
                    <SkeletonBadge width="w-36" />
                    <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                        {[...Array(3)].map((_, i) => <SkeletonCard key={i} size="md" />)}
                    </div>
                </div>

                <SkeletonDivider />

                {/* Silver Sponsors skeleton */}
                <div className="mb-14">
                    <SkeletonBadge width="w-36" />
                    <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                        {[...Array(4)].map((_, i) => <SkeletonCard key={i} size="md" />)}
                    </div>
                </div>

                <SkeletonDivider />

                {/* Bronze Sponsors skeleton */}
                <div className="mb-14">
                    <SkeletonBadge width="w-36" />
                    <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                        {[...Array(4)].map((_, i) => <SkeletonCard key={i} size="sm" />)}
                    </div>
                </div>

                {/* Community Partners skeleton */}
                <div className="mt-12">
                    <div className="w-40 h-5 bg-gray-200 dark:bg-white/10 rounded-full mx-auto mb-6 animate-pulse" />
                    <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                        {[...Array(3)].map((_, i) => <SkeletonCard key={i} size="sm" />)}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SponsorsSkeleton;
