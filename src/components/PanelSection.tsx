import { useAvatar } from '@/hooks/use-avatar';
import { Linkedin, Twitter, Users2, Sparkles } from 'lucide-react';
import usePanelists, { Panelist } from '@/hooks/use-panelists';

interface PanelistCardProps {
    panelist: Panelist;
    isModerator?: boolean;
}

const PanelistCard = ({ panelist, isModerator = false }: PanelistCardProps) => {
    const avatarUrl = useAvatar(panelist.name);
    const displaySrc = panelist.photoUrl && panelist.photoUrl !== '' ? panelist.photoUrl : avatarUrl;

    const formatTwitterHref = (t?: string) => {
        if (!t) return '';
        if (t.startsWith('http')) return t;
        return `https://twitter.com/${t.replace(/^@/, '')}`;
    };

    if (isModerator) {
        return (
            <div className="group relative bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-8 transition-all duration-500 hover:border-cyan-400/60 hover:shadow-[0_0_60px_hsl(188_100%_50%/0.15)] overflow-hidden">
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Moderator badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full text-white text-sm font-semibold shadow-lg shadow-cyan-500/30">
                    <Users2 className="w-4 h-4" />
                    Moderator
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 pt-9">
                    {/* Photo */}
                    <div className="relative">
                        <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden border-2 border-cyan-500/40 group-hover:border-cyan-400 transition-colors shadow-xl shadow-cyan-500/20">
                            <img
                                src={displaySrc}
                                alt={panelist.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Users2 className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                            {panelist.name}
                        </h3>
                        <p className="text-cyan-400 font-medium text-lg mb-1">
                            {panelist.title}
                        </p>
                        <p className="text-muted-foreground mb-4">
                            @ {panelist.company}
                        </p>

                        {panelist.bio && (
                            <p className="text-muted-foreground text-sm mb-4 max-w-xl italic">
                                {panelist.bio}
                            </p>
                        )}

                        {/* Social Links */}
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            {panelist.linkedin && (
                                <a
                                    href={panelist.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-secondary/80 hover:bg-[#0077B5] rounded-xl flex items-center justify-center text-muted-foreground hover:text-white transition-all duration-300 hover:scale-110"
                                    aria-label={`${panelist.name}'s LinkedIn`}
                                >
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            )}
                            {panelist.twitter && (
                                <a
                                    href={formatTwitterHref(panelist.twitter)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-secondary/80 hover:bg-foreground rounded-xl flex items-center justify-center text-muted-foreground hover:text-background transition-all duration-300 hover:scale-110"
                                    aria-label={`${panelist.name}'s Twitter`}
                                >
                                    <Twitter className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Regular panelist card
    return (
        <div className="group relative bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-lg border border-border/50 rounded-2xl p-6 transition-all duration-400 hover:border-cyan-500/40 hover:shadow-[0_0_40px_hsl(188_100%_50%/0.1)] hover:-translate-y-2 overflow-hidden">
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

            <div className="relative z-10">
                {/* Photo */}
                <div className="relative mb-5 mx-auto w-28 h-28">
                    <div className="w-28 h-28 rounded-2xl overflow-hidden border border-border/60 group-hover:border-cyan-500/50 transition-all duration-300 shadow-lg">
                        <img
                            src={displaySrc}
                            alt={panelist.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Info */}
                <div className="text-center">
                    <h3 className="font-display text-lg font-bold text-foreground mb-1 group-hover:text-cyan-400 transition-colors">
                        {panelist.name}
                    </h3>
                    <p className="text-cyan-400/80 font-medium text-sm mb-1">
                        {panelist.title}
                    </p>
                    <p className="text-muted-foreground text-sm mb-3">
                        @ {panelist.company}
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center justify-center gap-2">
                        {panelist.linkedin && (
                            <a
                                href={panelist.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 bg-secondary/60 hover:bg-[#0077B5] rounded-lg flex items-center justify-center text-muted-foreground hover:text-white transition-all duration-300"
                                aria-label={`${panelist.name}'s LinkedIn`}
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                        )}
                        {panelist.twitter && (
                            <a
                                href={formatTwitterHref(panelist.twitter)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 bg-secondary/60 hover:bg-foreground rounded-lg flex items-center justify-center text-muted-foreground hover:text-background transition-all duration-300"
                                aria-label={`${panelist.name}'s Twitter`}
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const PanelSection = () => {
    const panelAnnounced = import.meta.env.VITE_PANELISTS_ANNOUNCED === 'true';
    const { moderator, regular, loading } = usePanelists();

    return (
        <section id="panelists" className="section-padding bg-background relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] -translate-y-1/2" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-cyan-600/3 rounded-full blur-[80px] translate-x-1/2" />

            <div className="container mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 text-cyan-400 font-semibold text-sm uppercase tracking-wider mb-4">
                        <Users2 className="w-4 h-4" />
                        Distinguished Panel
                        <Users2 className="w-4 h-4" />
                    </span>
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">
                            The Panel
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                        Join our panel of industry experts and thought leaders as they discuss the future of work,
                        <span className="block mt-2 text-white font-semibold">
                            AI, Skills, and the Evolution of Education
                        </span>
                    </p>
                </div>

                {/* ─── Coming Soon State ──────────────────────────── */}
                {!panelAnnounced && (
                    <div className="relative">
                        {/* Floating particles */}
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={`particle-${i}`}
                                className="absolute w-1 h-1 rounded-full bg-cyan-400/30 animate-pulse"
                                style={{
                                    top: `${10 + Math.random() * 80}%`,
                                    left: `${5 + Math.random() * 90}%`,
                                    animationDelay: `${i * 0.3}s`,
                                    animationDuration: `${2 + Math.random() * 3}s`,
                                }}
                            />
                        ))}

                        {/* Placeholder cards */}
                        <div className="flex flex-wrap justify-center gap-5 md:gap-8 mb-14">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={`placeholder-${i}`}
                                    className="group relative w-[140px] sm:w-[170px] rounded-2xl overflow-hidden"
                                    style={{ animationDelay: `${i * 150}ms` }}
                                >
                                    {/* Animated gradient border */}
                                    <div
                                        className="absolute inset-0 rounded-2xl p-[1.5px] opacity-40 group-hover:opacity-80 transition-opacity duration-500"
                                        style={{
                                            background: `linear-gradient(${135 + i * 45}deg, hsl(188, 100%, 50%), hsl(186, 100%, 40%), hsl(188, 95%, 45%), hsl(188, 100%, 50%))`,
                                            backgroundSize: '300% 300%',
                                            animation: `gradient ${3 + i}s ease infinite`,
                                        }}
                                    >
                                        <div className="w-full h-full rounded-2xl bg-card" />
                                    </div>

                                    {/* Card content */}
                                    <div className="relative p-5 sm:p-6 flex flex-col items-center text-center bg-card/80 rounded-2xl m-[1.5px]">
                                        {/* Avatar placeholder */}
                                        <div className="relative mb-4 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500/10 via-cyan-400/5 to-cyan-600/10 border border-border/40 flex items-center justify-center">
                                            <span className="text-2xl sm:text-3xl font-bold text-cyan-400/20 select-none animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>?</span>
                                            {/* Shimmer sweep */}
                                            <div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12"
                                                style={{
                                                    animation: 'shimmerSweep 3s ease-in-out infinite',
                                                    animationDelay: `${i * 0.5}s`,
                                                }}
                                            />
                                        </div>

                                        {/* Name bar */}
                                        <div className="h-3 w-20 sm:w-24 rounded-full bg-foreground/10 mb-2 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                                        {/* Title bar */}
                                        <div className="h-2 w-14 sm:w-16 rounded-full bg-foreground/5 animate-pulse" style={{ animationDelay: `${i * 100 + 150}ms` }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Center piece */}
                        <div className="flex flex-col items-center">
                            <p className="text-muted-foreground text-center max-w-lg mb-8 text-sm md:text-base leading-relaxed">
                                Our panel of experts is being finalized. We're assembling a diverse group of leaders to discuss
                                the most pressing topics in tech and business today. Stay tuned!
                            </p>
                        </div>

                        {/* Keyframe for shimmer sweep */}
                        <style>{`
                            @keyframes shimmerSweep {
                                0%, 100% { transform: translateX(-200%) skewX(-12deg); }
                                50% { transform: translateX(200%) skewX(-12deg); }
                            }
                        `}</style>
                    </div>
                )}

                {/* ─── Announced Panelists ─────────────────────────── */}
                {panelAnnounced && !loading && (
                    <>
                        {/* Moderator */}
                        {moderator && (
                            <div className="mb-16">
                                {/* Moderator Headline */}
                                <div className="flex items-center justify-center gap-4 mb-10">
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-cyan-500/10" />
                                    <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/10 via-cyan-500/15 to-cyan-500/10 border border-cyan-500/25 rounded-full">
                                        <Users2 className="w-5 h-5 text-cyan-400" />
                                        <span className="font-display text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-500 bg-clip-text text-transparent tracking-wide">
                                            Panel Moderator
                                        </span>
                                        <Users2 className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-cyan-500/40 to-cyan-500/10" />
                                </div>
                                <div className="flex justify-center max-w-2xl mx-auto mb-12">
                                    <PanelistCard
                                        panelist={moderator}
                                        isModerator
                                    />
                                </div>
                            </div>
                        )}

                        {/* Panelists */}
                        {regular.length > 0 && (
                            <div>
                                {moderator && (
                                    <div className="flex items-center gap-4 mb-12">
                                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                                        <span className="text-muted-foreground text-sm font-medium px-4 py-2 bg-secondary/50 rounded-full border border-border/50">
                                            Panelists
                                        </span>
                                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                                    </div>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                                    {regular.map((panelist, index) => (
                                        <PanelistCard
                                            key={panelist.$id ?? index}
                                            panelist={panelist}
                                        />
                                    ))}
                                </div>

                                {/* Panel Topic Section
                                <div className="mt-16 relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-cyan-400/10 to-cyan-500/10 rounded-3xl blur-xl" />
                                    <div className="relative bg-gradient-to-r from-card/90 via-card/70 to-card/90 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 md:p-12 text-center">
                                        <div className="flex justify-center mb-4">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
                                                <Sparkles className="w-4 h-4 text-cyan-400" />
                                                <span className="text-cyan-400 text-sm font-semibold">Panel Discussion Topic</span>
                                            </div>
                                        </div>
                                        <h3 className="font-display text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-cyan-300">
                                            Future of Work: AI, Skills, and the Evolution of Education
                                        </h3>
                                        <p className="text-muted-foreground text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
                                            Explore how artificial intelligence is reshaping the workplace, what skills professionals need to thrive,
                                            and how educational institutions are evolving to prepare the next generation of tech leaders.
                                        </p>
                                    </div>
                                </div> */}
                            </div>
                        )}
                    </>
                )}

                {panelAnnounced && loading && (
                    <div className="text-center text-muted-foreground py-12">Loading panelists...</div>
                )}
            </div>
        </section>
    );
};

export default PanelSection;
