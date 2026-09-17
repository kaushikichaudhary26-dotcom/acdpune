import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Users, ChevronDown, Mic, BookOpen, Wrench, Download } from "lucide-react";
import agendaPDF from "@/assets/ACD Pune 2026-Agenda - Agenda.pdf";

/* ─── Types ─────────────────────────────────────────────── */
type SessionType = "plenary" | "session" | "workshop" | "break" | "special";

interface Speaker {
  name: string;
}

interface AgendaItem {
  id: string;
  time: string;
  duration?: string;
  title: string;
  speakers?: Speaker[];
  type: SessionType;
  track?: "track1" | "track2" | "track3";
  venue?: string;
  isSpanContinuation?: boolean;
}

/* ─── Data ───────────────────────────────────────────────── */
const plenaryItems: AgendaItem[] = [
  {
    id: "reg",
    time: "08:00 AM – 9:30 AM",
    title: "Registration & Breakfast",
    type: "break",
  },
  {
    id: "inaug",
    time: "9:30 AM – 9:45 AM",
    title: "Inauguration & Welcome Note",
    speakers: [{ name: "Toshal Khawale" }],
    type: "plenary",
  },
  {
    id: "s1",
    time: "9:45 AM – 10:05 AM",
    duration: "20 mins",
    title: "Innovation in AI Age",
    speakers: [{ name: "Akash Sureka" }],
    type: "plenary",
  },
  {
    id: "momento",
    time: "10:05 AM – 10:10 AM",
    title: "Momento Inauguration",
    type: "special",
  },
  {
    id: "s2",
    time: "10:10 AM – 10:30 AM",
    duration: "20 mins",
    title: "Transforming How we build S/w – AI Driven Development, and Role of Autonomous Agents",
    speakers: [{ name: "Sudhanshu Hate" }],
    type: "plenary",
  },
  {
    id: "s3",
    time: "10:30 AM – 10:55 AM",
    duration: "25 mins",
    title: "Why Choose Kubernetes (EKS) for Generative and Agentic AI Workloads",
    speakers: [{ name: "Mayur Bhagia" }],
    type: "plenary",
  },
  {
    id: "s4",
    time: "10:55 AM – 11:20 AM",
    duration: "25 mins",
    title: "Zero-X Cloud: New age Cloud and Code Security",
    speakers: [{ name: "Harshal Pendse" }],
    type: "plenary",
  },
  {
    id: "panel",
    time: "11:25 AM – 12:10 PM",
    duration: "45 mins",
    title: "Panel Discussion – Future of Work: AI, Skills, and the Evolution of Education",
    speakers: [
      { name: "Dr. Sunita M Karad" },
      { name: "Priyanka Singh Solanki" },
      { name: "Savinder Puri" },
      { name: "Rahul Sureka" },
    ],
    type: "plenary",
  },
  {
    id: "felicitation",
    time: "12:10 PM – 12:25 PM",
    title: "Venue Partner Felicitations",
    type: "special",
  },
  {
    id: "lunch",
    time: "12:25 PM – 1:10 PM",
    title: "Lunch Break",
    type: "break",
  },
];

