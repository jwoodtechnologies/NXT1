/**
 * NXT1 — Landing (Phase 17 — Full premium rebuild)
 *
 * Ground-up rewrite. No imported showcase/demo/flow components (eliminated
 * duplicates). Every section scroll-reveals with spring easing. Stats count
 * up on enter. Prompt cockpit is deep dark AI terminal. Header is glassmorphic
 * on scroll. Infinite agent marquee. US flag in footer.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight, Sparkles, Layers, Globe, Smartphone, Puzzle,
  Zap, Lock, Eye, Cpu, ChevronRight, Menu, X,
} from "lucide-react";
import Brand from "@/components/Brand";
import GradientBackdrop from "@/components/GradientBackdrop";
import ModelPickerCockpit from "@/components/premium/ModelPickerCockpit";
import { ProviderLogo } from "@/components/premium/ProviderLogos";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import { useTheme } from "@/components/theme/ThemeProvider";
import { isAuthenticated } from "@/lib/auth";

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════ */

const MODES = [
  { key: "fullstack", label: "Full Stack", icon: Layers     },
  { key: "website",   label: "Website",    icon: Globe      },
  { key: "mobile",    label: "Mobile",     icon: Smartphone },
  { key: "extension", label: "Extension",  icon: Puzzle     },
];

const MODE_SUGGESTIONS = {
  fullstack: [
    { label: "SaaS dashboard",   prompt: "Build a SaaS dashboard with authentication, billing, and an admin panel." },
    { label: "AI platform",      prompt: "Build an AI platform with prompt history, a model picker, and team sharing." },
    { label: "Admin system",     prompt: "Build an internal admin system with role-based access and audit logs." },
  ],
  website: [
    { label: "Portfolio",        prompt: "Design a premium developer portfolio with hero, projects, and contact form." },
    { label: "Marketing launch", prompt: "Build a marketing launch page with waitlist signup and feature grid." },
    { label: "Docs site",        prompt: "Build a modern documentation site with sidebar nav and code samples." },
  ],
  mobile: [
    { label: "Fitness tracker",  prompt: "Build a mobile fitness app with workout tracking and progress charts." },
    { label: "AI chat app",      prompt: "Build a mobile AI chat companion with streaming responses." },
    { label: "Social app",       prompt: "Build a mobile social app with feed, profiles, and messaging." },
  ],
  extension: [
    { label: "Productivity",     prompt: "Build a Chrome productivity extension that summarises any open tab." },
    { label: "AI sidebar",       prompt: "Build a Chrome AI sidebar that answers questions about the current page." },
    { label: "Tab manager",      prompt: "Build a Chrome tab manager with groups, search, and snooze." },
  ],
};

const PLACEHOLDER_CYCLE = [
  "Build a modern SaaS dashboard with billing…",
  "Create an AI mobile app for journaling…",
  "Design a portfolio with smooth animations…",
  "Ship a realtime collaborative todo app…",
  "Spin up a marketing site for a launch…",
  "Build an internal admin for a small team…",
];

const ALL_AGENTS = [
  "backend-architect", "security-auditor", "frontend-developer", "test-automator",
  "devops-troubleshooter", "code-reviewer", "product-manager", "ui-designer",
  "data-analyst", "api-builder", "cloud-architect", "ml-engineer",
  "performance-optimizer", "docs-writer", "database-admin",
  "github", "notion", "imessage", "whisper", "apple-notes",
  "stripe-integrator", "auth-builder", "websocket-expert", "mobile-developer",
];

const SHIP_ITEMS = [
  { label: "MVPs",             icon: Zap,         color: "#5EEAD4" },
  { label: "SaaS Platforms",   icon: Layers,      color: "#6366F1" },
  { label: "Marketing Sites",  icon: Globe,       color: "#F59E0B" },
  { label: "AI Dashboards",    icon: Cpu,         color: "#EC4899" },
  { label: "Internal Tools",   icon: Lock,        color: "#34D399" },
  { label: "Mobile Apps",      icon: Smartphone,  color: "#60A5FA" },
  { label: "AI Workflows",     icon: Sparkles,    color: "#A78BFA" },
  { label: "Custom Software",  icon: Eye,         color: "#FB923C" },
];

const PROVIDERS = [
  { key: "anthropic", label: "Claude",   tile: "#FAF9F5", invert: false },
  { key: "openai",    label: "GPT-4",    tile: "#202021", invert: true  },
  { key: "gemini",    label: "Gemini",   tile: "#FFFFFF", invert: false },
  { key: "grok",      label: "Grok",     tile: "#0F0F10", invert: true  },
  { key: "deepseek",  label: "DeepSeek", tile: "#FFFFFF", invert: false },
];

/* ═══════════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════════ */

function useTypedPlaceholder(cycle, { isPaused }) {
  const [text, setText] = useState("");
  const s = useRef({ i: 0, phase: "typing", cursor: 0 });
  useEffect(() => {
    if (isPaused) return;
    let alive = true;
    const tick = () => {
      if (!alive) return;
      const st = s.current;
      const tgt = cycle[st.i % cycle.length];
      if (st.phase === "typing") {
        if (st.cursor < tgt.length) { st.cursor++; setText(tgt.slice(0, st.cursor)); timer = setTimeout(tick, 26 + Math.random() * 28); }
        else { st.phase = "hold"; timer = setTimeout(tick, 1800); }
      } else if (st.phase === "hold") {
        st.phase = "erasing"; timer = setTimeout(tick, 20);
      } else {
        if (st.cursor > 0) { st.cursor--; setText(tgt.slice(0, st.cursor)); timer = setTimeout(tick, 13); }
        else { st.i++; st.phase = "typing"; timer = setTimeout(tick, 240); }
      }
    };
    let timer = setTimeout(tick, 700);
    return () => { alive = false; clearTimeout(timer); };
  }, [cycle, isPaused]);
  return text;
}

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCounter(target, duration = 1400, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let cur = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      setVal(Math.floor(cur));
      if (cur >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [target, duration, active]);
  return val;
}

