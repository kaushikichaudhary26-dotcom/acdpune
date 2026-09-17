import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Home, RotateCcw, Terminal } from "lucide-react";

/* ── Cloud-themed particles ── */
const CLOUD_EMOJIS = ["☁️", "⚡", "🌩️", "💨", "🌀", "🔧"];

const FloatingParticle = ({ delay, emoji }: { delay: number; emoji: string }) => {
  const style: React.CSSProperties = {
    position: "absolute",
    fontSize: `${Math.random() * 16 + 14}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    opacity: 0.15 + Math.random() * 0.2,
    animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
    animationDelay: `${delay}s`,
    pointerEvents: "none",
    userSelect: "none",
  };
  return <span style={style}>{emoji}</span>;
};

/* ── Fake terminal log ── */
const LOG_LINES = [
  { text: "$ aws s3 ls s3://your-page", delay: 0 },
  { text: "An error occurred (NoSuchBucket)…", delay: 800, isError: true },
  { text: "$ kubectl get pods --namespace=pages", delay: 1600 },
  { text: "No resources found. 🫠", delay: 2400, isError: true },
  { text: "$ terraform plan", delay: 3200 },
  { text: "Error: Resource not found", delay: 4000, isError: true },
  { text: "$ echo \"Maybe just go home?\"", delay: 4800 },
  { text: "Maybe just go home? ✅", delay: 5600 },
];

const TerminalWindow = () => {
  const [visibleLines, setVisibleLines] = useState(0);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers = LOG_LINES.map((line, i) =>
      setTimeout(() => {
        setVisibleLines(i + 1);
        if (termRef.current) {
          termRef.current.scrollTop = termRef.current.scrollHeight;
        }
      }, line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto rounded-xl overflow-hidden border border-border shadow-2xl shadow-primary/10">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-card border-b border-border">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-3 text-xs text-muted-foreground font-mono flex items-center gap-1.5">
          <Terminal className="w-3 h-3" /> cloud-debug-session
        </span>
      </div>
      {/* Terminal body */}
      <div
        ref={termRef}
        className="bg-[hsl(230_25%_6%)] p-4 font-mono text-xs sm:text-sm leading-relaxed h-52 overflow-y-auto"
      >
        {LOG_LINES.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className={`${line.isError ? "text-red-400" : "text-emerald-400"} animate-fade-in`}
          >
            {line.text}
          </div>
        ))}
        {visibleLines < LOG_LINES.length && (
          <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse" />
        )}
      </div>
    </div>
  );
};

/* ── Main 404 Page ── */
const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [clicks, setClicks] = useState(0);

  const funnyMessages = [
    "This page went serverless… permanently.",
    "Looks like this route migrated to another region.",
    "404: Page is currently in a different Availability Zone.",
    "We deployed this page, but it auto-scaled to zero.",
    "This page failed its health check. 💀",
    "Error: PageNotFoundException — even CloudWatch can't find it.",
    "Our Lambda function ran, but the page timed out. Classic.",
  ];

  const [message] = useState(
    () => funnyMessages[Math.floor(Math.random() * funnyMessages.length)]
  );

  const eastereggMessages = [
    "Still clicking? The page isn't coming back. 😂",
    "AWS Support Tier: Premium Confusion™",
    "Have you tried turning the cloud off and on again?",
    "This click has been added to your AWS bill. 💸",
    "Stop! You'll exceed your free-tier click limit!",
  ];

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background particles */}
      {CLOUD_EMOJIS.map((emoji, i) => (
        <FloatingParticle key={i} delay={i * 0.6} emoji={emoji} />
      ))}
      {CLOUD_EMOJIS.map((emoji, i) => (
        <FloatingParticle key={`b-${i}`} delay={i * 0.9 + 2} emoji={emoji} />
      ))}

      {/* Glow blobs */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1.5s" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl w-full space-y-8">
        {/* Big 404 */}
        <div className="relative">
          <h1
            className="font-display text-[8rem] sm:text-[10rem] md:text-[12rem] font-black leading-none select-none gradient-text"
            style={{ lineHeight: 0.9 }}
          >
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-5xl sm:text-6xl animate-float">☁️</span>
          </div>
        </div>

        {/* Funny tagline */}
        <div className="space-y-3">
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
            Page Not Found in Any Region
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
            {message}
          </p>
          <p className="text-xs text-muted-foreground/50 font-mono">
            Route: <code className="text-accent/70">{location.pathname}</code>
          </p>
        </div>

        {/* Terminal gag */}
        <TerminalWindow />

        {/* Easter egg counter */}
        {clicks > 0 && clicks < 5 && (
          <p className="text-sm text-muted-foreground animate-fade-in">
            🖱️ Clicks: {clicks}… the page still doesn't exist.
          </p>
        )}
        {clicks >= 5 && (
          <p className="text-sm text-accent font-semibold animate-fade-in">
            {eastereggMessages[Math.min(clicks - 5, eastereggMessages.length - 1)]}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Button
            variant="hero"
            size="lg"
            className="animate-pulse-glow"
            onClick={() => navigate("/")}
          >
            <Home className="w-4 h-4 mr-2" />
            Take Me Home
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setClicks((c) => c + 1);
              navigate(0); // Reload current page
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again (Spoiler: Same Result)
          </Button>
        </div>

        {/* Fun footer note */}
        <p className="text-xs text-muted-foreground/40 pt-4">
          Hosted with ❤️ by AWS User Group Pune • No EC2 instances were harmed
        </p>
      </div>

      {/* Inline keyframes for fade-in */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