const trackSessions: {
  slot: string;
  slotLabel: string;
  track1?: AgendaItem;
  track2?: AgendaItem;
  track3?: AgendaItem;
}[] = [
  {
    slot: "1:10–1:35",
    slotLabel: "1:10 PM – 1:35 PM",
    track1: {
      id: "t1s1",
      time: "1:10 PM – 1:35 PM",
      duration: "25 mins",
      title: "PostgreSQL for the AI Era: Vector Search, RAG, and the Need for Scale",
      speakers: [{ name: "Amol Bhoite" }],
      type: "session",
      track: "track1",
    },
    track2: {
      id: "t2s1",
      time: "1:10 PM – 1:35 PM",
      duration: "25 mins",
      title: "Scaling the Context Engine: Deploying Elastic's MCP Server on Amazon Bedrock",
      speakers: [{ name: "Someshwaran M Kumar" }],
      type: "session",
      track: "track2",
    },
    track3: {
      id: "t3w1",
      time: "1:10 PM – 2:05 PM",
      duration: "55 mins",
      title: "Diving Deep into Bedrock AgentCore",
      speakers: [{ name: "Bhaskar Pathak" }, { name: "Pratul Mathur" }],
      type: "workshop",
      track: "track3",
    },
  },
  {
    slot: "1:40–2:05",
    slotLabel: "1:40 PM – 2:05 PM",
    track1: {
      id: "t1s2",
      time: "1:40 PM – 2:05 PM",
      duration: "25 mins",
      title: "From Demo to Deployment: Solving Agentic AI's Toughest Challenges",
      speakers: [{ name: "Kunal Sarpatil" }, { name: "Rajat Chauhan" }],
      type: "session",
      track: "track1",
    },
    track2: {
      id: "t2s2",
      time: "1:40 PM – 2:05 PM",
      duration: "25 mins",
      title: "AI Agents for Self-Healing DevSecOps Pipelines",
      speakers: [{ name: "Nensi Ravaliya" }, { name: "Yatharth Chauhan" }],
      type: "session",
      track: "track2",
    },
    track3: {
      id: "t3w1",
      time: "1:10 PM – 2:05 PM",
      duration: "55 mins",
      title: "Diving Deep into Bedrock AgentCore",
      speakers: [{ name: "Bhaskar Pathak" }, { name: "Pratul Mathur" }],
      type: "workshop",
      track: "track3",
      isSpanContinuation: true,
    },
  },
  {
    slot: "2:10–2:35",
    slotLabel: "2:10 PM – 2:35 PM",
    track1: {
      id: "t1s3",
      time: "2:10 PM – 2:35 PM",
      duration: "25 mins",
      title: "Deploying Production-Ready AI Agents with Amazon Bedrock AgentCore",
      speakers: [{ name: "Ishwar Chauthaiwale" }, { name: "Sachin Khanna" }],
      type: "session",
      track: "track1",
    },
    track2: {
      id: "t2s3",
      time: "2:10 PM – 2:35 PM",
      duration: "25 mins",
      title: "Maintaining Security Using AWS MCP Server",
      speakers: [{ name: "Farhaan Meer Nazar Hussain" }],
      type: "session",
      track: "track2",
    },
    track3: {
      id: "t3w2",
      time: "2:10 PM – 3:05 PM",
      duration: "55 mins",
      title: "End-to-End GitHub Actions + AWS DevSecOps Pipeline Project",
      speakers: [{ name: "Aditya Jaiswal" }],
      type: "workshop",
      track: "track3",
    },
  },
  {
    slot: "2:40–3:05",
    slotLabel: "2:40 PM – 3:05 PM",
    track1: {
      id: "t1s4",
      time: "2:40 PM – 3:05 PM",
      duration: "25 mins",
      title: "Scaling Custom LLMs on EKS: Trainium and Inferentia2-Powered AI Infrastructure",
      speakers: [{ name: "Adit Modi" }],
      type: "session",
      track: "track1",
    },
    track2: {
      id: "t2s4",
      time: "2:40 PM – 3:05 PM",
      duration: "25 mins",
      title: "Open Tables, Shared Truth: Architecting a Multi-Engine Lakehouse using Redshift and Iceberg",
      speakers: [{ name: "Kushal Nagrani" }],
      type: "session",
      track: "track2",
    },
    track3: {
      id: "t3w2",
      time: "2:10 PM – 3:05 PM",
      duration: "55 mins",
      title: "End-to-End GitHub Actions + AWS DevSecOps Pipeline Project",
      speakers: [{ name: "Aditya Jaiswal" }],
      type: "workshop",
      track: "track3",
      isSpanContinuation: true,
    },
  },
  {
    slot: "3:10–3:35",
    slotLabel: "3:10 PM – 3:35 PM",
    track1: {
      id: "t1s5",
      time: "3:10 PM – 3:35 PM",
      duration: "25 mins",
      title: "Code of the Ancients: Building the 'Ram Setu' of Modern Cloud Infrastructure",
      speakers: [{ name: "Gourav Sharma" }],
      type: "session",
      track: "track1",
    },
    track2: {
      id: "t2s5",
      time: "3:10 PM – 3:35 PM",
      duration: "25 mins",
      title: "The Rise of AI Builders: Opportunities for Developers in the GenAI Era",
      speakers: [{ name: "Rahul Gurjar" }],
      type: "session",
      track: "track2",
    },
    track3: {
      id: "t3w3",
      time: "3:10 PM – 4:05 PM",
      duration: "55 mins",
      title: "Building Durable AI Agents with AWS Strands, MCP, and Temporal",
      speakers: [{ name: "Shubham Londhe" }],
      type: "workshop",
      track: "track3",
    },
  },
  {
    slot: "3:40–4:05",
    slotLabel: "3:40 PM – 4:05 PM",
    track1: {
      id: "t1s6",
      time: "3:40 PM – 4:05 PM",
      duration: "25 mins",
      title: "Without Context Engineering, Your Best Models are Useless in Prod",
      speakers: [{ name: "Shiv Pratap Singh" }],
      type: "session",
      track: "track1",
    },
    track2: {
      id: "t2s6",
      time: "3:40 PM – 4:05 PM",
      duration: "25 mins",
      title: "Before Code Meets The Cloud!",
      speakers: [{ name: "Shrikant Dhanawade" }],
      type: "session",
      track: "track2",
    },
    track3: {
      id: "t3w3",
      time: "3:10 PM – 4:05 PM",
      duration: "55 mins",
      title: "Building Durable AI Agents with AWS Strands, MCP, and Temporal",
      speakers: [{ name: "Shubham Londhe" }],
      type: "workshop",
      track: "track3",
      isSpanContinuation: true,
    },
  },
  {
    slot: "4:10–4:35",
    slotLabel: "4:10 PM – 4:35 PM",
    track1: {
      id: "t1s7",
      time: "4:10 PM – 4:35 PM",
      duration: "25 mins",
      title: "Terraform Beyond Provisioning: Automating AWS Day-2 Operations",
      speakers: [{ name: "Dr. Rahul Gaikwad" }, { name: "Siddharth Bharate" }],
      type: "session",
      track: "track1",
    },
    track2: {
      id: "t2s7",
      time: "4:10 PM – 4:35 PM",
      duration: "25 mins",
      title: "From Data to Narrative: Leveraging Amazon Bedrock for Intelligent Business Report Automation",
      speakers: [{ name: "Poonam Pratik Patel" }],
      type: "session",
      track: "track2",
    },
    track3: {
      id: "t3s4",
      time: "4:10 PM – 4:30 PM",
      duration: "20 mins",
      title: "The Hidden Cost of Code Complexity — and How to Fix It",
      speakers: [{ name: "Rushabh Sudame" }],
      type: "session",
      track: "track3",
    },
  },
];