/* ═══════════════════════════════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════════════════════════════ */

const spring = "cubic-bezier(0.16,1,0.3,1)";

function Reveal({ children, delay = 0, from = "bottom", className = "", style = {} }) {
  const [ref, visible] = useReveal();
  const transforms = {
    bottom: "translateY(36px)",
    left:   "translateX(-36px)",
    right:  "translateX(36px)",
    scale:  "scale(0.94) translateY(20px)",
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "none" : transforms[from],
        transition: `opacity 0.75s ${spring} ${delay}ms, transform 0.75s ${spring} ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const PARTICLE_DATA = [
  { size: 3, x: "10%",  y: "18%", d: "0s",   t: "9s"  },
  { size: 2, x: "84%",  y: "12%", d: "2.1s", t: "11s" },
  { size: 4, x: "62%",  y: "72%", d: "4.3s", t: "8s"  },
  { size: 2, x: "35%",  y: "56%", d: "1.0s", t: "10s" },
  { size: 3, x: "92%",  y: "44%", d: "3.7s", t: "12s" },
  { size: 2, x: "21%",  y: "80%", d: "5.4s", t: "9s"  },
  { size: 3, x: "57%",  y: "28%", d: "0.6s", t: "13s" },
  { size: 2, x: "75%",  y: "88%", d: "6.2s", t: "10s" },
];

function FloatingParticles({ isLight }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {PARTICLE_DATA.map((p, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: p.size, height: p.size, left: p.x, top: p.y,
          background: isLight ? "rgba(20,130,110,0.6)" : "rgba(94,234,212,0.7)",
          boxShadow: isLight ? `0 0 ${p.size*5}px rgba(20,130,110,0.5)` : `0 0 ${p.size*5}px rgba(94,234,212,0.6)`,
          animation: `nxt-particle-float ${p.t} ease-in-out ${p.d} infinite`,
        }} />
      ))}
    </div>
  );
}

function USFlag() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden style={{ borderRadius: 2, display: "inline-block", flexShrink: 0 }}>
      <rect width="18" height="12" fill="#B22234" />
      <rect y="1.7"  width="18" height="1.7" fill="#fff" />
      <rect y="5.1"  width="18" height="1.7" fill="#fff" />
      <rect y="8.5"  width="18" height="1.7" fill="#fff" />
      <rect width="7.4" height="6.8" fill="#3C3B6E" />
      <circle cx="1.8" cy="1.7" r="0.4" fill="#fff" />
      <circle cx="3.6" cy="1.7" r="0.4" fill="#fff" />
      <circle cx="5.4" cy="1.7" r="0.4" fill="#fff" />
      <circle cx="2.7" cy="3.4" r="0.4" fill="#fff" />
      <circle cx="4.5" cy="3.4" r="0.4" fill="#fff" />
      <circle cx="1.8" cy="5.1" r="0.4" fill="#fff" />
      <circle cx="3.6" cy="5.1" r="0.4" fill="#fff" />
      <circle cx="5.4" cy="5.1" r="0.4" fill="#fff" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  const navigate  = useNavigate();
  const { theme } = useTheme();
  const isLight   = theme === "light";

  const [authed,    setAuthed]    = useState(false);
  const [draft,     setDraft]     = useState("");
  const [mode,      setMode]      = useState("fullstack");
  const [provider,  setProvider]  = useState("anthropic");
  const [scrolled,  setScrolled]  = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const textareaRef = useRef(null);

  const placeholder = useTypedPlaceholder(PLACEHOLDER_CYCLE, { isPaused: !!draft });

  useEffect(() => {
    setAuthed(isAuthenticated());
    try { const s = localStorage.getItem("nxt1_draft_prompt"); if (s) setDraft(s); } catch {}
    setTimeout(() => textareaRef.current?.focus(), 100);
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onDraftChange = (v) => {
    setDraft(v);
    try { localStorage.setItem("nxt1_draft_prompt", v); } catch {}
  };

  const onBuild = useCallback(() => {
    const v = draft.trim();
    if (!v) { textareaRef.current?.focus(); return; }
    try { localStorage.setItem("nxt1_draft_prompt", v); } catch {}
    navigate(`${authed ? "/workspace" : "/signup"}?prompt=${encodeURIComponent(v)}&mode=${mode}&return=/dashboard`);
  }, [draft, mode, authed, navigate]);

  const rainbow = isLight
    ? "linear-gradient(110deg,#0E8C73 0%,#B58320 50%,#C25A1F 100%)"
    : "linear-gradient(110deg,#5EEAD4 0%,#F0D28A 50%,#FF8A3D 100%)";

  const fadedHead = isLight
    ? "linear-gradient(180deg,#1A1A1F 0%,#6A6259 100%)"
    : "linear-gradient(180deg,#FFFFFF 0%,#9A9AA3 100%)";

  /* stats reveal */
  const [statsRef, statsVisible] = useReveal(0.3);
  const agentCount  = useCounter(200, 1200, statsVisible);
  const skillCount  = useCounter(52,  1000, statsVisible);
  const modelCount  = useCounter(5,   600,  statsVisible);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden" style={{ fontFamily: "'Inter',sans-serif", color: "var(--nxt-fg)" }} data-testid="landing-page">
      <GradientBackdrop variant="cinema" intensity="soft" />
      <FloatingParticles isLight={isLight} />

      {/* ════════════════════════════════════════════
          HEADER — glassmorphic on scroll
      ════════════════════════════════════════════ */}
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? isLight ? "rgba(239,233,218,0.82)" : "rgba(27,27,33,0.82)"
            : "transparent",
          backdropFilter:       scrolled ? "blur(20px) saturate(160%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
          borderBottom: scrolled ? `1px solid var(--nxt-border-soft)` : "1px solid transparent",
        }}
      >
        <div className="mx-auto max-w-[1120px] px-5 sm:px-8 h-[62px] flex items-center justify-between gap-4">
          <Brand size="md" gradient />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" data-testid="landing-section-nav">
            {[
              ["#how",    "How it works"],
              ["#agents", "Agents"],
              ["#models", "Models"],
              ["#ship",   "Ship"],
            ].map(([href, label]) => (
              <a key={href} href={href}
                className="text-[13px] px-3 py-1.5 rounded-full transition-colors"
                style={{ color: "var(--nxt-fg-dim)" }}
              >{label}</a>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            <ThemeSwitcher />
            {authed ? (
              <button onClick={() => navigate("/workspace")}
                className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-2 rounded-full transition-all hover:-translate-y-0.5"
                style={{ color: "var(--nxt-fg)" }}
                data-testid="nav-dashboard-button"
              >
                Open workspace <ArrowRight size={12} />
              </button>
            ) : (
              <>
                <button onClick={() => navigate("/signin")}
                  className="hidden sm:block text-[13px] px-3 py-2 transition-colors"
                  style={{ color: "var(--nxt-fg-dim)" }}
                  data-testid="nav-signin-button"
                >Sign in</button>
                <button onClick={() => navigate("/signup")}
                  className="text-[13px] font-semibold px-4 py-2 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={isLight
                    ? { background:"#1F1F23", color:"#FAFAFA", boxShadow:"0 4px 14px -6px rgba(31,31,35,0.40)" }
                    : { background:"rgba(255,255,255,0.10)", border:"1px solid rgba(255,255,255,0.14)", color:"#FAFAFA" }}
                  data-testid="nav-signup-button"
                >Request access</button>
              </>
            )}
            {/* Mobile menu toggle */}
            <button className="md:hidden ml-1 p-2 rounded-lg" onClick={() => setMobileNav(v => !v)}
              style={{ color: "var(--nxt-fg-dim)" }}>
              {mobileNav ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileNav && (
          <div className="md:hidden px-5 pb-4 pt-2 flex flex-col gap-1"
            style={{ background: isLight ? "rgba(239,233,218,0.97)" : "rgba(22,22,28,0.97)", borderBottom: "1px solid var(--nxt-border-soft)" }}>
            {[["#how","How it works"],["#agents","Agents"],["#models","Models"],["#ship","What you ship"]].map(([h,l]) => (
              <a key={h} href={h} onClick={() => setMobileNav(false)}
                className="px-3 py-2.5 rounded-xl text-[14px]"
                style={{ color: "var(--nxt-fg-dim)" }}>{l}</a>
            ))}
            <div className="mt-2 flex gap-2">
              <button onClick={() => navigate("/signin")} className="flex-1 py-2.5 rounded-xl text-[13px] text-center" style={{ color:"var(--nxt-fg-dim)", border:"1px solid var(--nxt-border)" }}>Sign in</button>
              <button onClick={() => navigate("/signup")} className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-center" style={{ background:"#1F1F23", color:"#FAFAFA" }}>Request access</button>
            </div>
          </div>
        )}
      </header>

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <main className="relative z-10 pt-[108px] sm:pt-[120px] pb-20 px-5 sm:px-8 mx-auto max-w-[880px]">

        {/* Exclusive badge */}
        <div className="flex justify-center mb-7">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full"
            style={{
              background: isLight ? "rgba(20,130,110,0.07)" : "rgba(94,234,212,0.06)",
              border: `1px solid ${isLight ? "rgba(20,130,110,0.20)" : "rgba(94,234,212,0.16)"}`,
            }}>
            <span className="w-1.5 h-1.5 rounded-full nxt-pulse flex-shrink-0" style={{ background:"#34D399" }} />
            <span className="mono text-[9.5px] sm:text-[10.5px] tracking-[0.40em] uppercase font-medium"
              style={{ color: isLight ? "#0E8C73" : "#5EEAD4" }}>
              Exclusive Access · Made in the USA
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="text-[54px] sm:text-[82px] lg:text-[104px] font-black leading-[0.91] tracking-[-0.045em] text-center mb-4 sm:mb-5"
          style={{ fontFamily:"'Cabinet Grotesk',sans-serif" }}
        >
          <span className="block" style={{ color:"var(--nxt-fg)" }}>Build software.</span>
          <span className="block" style={{ background: rainbow, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            Ship it.
          </span>
        </h1>

        {/* Tagline */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 mb-5" data-testid="brand-triplet">
          <span className="h-px flex-1 max-w-[60px] sm:max-w-[90px]" style={{ background:"var(--nxt-border-strong)" }} />
          <span className="mono text-[10px] sm:text-[11px] tracking-[0.44em] uppercase font-semibold bg-clip-text text-transparent whitespace-nowrap"
            style={{ backgroundImage: rainbow }}>
            DISCOVER · DEVELOP · DELIVER
          </span>
          <span className="h-px flex-1 max-w-[60px] sm:max-w-[90px]" style={{ background:"var(--nxt-border-strong)" }} />
        </div>

        {/* Subtitle */}
        <p className="text-center text-[14.5px] sm:text-[16.5px] max-w-[520px] mx-auto mb-10 sm:mb-12 leading-relaxed"
          style={{ color:"var(--nxt-fg-dim)" }}>
          The private AI platform for founders. Describe what you want to build — and watch it become real, shippable software.
        </p>

        {/* ── PROMPT COCKPIT ── */}
        <div className="relative group mx-auto max-w-[800px]" data-testid="landing-prompt-cockpit">

          {/* Rotating gradient glow ring (visible on focus) */}
          <div aria-hidden className="absolute -inset-[2px] rounded-[30px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 rounded-[30px]"
              style={{
                background: "conic-gradient(from 0deg, #5EEAD4, #6366F1, #F59E0B, #EC4899, #5EEAD4)",
                animation: "nxt-border-spin 3s linear infinite",
              }} />
            <div className="absolute inset-[2px] rounded-[28px]" style={{ background:"#1F1F23" }} />
          </div>

          {/* Ambient glow cloud */}
          <div aria-hidden className="absolute -inset-x-16 -inset-y-10 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background: "radial-gradient(70% 70% at 50% 100%,rgba(94,234,212,0.22) 0%,transparent 70%),radial-gradient(50% 50% at 50% 0%,rgba(99,102,241,0.14) 0%,transparent 70%)",
            }} />

          {/* Main panel */}
          <div className="relative rounded-[28px] overflow-hidden"
            style={{
              background: "linear-gradient(180deg,#2A2A32 0%,#1A1A20 100%)",
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 40px 80px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 1px 0 rgba(255,255,255,0.08) inset",
            }}
          >
            {/* Top bar — live indicator */}
            <div className="flex items-center justify-between px-5 pt-3.5 pb-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 nxt-pulse" />
                <span className="mono text-[10px] tracking-[0.28em] uppercase text-white/35">NXT1 Builder</span>
              </div>
              <span className="mono text-[10px] tracking-[0.22em] uppercase text-white/25">AI Ready</span>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              rows={4}
              value={draft}
              onChange={e => onDraftChange(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onBuild(); } }}
              placeholder={placeholder || "Describe what you want to build…"}
              className="w-full bg-transparent outline-none resize-none leading-[1.6] tracking-[-0.005em] px-5 pt-3 pb-2 placeholder:text-white/25 text-white"
              data-testid="landing-prompt-input"
              style={{ fontSize: "16px" }}
            />

            {/* Divider */}
            <div className="mx-5" style={{ height:1, background:"rgba(255,255,255,0.06)" }} />

            {/* Mode tabs */}
            <div className="px-3 py-2.5">
              <div className="grid grid-cols-4 gap-1.5" role="tablist">
                {MODES.map(m => {
                  const Icon = m.icon;
                  const active = mode === m.key;
                  return (
                    <button key={m.key} type="button" onClick={() => setMode(m.key)}
                      role="tab" aria-selected={active}
                      data-testid={`landing-mode-${m.key}`}
                      className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-2xl transition-all duration-200"
                      style={active
                        ? { background:"linear-gradient(180deg,rgba(94,234,212,0.20) 0%,rgba(94,234,212,0.06) 100%)", boxShadow:"inset 0 0 0 1px rgba(94,234,212,0.38),0 6px 18px -8px rgba(94,234,212,0.35)" }
                        : { background:"rgba(255,255,255,0.03)", boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.06)" }}
                    >
                      <Icon size={14} strokeWidth={1.8} style={{ color: active ? "#5EEAD4" : "rgba(255,255,255,0.55)" }} />
                      <span className="text-[10.5px] sm:text-[11.5px] font-medium tracking-tight whitespace-nowrap"
                        style={{ color: active ? "#fff" : "rgba(255,255,255,0.55)" }}>
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action row */}
            <div className="flex items-center gap-2 px-3 pb-3.5">
              <div className="flex-1 min-w-0">
                <ModelPickerCockpit value={provider} onChange={setProvider} providers={{ emergent:true, anthropic:true }} compact />
              </div>
              <button type="button" onClick={onBuild} disabled={!draft.trim()}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13.5px] font-bold tracking-tight shrink-0 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{
                  background:"linear-gradient(135deg,#FAFAFA 0%,#D8D8D8 100%)",
                  color:"#0A0A0F",
                  boxShadow:"0 8px 24px -8px rgba(255,255,255,0.50),inset 0 1px 0 rgba(255,255,255,0.70)",
                }}
                data-testid="landing-build-button"
              >
                <Sparkles size={13} />
                Build
              </button>
            </div>
          </div>

          {/* Hint */}
          <p className="mt-3.5 text-center mono text-[9.5px] tracking-[0.26em] uppercase" style={{ color:"var(--nxt-fg-faint)" }}>
            ⌘ + ↵ to build
          </p>

          {/* Suggestion chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5" data-testid="landing-suggestion-chips">
            {(MODE_SUGGESTIONS[mode] || []).map(s => (
              <button key={s.label} type="button"
                onClick={() => { onDraftChange(s.prompt); setTimeout(() => textareaRef.current?.focus(), 30); }}
                className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-[11.5px] transition-all hover:-translate-y-0.5"
                style={{ background:"var(--nxt-chip-bg)", border:"1px solid var(--nxt-chip-border)", color:"var(--nxt-fg-dim)" }}
                data-testid={`landing-suggest-${s.label.toLowerCase().replace(/\s+/g,"-")}`}
              >
                <Sparkles size={9} style={{ color:"var(--nxt-accent)" }} />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* ════════════════════════════════════════════
          STATS — count up on scroll-enter
      ════════════════════════════════════════════ */}
      <section className="relative z-10 py-16 sm:py-20 px-5">
        <div ref={statsRef} className="mx-auto max-w-[860px] grid grid-cols-3 gap-6 sm:gap-10 text-center">
          {[
            { value: agentCount, suffix: "+", label: "AI Agents", desc: "Specialists ready to work" },
            { value: skillCount, suffix: "+", label: "Personal Skills", desc: "GitHub, Notion, iMessage…" },
            { value: modelCount, suffix: " top",  label: "AI Models", desc: "Switch providers in a tap" },
          ].map(({ value, suffix, label, desc }) => (
            <div key={label}
              style={{
                opacity:   statsVisible ? 1 : 0,
                transform: statsVisible ? "none" : "translateY(24px)",
                transition: `opacity 0.7s ${spring}, transform 0.7s ${spring}`,
              }}>
              <div className="text-[36px] sm:text-[52px] font-black tracking-tight leading-none mb-1"
                style={{ fontFamily:"'Cabinet Grotesk',sans-serif", background: rainbow, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                {value}{suffix}
              </div>
              <div className="text-[13px] sm:text-[15px] font-semibold mb-0.5" style={{ color:"var(--nxt-fg)" }}>{label}</div>
              <div className="text-[11.5px] sm:text-[12.5px]" style={{ color:"var(--nxt-fg-faint)" }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          HOW IT WORKS — 3 steps, staggered reveal
      ════════════════════════════════════════════ */}
      <section id="how" className="scroll-mt-20 relative z-10 py-14 sm:py-20 px-5 sm:px-8 mx-auto max-w-[1100px]">
        <Reveal className="text-center mb-10 sm:mb-14">
          <span className="mono text-[10px] tracking-[0.38em] uppercase" style={{ color:"var(--nxt-fg-faint)" }}>HOW IT WORKS</span>
          <h2 className="mt-3 text-[28px] sm:text-[44px] font-bold tracking-[-0.03em]"
            style={{ fontFamily:"'Cabinet Grotesk',sans-serif" }}>
            <span style={{ background: fadedHead, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              From a sentence to shipped.
            </span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {[
            { n:"01", title:"Describe", body:"Type what you want to build — one sentence or a full spec. The AI figures out the rest.", color:"#5EEAD4", icon: Sparkles },
            { n:"02", title:"Generate", body:"Watch code, UI, and logic stream into a complete working app in real time.", color:"#6366F1", icon: Zap },
            { n:"03", title:"Ship",     body:"Preview on any device, connect a domain, and deploy to production in one click.", color:"#F59E0B", icon: Layers },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.n} delay={i * 110} from="bottom">
                <div className="rounded-3xl p-6 sm:p-8 h-full relative overflow-hidden group cursor-default"
                  style={{
                    background: isLight ? "linear-gradient(150deg,#FBFAF6,#F0EAD8)" : "linear-gradient(150deg,rgba(44,44,52,0.9),rgba(28,28,34,0.95))",
                    border: `1px solid ${isLight ? "rgba(26,26,31,0.07)" : "rgba(255,255,255,0.07)"}`,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 24px 50px -20px ${s.color}30`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
                >
                  <div aria-hidden className="absolute top-0 right-0 w-28 h-28 pointer-events-none rounded-full" style={{ background:`radial-gradient(circle at 100% 0%,${s.color}18 0%,transparent 70%)` }} />
                  <div className="flex items-center justify-between mb-6">
                    <span className="mono text-[10px] tracking-[0.32em] uppercase" style={{ color:"var(--nxt-fg-faint)" }}>{s.n}</span>
                    <span className="w-10 h-10 rounded-2xl flex items-center justify-center"
                      style={{ background:`${s.color}14`, border:`1px solid ${s.color}28` }}>
                      <Icon size={15} style={{ color: s.color }} />
                    </span>
                  </div>
                  <h3 className="text-[22px] font-bold tracking-tight mb-2" style={{ fontFamily:"'Cabinet Grotesk',sans-serif", color:"var(--nxt-fg)" }}>{s.title}</h3>
                  <p className="text-[13.5px] leading-relaxed" style={{ color:"var(--nxt-fg-dim)" }}>{s.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          AGENTS — marquee + detail card
      ════════════════════════════════════════════ */}
      <section id="agents" className="scroll-mt-20 relative z-10 py-14 sm:py-20">
        <Reveal className="text-center px-5 mb-10">
          <span className="mono text-[10px] tracking-[0.38em] uppercase" style={{ color:"var(--nxt-fg-faint)" }}>AGENTS LIBRARY</span>
          <h2 className="mt-3 text-[28px] sm:text-[44px] font-bold tracking-[-0.03em]"
            style={{ fontFamily:"'Cabinet Grotesk',sans-serif" }}>
            <span style={{ color:"var(--nxt-fg)" }}>200 AI agents.</span>{" "}
            <span style={{ background: fadedHead, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>One platform.</span>
          </h2>
          <p className="mt-3 text-[14px] sm:text-[15.5px] max-w-[520px] mx-auto leading-relaxed" style={{ color:"var(--nxt-fg-dim)" }}>
            From backend architects to security auditors to personal skills. Pick one, connect your API keys, tell it what to do.
          </p>
        </Reveal>

        {/* Marquee row */}
        <div className="relative overflow-hidden py-3">
          <div className="absolute inset-y-0 left-0 w-16 sm:w-24 z-10 pointer-events-none" style={{ background:`linear-gradient(90deg,var(--nxt-bg) 0%,transparent 100%)` }} />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-24 z-10 pointer-events-none" style={{ background:`linear-gradient(270deg,var(--nxt-bg) 0%,transparent 100%)` }} />
          <div className="flex gap-2.5 nxt-marquee" style={{ width:"max-content" }}>
            {[...ALL_AGENTS,...ALL_AGENTS].map((name, i) => {
              const dots = ["#5EEAD4","#6366F1","#F59E0B","#EC4899"];
              return (
                <div key={i} className="flex-shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-full font-mono text-[11px] sm:text-[12px]"
                  style={{ background:"var(--nxt-surface-soft)", border:"1px solid var(--nxt-border-soft)", color:"var(--nxt-fg-dim)" }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dots[i % dots.length] }} />
                  {name}
                </div>
              );
            })}
          </div>
        </div>

        {/* Agent CTA */}
        <div className="flex justify-center mt-8 px-5">
          <Reveal>
            <button type="button"
              onClick={() => navigate(authed ? "/workspace/agents" : "/signin?return=/workspace/agents")}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full text-[13.5px] font-semibold tracking-tight transition-all hover:-translate-y-0.5"
              style={{
                background: isLight ? "#1F1F23" : "#FFFFFF",
                color: isLight ? "#FAFAFA" : "#1F1F23",
                boxShadow: isLight ? "0 10px 28px -10px rgba(31,31,35,0.30)" : "0 10px 28px -10px rgba(255,255,255,0.40)",
              }}
              data-testid="landing-agents-cta"
            >
              Browse all 200 agents <ArrowRight size={13} />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          FEATURES BENTO — staggered cards
      ════════════════════════════════════════════ */}
      <section className="relative z-10 py-14 sm:py-20 px-5 sm:px-8 mx-auto max-w-[1100px]">
        <Reveal className="text-center mb-10 sm:mb-14">
          <span className="mono text-[10px] tracking-[0.38em] uppercase" style={{ color:"var(--nxt-fg-faint)" }}>WHAT YOU GET</span>
          <h2 className="mt-3 text-[28px] sm:text-[44px] font-bold tracking-[-0.03em]"
            style={{ fontFamily:"'Cabinet Grotesk',sans-serif", color:"var(--nxt-fg)" }}>
            Everything. Already built in.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              title: "Live Preview",
              body: "Every change reflows instantly across phone, tablet, and desktop before you ship.",
              color: "#5EEAD4", icon: Eye, delay: 0,
              visual: (
                <div className="flex items-end gap-2 mt-5">
                  {/* Desktop mock */}
                  <div className="flex-1 rounded-xl overflow-hidden" style={{ background:"rgba(0,0,0,0.45)", border:"1px solid rgba(255,255,255,0.08)" }}>
                    <div className="flex gap-1 px-2 py-1.5" style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background:"#F87171" }} /><span className="w-1.5 h-1.5 rounded-full" style={{ background:"#FBBF24" }} /><span className="w-1.5 h-1.5 rounded-full" style={{ background:"#34D399" }} />
                    </div>
                    <div className="p-2 flex flex-col gap-1">
                      <span className="h-1 w-2/3 rounded-full bg-white/15 nxt-shimmer" /><span className="h-1 w-1/2 rounded-full bg-white/10" />
                      <div className="grid grid-cols-3 gap-1 mt-1">
                        {[0,1,2].map(k=><span key={k} className="h-5 rounded-md" style={{ background:"rgba(94,234,212,0.20)" }} />)}
                      </div>
                    </div>
                  </div>
                  {/* Phone mock */}
                  <div className="rounded-2xl overflow-hidden flex-shrink-0" style={{ width:32, height:64, background:"rgba(0,0,0,0.45)", border:"1px solid rgba(255,255,255,0.08)" }}>
                    <div className="h-2 flex items-center justify-center"><span className="w-5 h-0.5 rounded-full bg-white/20" /></div>
                    <div className="px-1 pt-1 flex flex-col gap-0.5"><span className="h-0.5 w-full rounded-full bg-white/15" /><span className="h-0.5 w-3/4 rounded-full bg-white/10" /><div className="grid grid-cols-2 gap-0.5 mt-1">{[0,1,2,3].map(k=><span key={k} className="aspect-square rounded" style={{ background:"rgba(94,234,212,0.22)" }} />)}</div></div>
                  </div>
                </div>
              ),
            },
            {
              title: "Build Anything",
              body: "Full-stack apps, marketing sites, mobile, Chrome extensions — four modes, one builder.",
              color: "#6366F1", icon: Zap, delay: 80,
              visual: (
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {[["Full Stack","#5EEAD4"],["Website","#6366F1"],["Mobile","#F59E0B"],["Extension","#EC4899"]].map(([l,c])=>(
                    <div key={l} className="px-2.5 py-2 rounded-xl text-center text-[11.5px] font-medium"
                      style={{ background:`${c}12`, border:`1px solid ${c}22`, color:c }}>
                      {l}
                    </div>
                  ))}
                </div>
              ),
            },
            {
              title: "Private & Exclusive",
              body: "Invite-only. Built in the United States. Your builds stay yours — no public exposure.",
              color: "#34D399", icon: Lock, delay: 160,
              visual: (
                <div className="mt-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background:"rgba(52,211,153,0.10)", border:"1px solid rgba(52,211,153,0.22)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 nxt-pulse" />
                    <span className="mono text-[10px] tracking-[0.22em] uppercase font-medium" style={{ color:"#34D399" }}>Invite Only · USA</span>
                  </div>
                </div>
              ),
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={card.delay} from="bottom">
                <div className="rounded-3xl p-6 sm:p-7 h-full relative overflow-hidden group"
                  style={{
                    background: isLight ? "linear-gradient(150deg,#FBFAF6,#F0EAD8)" : "linear-gradient(150deg,rgba(44,44,52,0.9),rgba(28,28,34,0.95))",
                    border: `1px solid ${isLight ? "rgba(26,26,31,0.07)" : "rgba(255,255,255,0.07)"}`,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 24px 50px -20px ${card.color}28`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=""; }}
                >
                  <div aria-hidden className="absolute top-0 right-0 w-24 h-24 pointer-events-none" style={{ background:`radial-gradient(circle at 100% 0%,${card.color}16 0%,transparent 70%)` }} />
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background:`${card.color}14`, border:`1px solid ${card.color}28` }}>
                    <Icon size={15} style={{ color:card.color }} />
                  </div>
                  <h3 className="text-[20px] sm:text-[22px] font-bold tracking-tight mb-2" style={{ fontFamily:"'Cabinet Grotesk',sans-serif", color:"var(--nxt-fg)" }}>{card.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color:"var(--nxt-fg-dim)" }}>{card.body}</p>
                  {card.visual}
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          MODELS — compact logo wall
      ════════════════════════════════════════════ */}
      <section id="models" className="scroll-mt-20 relative z-10 py-14 sm:py-20 px-5 sm:px-8">
        <Reveal className="text-center mb-8 sm:mb-10">
          <span className="mono text-[10px] tracking-[0.38em] uppercase" style={{ color:"var(--nxt-fg-faint)" }}>POWERED BY</span>
          <h2 className="mt-3 text-[26px] sm:text-[38px] font-bold tracking-[-0.03em]"
            style={{ fontFamily:"'Cabinet Grotesk',sans-serif", color:"var(--nxt-fg)" }}>
            Top AI models. One place.
          </h2>
          <p className="mt-2 text-[14px]" style={{ color:"var(--nxt-fg-dim)" }}>Switch providers in a tap. Bring your own API keys.</p>
        </Reveal>

        <div className="mx-auto max-w-[680px]">
          <Reveal>
            <div className="rounded-3xl p-6 sm:p-8"
              style={{
                background: isLight ? "linear-gradient(150deg,#FBFAF6,#F0EAD8)" : "linear-gradient(150deg,rgba(44,44,52,0.9),rgba(28,28,34,0.95))",
                border: `1px solid ${isLight ? "rgba(26,26,31,0.07)" : "rgba(255,255,255,0.07)"}`,
              }}
              data-testid="showcase-provider-wall"
            >
              <div className="grid grid-cols-5 gap-4 sm:gap-6 items-center justify-items-center">
                {PROVIDERS.map((p, i) => (
                  <Reveal key={p.key} delay={i * 60}>
                    <div className="flex flex-col items-center gap-2 group">
                      <div className="flex items-center justify-center rounded-2xl overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl"
                        style={{ width:48, height:48, background:p.tile, boxShadow:"0 6px 18px -8px rgba(0,0,0,0.5),inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
                        <ProviderLogo provider={p.key} size={28} invert={p.invert} />
                      </div>
                      <span className="mono text-[9.5px] sm:text-[10px] tracking-[0.16em] uppercase" style={{ color:"var(--nxt-fg-faint)" }}>{p.label}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SHIP ANYTHING — 8-item grid
      ════════════════════════════════════════════ */}
      <section id="ship" className="scroll-mt-20 relative z-10 py-14 sm:py-20 px-5 sm:px-8 mx-auto max-w-[1100px]">
        <Reveal className="text-center mb-10">
          <span className="mono text-[10px] tracking-[0.38em] uppercase" style={{ color:"var(--nxt-fg-faint)" }}>WHAT YOU CAN SHIP</span>
          <h2 className="mt-3 text-[26px] sm:text-[40px] font-bold tracking-[-0.03em]"
            style={{ fontFamily:"'Cabinet Grotesk',sans-serif", color:"var(--nxt-fg)" }}>
            Built for founders who ship.
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {SHIP_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.label} delay={i * 55} from="scale">
                <div className="rounded-2xl px-4 py-4 sm:py-5 flex items-center gap-3 group cursor-default"
                  style={{
                    background: isLight ? "rgba(26,26,31,0.04)" : "rgba(255,255,255,0.025)",
                    border: `1px solid ${isLight ? "rgba(26,26,31,0.07)" : "rgba(255,255,255,0.06)"}`,
                    transition:"transform 0.25s ease,box-shadow 0.25s ease,border-color 0.25s ease",
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.borderColor=`${item.color}35`; e.currentTarget.style.boxShadow=`0 14px 32px -14px ${item.color}25`; }}
                  onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.borderColor=""; e.currentTarget.style.boxShadow=""; }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background:`${item.color}14`, border:`1px solid ${item.color}24` }}>
                    <Icon size={13} style={{ color:item.color }} />
                  </div>
                  <span className="text-[12.5px] sm:text-[13.5px] font-medium tracking-tight" style={{ color:"var(--nxt-fg)" }}>{item.label}</span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CTA — full-width
      ════════════════════════════════════════════ */}
      <section className="relative z-10 px-5 sm:px-8 py-10 pb-20 mx-auto max-w-[1100px]">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden px-7 sm:px-16 py-14 sm:py-20 text-center"
            style={{
              background: isLight
                ? "linear-gradient(135deg,rgba(20,130,110,0.10) 0%,rgba(181,131,32,0.07) 50%,rgba(194,90,31,0.09) 100%),#F7F2E4"
                : "linear-gradient(135deg,rgba(94,234,212,0.07) 0%,rgba(99,102,241,0.06) 50%,rgba(245,158,11,0.05) 100%),rgba(32,32,38,0.6)",
              border: `1px solid ${isLight ? "rgba(26,26,31,0.07)" : "rgba(255,255,255,0.07)"}`,
              backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
            }}
            data-testid="landing-cta-strip"
          >
            <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(70% 70% at 50% 0%,rgba(94,234,212,0.06) 0%,transparent 70%)" }} />
            <div className="relative">
              <div className="mono text-[10px] sm:text-[10.5px] tracking-[0.40em] uppercase font-medium bg-clip-text text-transparent mb-4"
                style={{ backgroundImage: rainbow }}>
                DISCOVER · DEVELOP · DELIVER
              </div>
              <h2 className="text-[28px] sm:text-[46px] font-black tracking-[-0.03em] mb-4 leading-[1.02]"
                style={{ fontFamily:"'Cabinet Grotesk',sans-serif", color:"var(--nxt-fg)" }}>
                Ready to build your<br className="hidden sm:block" /> next idea?
              </h2>
              <p className="text-[14.5px] sm:text-[16px] max-w-[420px] mx-auto mb-9 leading-relaxed" style={{ color:"var(--nxt-fg-dim)" }}>
                Join a select group of founders building real software with AI. Invite-only access.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button onClick={() => navigate("/signup")}
                  className="inline-flex items-center gap-2 h-12 px-8 rounded-full text-[14px] font-bold tracking-tight transition-all hover:-translate-y-0.5 group"
                  style={{
                    background: isLight ? "#1F1F23" : "#FFFFFF",
                    color: isLight ? "#FAFAFA" : "#1F1F23",
                    boxShadow: isLight ? "0 12px 32px -10px rgba(31,31,35,0.35)" : "0 12px 32px -10px rgba(255,255,255,0.50)",
                  }}
                  data-testid="landing-cta-button"
                >
                  Request access
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </button>
                <button onClick={() => navigate("/signin")}
                  className="inline-flex items-center gap-1.5 h-12 px-6 rounded-full text-[14px] font-medium tracking-tight transition-all hover:opacity-70"
                  style={{ color:"var(--nxt-fg-dim)" }}>
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════ */}
      <footer className="relative z-10 px-5 sm:px-10 pt-6 pb-8 sm:pb-10" style={{ borderTop:"1px solid var(--nxt-border-soft)" }} data-testid="public-footer">
        <div className="mx-auto max-w-[1080px]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <Brand size="sm" gradient />
            <nav className="flex items-center gap-5 sm:gap-6 text-[12px]" style={{ color:"var(--nxt-fg-faint)" }}>
              <Link to="/privacy" className="hover:opacity-80 transition-opacity" data-testid="footer-privacy">Privacy</Link>
              <Link to="/terms"   className="hover:opacity-80 transition-opacity" data-testid="footer-terms">Terms</Link>
              <Link to="/contact" className="hover:opacity-80 transition-opacity" data-testid="footer-contact">Contact</Link>
              <Link to="/access"  className="hover:opacity-80 transition-opacity" data-testid="footer-workspace">Workspace</Link>
            </nav>
          </div>
          <div className="mt-5 h-px" style={{ background:"var(--nxt-border-soft)" }} />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11.5px]" style={{ color:"var(--nxt-fg-faint)" }} data-testid="footer-attribution">
            <span data-testid="footer-jwood-attribution">
              A product of <span style={{ color:"var(--nxt-fg-dim)", fontWeight:600 }}>Jwood Technologies</span>
            </span>
            <span style={{ opacity:.4 }}>·</span>
            <span className="inline-flex items-center gap-1.5" data-testid="footer-made-in-usa">
              <USFlag />
              Made in the USA
            </span>
            <span style={{ opacity:.4 }}>·</span>
            <span>© {new Date().getFullYear()} NXT1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