const closingItems: AgendaItem[] = [
  { id: "tea", time: "4:35 PM – 4:55 PM", title: "Tea Break", type: "break" },
  {
    id: "quiz",
    time: "4:55 PM – 5:15 PM",
    duration: "20 mins",
    title: "Closing Quiz",
    venue: "Mimosa Hall",
    type: "special",
  },
  { id: "rezoomex", time: "5:15 PM – 5:20 PM", title: "Rezoomex Team Address", type: "special" },
  { id: "closing", time: "5:20 PM – 5:30 PM", title: "Event Closing Note", type: "special" },
  { id: "goodies", time: "5:30 PM – 5:45 PM", title: "Goodies Distribution 🎁", type: "special" },
];

/* ─── Helpers ────────────────────────────────────────────── */
const typeStyles: Record<SessionType, string> = {
  plenary: "bg-primary/10 border-l-4 border-primary",
  session: "bg-card border border-border hover:border-primary/40 transition-colors",
  workshop: "bg-accent/8 border-l-4 border-accent",
  break: "bg-muted/60 border border-dashed border-border",
  special: "bg-secondary border border-border",
};

const typeBadge: Record<SessionType, { label: string; color: string }> = {
  plenary: { label: "Plenary", color: "bg-primary/15 text-primary" },
  session: { label: "Session", color: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  workshop: { label: "Workshop", color: "bg-accent/20 text-accent" },
  break: { label: "Break", color: "bg-muted text-muted-foreground" },
  special: { label: "Special", color: "bg-secondary text-secondary-foreground" },
};

const trackConfig = {
  track1: {
    label: "Track 1",
    venue: "Mimosa Hall",
    color: "bg-primary text-primary-foreground",
    headerBg: "bg-primary/10",
    accent: "text-primary",
  },
  track2: {
    label: "Track 2",
    venue: "Goldenrod",
    color: "bg-blue-600 text-white",
    headerBg: "bg-blue-500/10",
    accent: "text-blue-600 dark:text-blue-400",
  },
  track3: {
    label: "Track 3",
    venue: "Magnolia",
    color: "bg-accent text-accent-foreground",
    headerBg: "bg-accent/10",
    accent: "text-accent",
  },
};

/* ─── Sub-components ─────────────────────────────────────── */
function SessionCard({ item, compact = false, spanRows = 1 }: { item: AgendaItem; compact?: boolean; spanRows?: number }) {
  const [expanded, setExpanded] = useState(false);
  const badge = typeBadge[item.type];
  const TypeIcon = item.type === "workshop" ? Wrench : item.type === "plenary" ? Mic : BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-4 ${typeStyles[item.type]} cursor-pointer select-none ${spanRows > 1 ? "h-full flex flex-col justify-center" : ""}`}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
              <TypeIcon className="w-2.5 h-2.5" />
              {badge.label}
            </span>
            {item.duration && (
              <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" /> {item.duration}
              </span>
            )}
            {item.venue && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" /> {item.venue}
              </span>
            )}
          </div>
          <p className={`font-semibold leading-snug text-foreground ${compact ? "text-sm" : "text-sm md:text-base"}`}>
            {item.title}
          </p>
          {item.speakers && item.speakers.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.speakers.map((s) => (
                <span
                  key={s.name}
                  className="inline-flex items-center gap-1 text-base font-medium text-muted-foreground bg-background/60 px-2 py-0.5 rounded-full border border-border/50"
                >
                  <Users className="w-2.5 h-2.5" />
                  {s.name}
                </span>
              ))}
            </div>
          )}
        </div>
        {item.speakers && item.speakers.length > 1 && (
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 mt-1"
          >
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function PlenaryRow({ item }: { item: AgendaItem }) {
  const isBreak = item.type === "break";
  const isPanel = item.id === "panel";

  if (isBreak) {
    return (
      <div className="grid grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] gap-0 border-b border-dashed border-border/60">
        <div className="py-3 px-4 text-xs font-medium text-muted-foreground flex items-center gap-1.5 border-r border-dashed border-border/60">
          <Clock className="w-3 h-3" />
          {item.time}
        </div>
        <div className="py-3 px-4 text-sm font-semibold text-muted-foreground italic">{item.title}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] gap-0 border-b border-border/60 group hover:bg-primary/[0.02] transition-colors">
      <div className="py-4 px-4 border-r border-border/60">
        <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-primary" />
          {item.time}
        </p>
        {item.duration && (
          <p className="text-[10px] text-muted-foreground/70 mt-0.5 pl-4">{item.duration}</p>
        )}
      </div>
      <div className="py-4 px-4">
        <p className={`font-semibold text-foreground leading-snug ${isPanel ? "text-base" : "text-sm"}`}>
          {item.title}
        </p>
        {item.speakers && item.speakers.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.speakers.map((s) => (
              <span
                key={s.name}
                className="inline-flex items-center gap-1 text-base text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-full border border-border/40"
              >
                <Users className="w-3 h-3" />
                {s.name}
              </span>
            ))}
          </div>
        )}
        {item.type === "special" && item.venue && (
          <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {item.venue}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function AgendaSection() {
  const [activeView, setActiveView] = useState<"all" | "track1" | "track2" | "track3">("all");

  return (
    <section id="agenda" className="section-padding bg-background">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary mb-3 px-3 py-1 rounded-full bg-primary/10">
            ACD Pune 2026
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Event{" "}
            <span className="gradient-text">Agenda</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-base">
            A full day of talks, workshops, and panels across three parallel tracks.
          </p>
          <a
            href={agendaPDF}
            download="ACD_Pune_2026_Agenda.pdf"
            className="group relative mt-6 inline-flex items-center gap-2 px-10 py-4 rounded-[14px] font-semibold text-lg text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(179,83,249,0.3)]"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A59] via-[#B353F9] to-[#FF7A59] bg-[length:200%_100%] animate-[gradient_3s_ease_infinite]" />
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="relative z-10 flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download Agenda
            </span>
          </a>
        </motion.div>

        {/* ── Morning Plenary ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 rounded-2xl overflow-hidden border border-border shadow-premium"
        >
          {/* Table header */}
          <div className="bg-primary px-6 py-4 flex items-center gap-3">
            <Mic className="w-5 h-5 text-primary-foreground" />
            <h3 className="text-lg font-display font-bold text-primary-foreground">Morning Plenary</h3>
            <span className="ml-auto text-primary-foreground/70 text-sm">All attendees · Mimosa Hall</span>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] bg-muted/50 border-b border-border">
            <div className="py-2.5 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wide border-r border-border">
              Time
            </div>
            <div className="py-2.5 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Session / Speaker
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y-0">
            {plenaryItems.map((item) => (
              <PlenaryRow key={item.id} item={item} />
            ))}
          </div>
        </motion.div>

        {/* ── Track Filter ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 flex flex-wrap gap-2 items-center"
        >
          <span className="text-sm font-semibold text-muted-foreground mr-2">Filter:</span>
          {(["all", "track1", "track2", "track3"] as const).map((v) => {
            const cfg = v === "all" ? null : trackConfig[v];
            return (
              <button
                key={v}
                onClick={() => setActiveView(v)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  activeView === v
                    ? v === "all"
                      ? "bg-foreground text-background border-foreground"
                      : `${cfg!.color} border-transparent`
                    : "bg-background text-muted-foreground border-border hover:border-primary/40"
                }`}
              >
                {v === "all" ? "All Tracks" : `${cfg!.label} – ${cfg!.venue}`}
              </button>
            );
          })}
        </motion.div>

        {/* ── Parallel Tracks Table ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10 rounded-2xl overflow-hidden border border-border shadow-premium"
        >
          {/* Track header row */}
          <div className="grid grid-cols-[140px_1fr]">
            <div className="bg-muted/80 border-r border-b border-border" />
            <div
              className={`grid ${
                activeView === "all"
                  ? "grid-cols-3"
                  : "grid-cols-1"
              } divide-x divide-border border-b border-border`}
            >
              {(["track1", "track2", "track3"] as const)
                .filter((t) => activeView === "all" || activeView === t)
                .map((t) => {
                  const cfg = trackConfig[t];
                  return (
                    <div key={t} className={`py-4 px-4 ${cfg.headerBg}`}>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${cfg.color} mb-1.5`}>
                        <MapPin className="w-3 h-3" />
                        {cfg.label}
                      </div>
                      <p className="text-sm font-semibold text-foreground">{cfg.venue}</p>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Session rows — single CSS grid so workshops can row-span */}
          {(() => {
            const tracksToShow = (["track1", "track2", "track3"] as const).filter(
              (t) => activeView === "all" || activeView === t
            );
            const numTracks = tracksToShow.length;
            const totalRows = trackSessions.length;

            // Build grid: col 0 = time, cols 1..N = tracks
            // Each slot is one grid row; spanning items get rowSpan 2 and continuations are skipped
            return (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `140px repeat(${numTracks}, 1fr)`,
                  gridTemplateRows: `repeat(${totalRows}, auto)`,
                }}
              >
                {trackSessions.map((slot, rowIdx) => {
                  const isLast = rowIdx === totalRows - 1;
                  const borderB = isLast ? "" : "border-b border-border/60";

                  return [
                    /* ── Time cell ── */
                    <div
                      key={`time-${slot.slot}`}
                      style={{ gridRow: rowIdx + 1, gridColumn: 1 }}
                      className={`py-4 px-3 border-r border-border/60 bg-muted/20 flex items-center ${borderB}`}
                    >
                      <p className="text-xs font-bold text-foreground">{slot.slotLabel}</p>
                    </div>,

                    /* ── Track cells ── */
                    ...tracksToShow.map((t, colIdx) => {
                      const item = slot[t];
                      const gridCol = colIdx + 2; // col 1 is time
                      const dividerLeft = colIdx > 0 ? "border-l border-border/60" : "";

                      // Skip — the spanning card above already covers this cell
                      if (item?.isSpanContinuation) return null;

                      // Spanning workshop: occupies this row + next
                      const rowSpan = item && !item.isSpanContinuation &&
                        trackSessions[rowIdx + 1]?.[t]?.isSpanContinuation
                        ? 2
                        : 1;

                      // For spanning cells, suppress the bottom border on the first row
                      const cellBorder = rowSpan === 2 ? "" : borderB;

                      return (
                        <motion.div
                          key={`${t}-${slot.slot}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: rowIdx * 0.04 }}
                          style={{ gridRow: `${rowIdx + 1} / span ${rowSpan}`, gridColumn: gridCol }}
                          className={`p-3 ${dividerLeft} ${cellBorder}`}
                        >
                          {item ? (
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full"
                              >
                                <SessionCard item={item} compact spanRows={rowSpan} />
                              </motion.div>
                            </AnimatePresence>
                          ) : null}
                        </motion.div>
                      );
                    }),
                  ];
                })}
              </div>
            );
          })()}
        </motion.div>

        {/* ── Closing Plenary ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl overflow-hidden border border-border shadow-premium"
        >
          <div className="bg-gradient-to-r from-accent to-primary px-6 py-4 flex items-center gap-3">
            <h3 className="text-lg font-display font-bold text-white">Closing</h3>
            <span className="ml-auto text-white/70 text-sm">All attendees · Mimosa Hall</span>
          </div>

          <div className="grid grid-cols-[160px_1fr] md:grid-cols-[200px_1fr] bg-muted/50 border-b border-border">
            <div className="py-2.5 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wide border-r border-border">
              Time
            </div>
            <div className="py-2.5 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wide">
              Activity
            </div>
          </div>

          <div className="divide-y-0">
            {closingItems.map((item) => (
              <PlenaryRow key={item.id} item={item} />
            ))}
          </div>
        </motion.div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          {(Object.entries(typeBadge) as [SessionType, { label: string; color: string }][]).map(
            ([type, { label, color }]) => (
              <span key={type} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${color}`}>
                {label}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}