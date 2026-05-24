/**
 * NXT1 — Landing (Phase 16 — Premium UI Rebuild)
 *
 * Complete redesign:
 *  • Animated orb backdrop + floating particles
 *  • "EXCLUSIVE ACCESS · MADE IN THE USA" pulse badge
 *  • Oversized hero headline (102px desktop) with rainbow "Ship it."
 *  • Stats strip (191 Agents · 52 Skills · 5+ Models · 100% Private)
 *  • Prompt cockpit with animated glow-border on focus
 *  • Bento feature grid (5 glass cards)
 *  • Infinite agent-name marquee
 *  • Prompt-to-deploy flow, demos, showcase
 *  • Full-width CTA strip before footer
 *  • Mobile-first throughout
 */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicFooter from "@/components/PublicFooter";
import {
  ArrowRight, Sparkles, Layers, Globe, Smartphone, Puzzle,
  Cpu, Zap, Eye, Shield, Lock,
} from "lucide-react";
import Brand from "@/components/Brand";
import GradientBackdrop from "@/components/GradientBackdrop";
import ModelPickerCockpit from "@/components/premium/ModelPickerCockpit";
import LandingShowcase from "@/components/landing/LandingShowcase";
import HomepageDemos from "@/components/landing/HomepageDemos";
import PromptToDeployFlow from "@/components/landing/PromptToDeployFlow";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import { useTheme } from "@/components/theme/ThemeProvider";
import { isAuthenticated } from "@/lib/auth";

/* ─────────────────────────── Data ─────────────────────────── */

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
    { label: "Fitness app",      prompt: "Build a mobile fitness app with workout tracking and progress charts." },
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

const STATS = [
  { n: "191",  label: "AI Agents"  },
  { n: "52",   label: "Skills"     },
  { n: "5+",   label: "AI Models"  },
  { n: "100%", label: "Private"    },
];

const ALL_AGENTS = [
  "backend-architect", "security-auditor", "frontend-developer", "test-automator",
  "devops-troubleshooter", "code-reviewer", "product-manager", "ui-designer",
  "data-analyst", "api-builder", "cloud-architect", "ml-engineer",
  "performance-optimizer", "documentation-writer", "database-admin",
  "github", "notion", "imessage", "whisper", "apple-notes",
  "stripe-integrator", "auth-builder", "websocket-expert", "mobile-developer",
];

const BENTO_AGENTS = ALL_AGENTS.slice(0, 12);

const SHIP_ITEMS = [
  { label: "MVPs",              icon: Zap      },
  { label: "Full-stack apps",   icon: Layers   },
  { label: "Marketing sites",   icon: Globe    },
  { label: "Dashboards",        icon: Cpu      },
  { label: "Internal tools",    icon: Shield   },
  { label: "Mobile apps",       icon: Smartphone },
  { label: "AI workflows",      icon: Sparkles },
  { label: "Custom software",   icon: Eye      },
];

/* ─────────────────────────── Hooks ─────────────────────────── */

function useTypedPlaceholder(cycle, { isPaused }) {
  const [text, setText] = useState("");
  const stateRef = useRef({ i: 0, phase: "typing", cursor: 0 });

  useEffect(() => {
    if (isPaused) return;
    let mounted = true;
    const tick = () => {
      if (!mounted) return;
      const s = stateRef.current;
      const target = cycle[s.i % cycle.length];
      if (s.phase === "typing") {
        if (s.cursor < target.length) {
          s.cursor += 1;
          setText(target.slice(0, s.cursor));
          timer = setTimeout(tick, 28 + Math.random() * 30);
        } else {
          s.phase = "hold";
          timer = setTimeout(tick, 1700);
        }
      } else if (s.phase === "hold") {
        s.phase = "erasing";
        timer = setTimeout(tick, 20);
      } else if (s.phase === "erasing") {
        if (s.cursor > 0) {
          s.cursor -= 1;
          setText(target.slice(0, s.cursor));
          timer = setTimeout(tick, 14);
        } else {
          s.i += 1;
          s.phase = "typing";
          timer = setTimeout(tick, 220);
        }
      }
    };
    let timer = setTimeout(tick, 600);
    return () => { mounted = false; clearTimeout(timer); };
  }, [cycle, isPaused]);

  return text;
}

/* ─────────────────────────── Sub-components ─────────────────────────── */

const PARTICLES = [
  { size: 3, x: "12%",  y: "22%", delay: "0s",   dur: "8s"  },
  { size: 2, x: "82%",  y: "14%", delay: "2.3s", dur: "10s" },
  { size: 4, x: "65%",  y: "68%", delay: "4.1s", dur: "7s"  },
  { size: 2, x: "38%",  y: "54%", delay: "1.2s", dur: "9s"  },
  { size: 3, x: "91%",  y: "42%", delay: "3.5s", dur: "11s" },
  { size: 2, x: "22%",  y: "78%", delay: "5.2s", dur: "8s"  },
  { size: 3, x: "55%",  y: "32%", delay: "0.8s", dur: "12s" },
  { size: 2, x: "73%",  y: "85%", delay: "6.1s", dur: "9s"  },
];

function FloatingParticles({ isLight }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            background: isLight ? "rgba(20,130,110,0.55)" : "rgba(94,234,212,0.65)",
            boxShadow: isLight
              ? `0 0 ${p.size * 4}px rgba(20,130,110,0.45)`
              : `0 0 ${p.size * 4}px rgba(94,234,212,0.55)`,
            animation: `nxt-particle-float ${p.dur} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

function AgentMarquee({ isLight }) {
  const doubled = [...ALL_AGENTS, ...ALL_AGENTS];
  const dotColors = ["#5EEAD4", "#6366F1", "#F59E0B", "#EC4899"];
  return (
    <section className="relative overflow-hidden py-8 sm:py-12" aria-hidden>
      <div
        className="absolute inset-y-0 left-0 w-20 sm:w-32 z-10 pointer-events-none"
        style={{ background: `linear-gradient(90deg, var(--nxt-bg) 0%, transparent 100%)` }}
      />
      <div
        className="absolute inset-y-0 right-0 w-20 sm:w-32 z-10 pointer-events-none"
        style={{ background: `linear-gradient(270deg, var(--nxt-bg) 0%, transparent 100%)` }}
      />
      <div className="flex gap-2.5 nxt-marquee" style={{ width: "max-content" }}>
        {doubled.map((name, i) => (
          <div
            key={i}
            className="flex-shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-[11px] sm:text-[11.5px] tracking-tight"
            style={{
              background: "var(--nxt-surface-soft)",
              border: "1px solid var(--nxt-border-soft)",
              color: "var(--nxt-fg-dim)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: dotColors[i % dotColors.length] }}
            />
            {name}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── Main page ─────────────────────────── */

export default function LandingPage() {
  const navigate  = useNavigate();
  const { theme } = useTheme();
  const isLight   = theme === "light";
  const [authed,    setAuthed]    = useState(false);
  const [draft,     setDraft]     = useState("");
  const [mode,      setMode]      = useState("fullstack");
  const [provider,  setProvider]  = useState("anthropic");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const placeholder = useTypedPlaceholder(PLACEHOLDER_CYCLE, { isPaused: !!draft });

  useEffect(() => {
    setAuthed(isAuthenticated());
    try {
      const saved = window.localStorage.getItem("nxt1_draft_prompt") || "";
      if (saved) setDraft(saved);
    } catch { /* ignore */ }
    setTimeout(() => textareaRef.current?.focus(), 80);
  }, []);

  const onDraftChange = (val) => {
    setDraft(val);
    try { window.localStorage.setItem("nxt1_draft_prompt", val); } catch { /**/ }
  };

  const onBuild = () => {
    const v = (draft || "").trim();
    if (!v) { textareaRef.current?.focus(); return; }
    try { window.localStorage.setItem("nxt1_draft_prompt", v); } catch { /**/ }
    const target = authed ? "/workspace" : "/signup";
    navigate(`${target}?prompt=${encodeURIComponent(v)}&mode=${mode}&return=/dashboard`);
  };

  /* ─── gradient helpers ─── */
  const rainbowGrad = isLight
    ? "linear-gradient(110deg, #0E8C73 0%, #B58320 50%, #C25A1F 100%)"
    : "linear-gradient(110deg, #5EEAD4 0%, #F0D28A 50%, #FF8A3D 100%)";

  const headingFadeGrad = isLight
    ? "linear-gradient(180deg, #1A1A1F 0%, #6A6259 100%)"
    : "linear-gradient(180deg, #E8E8EE 0%, #8A8A93 100%)";

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif", color: "var(--nxt-fg)" }}
      data-testid="landing-page"
    >
      <GradientBackdrop variant="cinema" intensity="soft" />
      <FloatingParticles isLight={isLight} />

      {/* ══════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════ */}
      <header
        className="relative z-20 px-5 sm:px-10 pt-5 sm:pt-6 flex items-center justify-between"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <Brand size="md" gradient />

        <nav className="hidden md:flex items-center gap-0.5" data-testid="landing-section-nav">
          {[
            { id: "flow",     label: "How it works" },
            { id: "features", label: "Demos"         },
            { id: "ship",     label: "What you ship" },
            { id: "agents",   label: "Agents"        },
            { id: "showcase", label: "Models"        },
          ].map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-[12.5px] tracking-tight px-3 py-2 rounded-full transition-all hover:opacity-100"
              style={{ color: "var(--nxt-fg-dim)" }}
              data-testid={`landing-nav-${s.id}`}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeSwitcher />
          {authed ? (
            <button
              onClick={() => navigate("/workspace")}
              className="text-[13px] tracking-tight font-medium px-3 py-2 rounded-full transition-colors"
              style={{ color: "var(--nxt-fg)" }}
              data-testid="nav-dashboard-button"
            >
              Open workspace <ArrowRight size={13} className="inline ml-1" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/signin")}
                className="text-[13px] tracking-tight px-3 py-2 transition-colors hover:opacity-100"
                style={{ color: "var(--nxt-fg-dim)" }}
                data-testid="nav-signin-button"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="text-[13px] tracking-tight font-semibold px-4 py-2 rounded-full transition-all hover:-translate-y-0.5"
                style={
                  isLight
                    ? { background: "#1F1F23", color: "#FAFAFA", border: "1px solid rgba(26,26,31,0.18)", boxShadow: "0 6px 16px -8px rgba(31,31,35,0.35)" }
                    : { background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)", border: "1px solid rgba(255,255,255,0.12)", color: "#FAFAFA" }
                }
                data-testid="nav-signup-button"
              >
                Request access
              </button>
            </>
          )}
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <main className="relative z-10 mx-auto max-w-[960px] px-5 sm:px-6 pt-[7vh] sm:pt-[9vh] pb-12 sm:pb-20">

        {/* Exclusive badge */}
        <div className="flex justify-center mb-7 sm:mb-8 nxt-fade-up" style={{ animationDelay: "0ms" }}>
          <div
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full"
            style={{
              background: isLight ? "rgba(20,130,110,0.08)" : "rgba(94,234,212,0.06)",
              border: `1px solid ${isLight ? "rgba(20,130,110,0.22)" : "rgba(94,234,212,0.18)"}`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full nxt-pulse flex-shrink-0"
              style={{ background: "#34D399" }}
            />
            <span
              className="mono text-[9.5px] sm:text-[10.5px] tracking-[0.38em] uppercase font-medium"
              style={{ color: isLight ? "#0E8C73" : "#5EEAD4" }}
            >
              Exclusive Access · Made in the USA
            </span>
          </div>
        </div>

        {/* Giant headline */}
        <h1
          className="text-[52px] sm:text-[80px] lg:text-[102px] leading-[0.93] tracking-[-0.04em] font-bold text-center mb-4 sm:mb-5 nxt-fade-up"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif", animationDelay: "60ms" }}
        >
          <span className="block" style={{ color: "var(--nxt-fg)" }}>
            Build software.
          </span>
          <span
            className="block"
            style={{
              background: rainbowGrad,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Ship it.
          </span>
        </h1>

        {/* Discover · Develop · Deliver */}
        <div
          className="flex items-center justify-center gap-3 sm:gap-4 mb-5 sm:mb-6 nxt-fade-up"
          style={{ animationDelay: "120ms" }}
          data-testid="brand-triplet"
        >
          <span
            className="h-px w-10 sm:w-16"
            style={{ background: "var(--nxt-border-strong)" }}
          />
          <span
            className="mono text-[10px] sm:text-[11px] tracking-[0.44em] uppercase font-semibold bg-clip-text text-transparent"
            style={{ backgroundImage: rainbowGrad }}
          >
            DISCOVER · DEVELOP · DELIVER
          </span>
          <span
            className="h-px w-10 sm:w-16"
            style={{ background: "var(--nxt-border-strong)" }}
          />
        </div>

        {/* Subtitle */}
        <p
          className="text-center text-[14px] sm:text-[16px] max-w-[540px] mx-auto mb-7 sm:mb-9 leading-relaxed nxt-fade-up"
          style={{ color: "var(--nxt-fg-dim)", animationDelay: "180ms" }}
        >
          A private AI platform for founders. Describe your vision
          and watch it become real software — ready to ship, no engineering team required.
        </p>

        {/* Stats strip */}
        <div
          className="flex items-center justify-center gap-5 sm:gap-8 md:gap-14 mb-10 sm:mb-12 flex-wrap nxt-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          {STATS.map(({ n, label }) => (
            <div key={label} className="text-center">
              <div
                className="text-[24px] sm:text-[30px] font-black tracking-tight leading-none mb-1"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif", color: "var(--nxt-fg)" }}
              >
                {n}
              </div>
              <div
                className="mono text-[9px] sm:text-[9.5px] tracking-[0.28em] uppercase"
                style={{ color: "var(--nxt-fg-faint)" }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Prompt cockpit ── */}
        <div
          className="mx-auto max-w-[780px] relative group nxt-fade-up"
          style={{ animationDelay: "300ms" }}
          data-testid="landing-prompt-cockpit"
        >
          {/* Animated gradient glow ring that appears on focus */}
          <div
            aria-hidden
            className="absolute -inset-[1.5px] rounded-[30px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: isLight
                ? "linear-gradient(135deg, rgba(20,130,110,0.8), rgba(181,131,32,0.6), rgba(194,90,31,0.7))"
                : "linear-gradient(135deg, rgba(94,234,212,0.7), rgba(99,102,241,0.6), rgba(245,158,11,0.55))",
              borderRadius: 30,
            }}
          />

          {/* Ambient glow behind */}
          <div
            aria-hidden
            className="absolute -inset-x-10 -inset-y-8 rounded-[50px] blur-3xl opacity-40 group-focus-within:opacity-85 transition-opacity duration-700 pointer-events-none"
            style={{
              background: isLight
                ? "radial-gradient(65% 65% at 50% 100%, rgba(20,130,110,0.22) 0%, transparent 70%)"
                : "radial-gradient(65% 65% at 50% 100%, rgba(94,234,212,0.22) 0%, transparent 70%), radial-gradient(60% 60% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)",
            }}
          />

          {/* Cockpit body — always dark graphite */}
          <div
            className="relative rounded-[28px] transition-all duration-300"
            style={{
              background: "linear-gradient(180deg, #303038 0%, #1F1F23 100%)",
              border: isLight
                ? "1px solid rgba(26,26,31,0.10)"
                : "1px solid rgba(255,255,255,0.10)",
              boxShadow: isLight
                ? "0 28px 60px -22px rgba(40,30,15,0.30), 0 8px 22px -10px rgba(40,30,15,0.18), inset 0 1px 0 rgba(255,255,255,0.04)"
                : "0 28px 60px -22px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <textarea
              ref={textareaRef}
              rows={3}
              value={draft}
              onChange={(e) => onDraftChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  onBuild();
                }
              }}
              placeholder={placeholder ? `${placeholder}` : "Describe what you want to build…"}
              className="w-full bg-transparent outline-none resize-none text-[16px] sm:text-[17px] leading-[1.55] tracking-[-0.005em] px-6 pt-5 pb-3 placeholder:text-white/30 text-white"
              data-testid="landing-prompt-input"
              style={{ fontSize: "16px" }}
            />

            {/* Mode tabs */}
            <div className="px-3 sm:px-4 pt-1 pb-2">
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2" role="tablist" aria-label="Build type">
                {MODES.map((m) => {
                  const Icon = m.icon || Sparkles;
                  const active = mode === m.key;
                  return (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setMode(m.key)}
                      data-testid={`landing-mode-${m.key}`}
                      role="tab"
                      aria-selected={active}
                      className="relative flex flex-col items-center justify-center gap-1.5 px-1 py-2.5 rounded-2xl transition-all duration-200"
                      style={
                        active
                          ? {
                              background: "linear-gradient(180deg, rgba(94,234,212,0.18) 0%, rgba(94,234,212,0.05) 100%)",
                              boxShadow: "inset 0 0 0 1px rgba(94,234,212,0.35), 0 8px 24px -10px rgba(94,234,212,0.30)",
                              color: "#FFFFFF",
                            }
                          : {
                              background: "rgba(255,255,255,0.025)",
                              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.07)",
                              color: "rgba(255,255,255,0.65)",
                            }
                      }
                    >
                      <Icon
                        size={15}
                        strokeWidth={1.7}
                        style={{ color: active ? "#5EEAD4" : "rgba(255,255,255,0.65)" }}
                      />
                      <span className="text-[11px] sm:text-[12px] font-medium tracking-tight whitespace-nowrap">
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action row */}
            <div className="flex items-center justify-between gap-2 px-3 sm:px-4 pb-3 pt-1">
              <div className="flex-1 min-w-0">
                <ModelPickerCockpit
                  value={provider}
                  onChange={setProvider}
                  providers={{ emergent: true, anthropic: true }}
                  compact
                />
              </div>
              <button
                type="button"
                onClick={onBuild}
                disabled={!draft.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold tracking-tight bg-white text-[#1F1F23] hover:bg-white/95 transition-all duration-200 shadow-[0_8px_28px_-10px_rgba(255,255,255,0.55)] hover:shadow-[0_14px_42px_-10px_rgba(255,255,255,0.75)] hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none shrink-0"
                data-testid="landing-build-button"
              >
                <Sparkles size={13} />
                Build
              </button>
            </div>
          </div>

          {/* Keyboard hint */}
          <p
            className="mt-4 text-center mono text-[10px] tracking-[0.24em] uppercase"
            style={{ color: "var(--nxt-fg-faint)" }}
          >
            ⌘ + ↵ to build
          </p>

          {/* Suggestion chips */}
          <div
            className="mt-5 flex flex-wrap items-center justify-center gap-1.5"
            data-testid="landing-suggestion-chips"
          >
            {(MODE_SUGGESTIONS[mode] || []).map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => {
                  onDraftChange(s.prompt);
                  setTimeout(() => textareaRef.current?.focus(), 30);
                }}
                className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-[11.5px] transition-all hover:-translate-y-0.5"
                style={{
                  background: "var(--nxt-chip-bg)",
                  border: "1px solid var(--nxt-chip-border)",
                  color: "var(--nxt-fg-dim)",
                }}
                data-testid={`landing-suggest-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Sparkles size={10} style={{ color: "var(--nxt-accent)" }} />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════
          BENTO FEATURE GRID
      ══════════════════════════════════════════════════ */}
      <section
        className="relative z-10 mx-auto max-w-[1120px] px-5 sm:px-6 py-12 sm:py-20"
        data-testid="landing-bento"
      >
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-14">
          <span
            className="mono text-[10px] sm:text-[10.5px] tracking-[0.38em] uppercase"
            style={{ color: "var(--nxt-fg-faint)" }}
          >
            WHAT YOU GET
          </span>
          <h2
            className="mt-3 text-[28px] sm:text-[42px] lg:text-[50px] leading-[1.03] tracking-[-0.03em] font-bold"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
          >
            <span
              style={{
                background: headingFadeGrad,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Everything to build,
            </span>{" "}
            <span style={{ color: "var(--nxt-fg)" }}>ship, and scale.</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

          {/* ── Card 1 (spans 2 cols): 191 AI Agents ── */}
          <div
            className="sm:col-span-2 rounded-3xl p-6 sm:p-8 relative overflow-hidden glow-hover"
            style={{
              background: isLight
                ? "linear-gradient(145deg, #FBFAF6 0%, #F4EFE0 100%)"
                : "linear-gradient(145deg, rgba(48,48,56,0.85) 0%, rgba(30,30,36,0.90) 100%)",
              border: `1px solid ${isLight ? "rgba(26,26,31,0.08)" : "rgba(255,255,255,0.07)"}`,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            data-testid="bento-agents"
          >
            {/* Corner glow */}
            <div
              aria-hidden
              className="absolute top-0 left-0 w-48 h-48 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 0% 0%, rgba(94,234,212,0.14) 0%, transparent 70%)",
              }}
            />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span
                    className="mono text-[10px] tracking-[0.32em] uppercase"
                    style={{ color: "var(--nxt-fg-faint)" }}
                  >
                    AGENTS LIBRARY
                  </span>
                  <h3
                    className="mt-1.5 text-[22px] sm:text-[28px] font-bold tracking-tight leading-tight"
                    style={{ fontFamily: "'Cabinet Grotesk', sans-serif", color: "var(--nxt-fg)" }}
                  >
                    191 AI Agents
                  </h3>
                  <p
                    className="mt-1 text-[13px] sm:text-[14px] leading-relaxed max-w-[340px]"
                    style={{ color: "var(--nxt-fg-dim)" }}
                  >
                    Backend architects to security auditors. Pick one, connect your keys, tell it what to do.
                  </p>
                </div>
                <div
                  className="hidden sm:flex items-center justify-center w-10 h-10 rounded-2xl flex-shrink-0 ml-4"
                  style={{
                    background: isLight ? "rgba(94,234,212,0.15)" : "rgba(94,234,212,0.12)",
                    border: "1px solid rgba(94,234,212,0.24)",
                  }}
                >
                  <Cpu size={16} style={{ color: "#5EEAD4" }} />
                </div>
              </div>

              {/* Agent chip grid */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-5">
                {BENTO_AGENTS.map((name, i) => {
                  const colors = ["#5EEAD4", "#6366F1", "#F59E0B", "#EC4899"];
                  return (
                    <span
                      key={name}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[10.5px] sm:text-[11px]"
                      style={{
                        background: isLight
                          ? "rgba(26,26,31,0.05)"
                          : "rgba(255,255,255,0.05)",
                        border: `1px solid ${isLight ? "rgba(26,26,31,0.08)" : "rgba(255,255,255,0.08)"}`,
                        color: "var(--nxt-fg-dim)",
                      }}
                    >
                      <span
                        className="w-1 h-1 rounded-full flex-shrink-0"
                        style={{ background: colors[i % colors.length] }}
                      />
                      {name}
                    </span>
                  );
                })}
                <span
                  className="inline-flex items-center px-2.5 py-1 rounded-lg font-mono text-[10.5px] sm:text-[11px]"
                  style={{
                    background: isLight ? "rgba(94,234,212,0.10)" : "rgba(94,234,212,0.08)",
                    border: "1px solid rgba(94,234,212,0.20)",
                    color: "#5EEAD4",
                  }}
                >
                  +179 more
                </span>
              </div>
            </div>
          </div>

          {/* ── Card 2: Build Anything ── */}
          <div
            className="rounded-3xl p-6 sm:p-7 relative overflow-hidden glow-hover"
            style={{
              background: isLight
                ? "linear-gradient(145deg, #FBFAF6 0%, #F4EFE0 100%)"
                : "linear-gradient(145deg, rgba(48,48,56,0.85) 0%, rgba(30,30,36,0.90) 100%)",
              border: `1px solid ${isLight ? "rgba(26,26,31,0.08)" : "rgba(255,255,255,0.07)"}`,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            data-testid="bento-build"
          >
            <div
              aria-hidden
              className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 100% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)",
              }}
            />
            <div className="relative">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-2xl mb-4"
                style={{
                  background: isLight ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.10)",
                  border: "1px solid rgba(99,102,241,0.22)",
                }}
              >
                <Zap size={16} style={{ color: "#6366F1" }} />
              </div>
              <span className="mono text-[10px] tracking-[0.32em] uppercase" style={{ color: "var(--nxt-fg-faint)" }}>
                BUILD ANYTHING
              </span>
              <h3
                className="mt-1.5 text-[20px] sm:text-[22px] font-bold tracking-tight leading-tight mb-2"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif", color: "var(--nxt-fg)" }}
              >
                Full stack to mobile.
              </h3>
              <p className="text-[13px] leading-relaxed mb-5" style={{ color: "var(--nxt-fg-dim)" }}>
                MVPs. SaaS platforms. Marketing sites. AI workflows. Internal tools.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Full Stack", color: "#5EEAD4" },
                  { label: "Website",    color: "#6366F1" },
                  { label: "Mobile",     color: "#F59E0B" },
                  { label: "Extension",  color: "#EC4899" },
                ].map(({ label, color }) => (
                  <div
                    key={label}
                    className="px-2.5 py-2 rounded-xl text-[11.5px] font-medium text-center"
                    style={{
                      background: `${color}12`,
                      border: `1px solid ${color}22`,
                      color: isLight ? "var(--nxt-fg)" : color,
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Card 3: Live Preview ── */}
          <div
            className="rounded-3xl p-6 sm:p-7 relative overflow-hidden glow-hover"
            style={{
              background: isLight
                ? "linear-gradient(145deg, #FBFAF6 0%, #F4EFE0 100%)"
                : "linear-gradient(145deg, rgba(48,48,56,0.85) 0%, rgba(30,30,36,0.90) 100%)",
              border: `1px solid ${isLight ? "rgba(26,26,31,0.08)" : "rgba(255,255,255,0.07)"}`,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            data-testid="bento-preview"
          >
            <div
              aria-hidden
              className="absolute bottom-0 left-0 w-40 h-40 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 0% 100%, rgba(245,158,11,0.10) 0%, transparent 70%)",
              }}
            />
            <div className="relative">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-2xl mb-4"
                style={{
                  background: isLight ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.10)",
                  border: "1px solid rgba(245,158,11,0.22)",
                }}
              >
                <Eye size={16} style={{ color: "#F59E0B" }} />
              </div>
              <span className="mono text-[10px] tracking-[0.32em] uppercase" style={{ color: "var(--nxt-fg-faint)" }}>
                LIVE PREVIEW
              </span>
              <h3
                className="mt-1.5 text-[20px] sm:text-[22px] font-bold tracking-tight leading-tight mb-2"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif", color: "var(--nxt-fg)" }}
              >
                See it live instantly.
              </h3>
              <p className="text-[13px] leading-relaxed mb-5" style={{ color: "var(--nxt-fg-dim)" }}>
                Every change reflects across phone, tablet, and desktop in real time.
              </p>
              {/* Mini device mockup */}
              <div className="flex items-end gap-2">
                <div
                  className="flex-1 rounded-xl overflow-hidden"
                  style={{
                    height: 72,
                    background: "rgba(26,26,31,0.8)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex gap-1 px-2 py-1.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400/60" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
                  </div>
                  <div className="px-2 pt-2 flex flex-col gap-1">
                    <span className="h-1 w-2/3 rounded-full bg-white/15" />
                    <span className="h-1 w-1/2 rounded-full bg-white/10" />
                  </div>
                </div>
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    width: 36,
                    height: 72,
                    background: "rgba(26,26,31,0.8)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="h-2 flex items-center justify-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="w-5 h-0.5 rounded-full bg-white/20" />
                  </div>
                  <div className="px-1 pt-1.5 flex flex-col gap-1">
                    <span className="h-0.5 w-full rounded-full bg-white/15" />
                    <span className="h-0.5 w-3/4 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Card 4: AI Models ── */}
          <div
            className="rounded-3xl p-6 sm:p-7 relative overflow-hidden glow-hover"
            style={{
              background: isLight
                ? "linear-gradient(145deg, #FBFAF6 0%, #F4EFE0 100%)"
                : "linear-gradient(145deg, rgba(48,48,56,0.85) 0%, rgba(30,30,36,0.90) 100%)",
              border: `1px solid ${isLight ? "rgba(26,26,31,0.08)" : "rgba(255,255,255,0.07)"}`,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            data-testid="bento-models"
          >
            <div
              aria-hidden
              className="absolute top-0 right-0 w-36 h-36 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 100% 0%, rgba(236,72,153,0.10) 0%, transparent 70%)",
              }}
            />
            <div className="relative">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-2xl mb-4"
                style={{
                  background: isLight ? "rgba(236,72,153,0.10)" : "rgba(236,72,153,0.08)",
                  border: "1px solid rgba(236,72,153,0.20)",
                }}
              >
                <Sparkles size={16} style={{ color: "#EC4899" }} />
              </div>
              <span className="mono text-[10px] tracking-[0.32em] uppercase" style={{ color: "var(--nxt-fg-faint)" }}>
                TOP AI MODELS
              </span>
              <h3
                className="mt-1.5 text-[20px] sm:text-[22px] font-bold tracking-tight leading-tight mb-2"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif", color: "var(--nxt-fg)" }}
              >
                5+ models. One place.
              </h3>
              <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--nxt-fg-dim)" }}>
                Claude, GPT-4, Gemini, Grok, DeepSeek. Switch providers in a tap.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Claude", "GPT-4", "Gemini", "Grok", "DeepSeek"].map((m, i) => {
                  const cs = ["#5EEAD4","#10B981","#6366F1","#F59E0B","#EC4899"];
                  return (
                    <span
                      key={m}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium"
                      style={{
                        background: `${cs[i]}10`,
                        border: `1px solid ${cs[i]}25`,
                        color: isLight ? "var(--nxt-fg)" : cs[i],
                      }}
                    >
                      {m}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Card 5: Private & Exclusive ── */}
          <div
            className="rounded-3xl p-6 sm:p-7 relative overflow-hidden glow-hover"
            style={{
              background: isLight
                ? "linear-gradient(145deg, #FBFAF6 0%, #F4EFE0 100%)"
                : "linear-gradient(145deg, rgba(48,48,56,0.85) 0%, rgba(30,30,36,0.90) 100%)",
              border: `1px solid ${isLight ? "rgba(26,26,31,0.08)" : "rgba(255,255,255,0.07)"}`,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
            data-testid="bento-private"
          >
            <div
              aria-hidden
              className="absolute bottom-0 right-0 w-36 h-36 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 100% 100%, rgba(52,211,153,0.10) 0%, transparent 70%)",
              }}
            />
            <div className="relative">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-2xl mb-4"
                style={{
                  background: isLight ? "rgba(52,211,153,0.12)" : "rgba(52,211,153,0.10)",
                  border: "1px solid rgba(52,211,153,0.22)",
                }}
              >
                <Lock size={16} style={{ color: "#34D399" }} />
              </div>
              <span className="mono text-[10px] tracking-[0.32em] uppercase" style={{ color: "var(--nxt-fg-faint)" }}>
                PRIVATE · EXCLUSIVE
              </span>
              <h3
                className="mt-1.5 text-[20px] sm:text-[22px] font-bold tracking-tight leading-tight mb-2"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif", color: "var(--nxt-fg)" }}
              >
                Invite-only. Yours.
              </h3>
              <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--nxt-fg-dim)" }}>
                Built in the United States. Your builds stay private. No public exposure.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                   style={{
                     background: "rgba(52,211,153,0.10)",
                     border: "1px solid rgba(52,211,153,0.22)",
                   }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 nxt-pulse" />
                <span className="mono text-[10px] tracking-[0.22em] uppercase font-medium" style={{ color: "#34D399" }}>
                  Made in the USA
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          AGENT MARQUEE
      ══════════════════════════════════════════════════ */}
      <div className="relative z-10">
        <AgentMarquee isLight={isLight} />
      </div>

      {/* ══════════════════════════════════════════════════
          PROMPT → DEPLOY FLOW
      ══════════════════════════════════════════════════ */}
      <div id="flow" className="scroll-mt-20 relative z-10">
        <PromptToDeployFlow />
      </div>

      {/* ══════════════════════════════════════════════════
          DEMOS
      ══════════════════════════════════════════════════ */}
      <div id="features" className="scroll-mt-20 relative z-10">
        <HomepageDemos />
      </div>

      {/* ══════════════════════════════════════════════════
          SHIP ANYTHING GRID
      ══════════════════════════════════════════════════ */}
      <section
        id="ship"
        className="scroll-mt-20 relative z-10 mx-auto max-w-[1080px] px-5 sm:px-6 py-14 sm:py-20"
        data-testid="landing-capability-strip"
      >
        <div className="text-center mb-10">
          <span
            className="mono text-[10px] sm:text-[10.5px] tracking-[0.40em] uppercase"
            style={{ color: "var(--nxt-fg-faint)" }}
          >
            WHAT YOU CAN SHIP
          </span>
          <h2
            className="mt-3 text-[26px] sm:text-[36px] lg:text-[42px] leading-[1.05] tracking-[-0.025em] font-bold"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif", color: "var(--nxt-fg)" }}
          >
            Built for founders who ship.
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {SHIP_ITEMS.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl px-4 py-4 sm:py-5 flex items-center gap-3 glow-hover"
              style={{
                background: isLight ? "rgba(26,26,31,0.04)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isLight ? "rgba(26,26,31,0.08)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: isLight ? "rgba(94,234,212,0.12)" : "rgba(94,234,212,0.08)",
                  border: "1px solid rgba(94,234,212,0.18)",
                }}
              >
                <Icon size={13} style={{ color: "#5EEAD4" }} />
              </div>
              <span
                className="text-[12.5px] sm:text-[13.5px] font-medium tracking-tight"
                style={{ color: "var(--nxt-fg)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          AGENTS SECTION
      ══════════════════════════════════════════════════ */}
      <section
        id="agents"
        className="scroll-mt-20 relative z-10 mx-auto max-w-[1080px] px-5 sm:px-6 py-14 sm:py-20"
        data-testid="landing-agents-teaser"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span
              className="mono text-[10px] sm:text-[10.5px] tracking-[0.40em] uppercase"
              style={{ color: "var(--nxt-fg-faint)" }}
            >
              AGENTS LIBRARY
            </span>
            <h2
              className="mt-3 text-[28px] sm:text-[38px] lg:text-[44px] leading-[1.05] tracking-[-0.025em] font-bold"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              <span style={{ color: "var(--nxt-fg)" }}>Pick an agent.</span>{" "}
              <span
                style={{
                  background: headingFadeGrad,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Tell it what to do.
              </span>
            </h2>
            <p
              className="mt-4 text-[14px] sm:text-[15px] leading-relaxed max-w-[480px]"
              style={{ color: "var(--nxt-fg-dim)" }}
            >
              191 specialised AI agents — backend architects, security auditors,
              test automators, DevOps responders — plus 52 personal-assistant
              skills. All browsable from a single workspace surface.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate(authed ? "/workspace/agents" : "/signin?return=/workspace/agents")}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-[13.5px] font-semibold tracking-tight transition-all hover:-translate-y-0.5"
                style={{
                  background: isLight ? "#1F1F23" : "#FFFFFF",
                  color: isLight ? "#FAFAFA" : "#1F1F23",
                  boxShadow: isLight
                    ? "0 10px 28px -10px rgba(31,31,35,0.30)"
                    : "0 10px 28px -10px rgba(255,255,255,0.40)",
                }}
                data-testid="landing-agents-cta"
              >
                Open agents library <ArrowRight size={13} />
              </button>
              <span
                className="inline-flex items-center mono text-[10.5px] tracking-[0.22em] uppercase"
                style={{ color: "var(--nxt-fg-faint)" }}
              >
                Workspace · Auth required
              </span>
            </div>
          </div>

          {/* Agent chip grid */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {[
              { name: "backend-architect",     hint: "Service design"   },
              { name: "security-auditor",      hint: "OWASP review"     },
              { name: "frontend-developer",    hint: "UI components"    },
              { name: "test-automator",        hint: "Coverage + CI"    },
              { name: "devops-troubleshooter", hint: "Incident triage"  },
              { name: "code-reviewer",         hint: "Refactor"         },
              { name: "github",                hint: "Personal skill"   },
              { name: "notion",                hint: "Personal skill"   },
            ].map((a) => (
              <div
                key={a.name}
                className="rounded-2xl px-3.5 py-3.5 glow-hover"
                style={{
                  background: isLight ? "rgba(26,26,31,0.04)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isLight ? "rgba(26,26,31,0.08)" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <div
                  className="font-mono text-[11.5px] sm:text-[12px] truncate font-medium"
                  style={{ color: "var(--nxt-fg)" }}
                >
                  {a.name}
                </div>
                <div
                  className="text-[10.5px] mt-0.5"
                  style={{ color: "var(--nxt-fg-faint)" }}
                >
                  {a.hint}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MODELS SHOWCASE
      ══════════════════════════════════════════════════ */}
      <div id="showcase" className="scroll-mt-20 relative z-10">
        <LandingShowcase />
      </div>

      {/* ══════════════════════════════════════════════════
          FULL-WIDTH CTA STRIP
      ══════════════════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-[1080px] px-5 sm:px-6 py-10 pb-16 sm:pb-20">
        <div
          className="relative rounded-3xl overflow-hidden px-6 sm:px-14 py-12 sm:py-16 text-center"
          style={{
            background: isLight
              ? "linear-gradient(135deg, rgba(20,130,110,0.12) 0%, rgba(181,131,32,0.08) 50%, rgba(194,90,31,0.10) 100%), var(--nxt-surface-soft)"
              : "linear-gradient(135deg, rgba(94,234,212,0.08) 0%, rgba(99,102,241,0.06) 50%, rgba(245,158,11,0.06) 100%), rgba(36,36,40,0.55)",
            border: `1px solid ${isLight ? "rgba(26,26,31,0.08)" : "rgba(255,255,255,0.07)"}`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
          data-testid="landing-cta-strip"
        >
          {/* Background orb */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(70% 70% at 50% 0%, rgba(94,234,212,0.07) 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <div
              className="mono text-[10px] sm:text-[10.5px] tracking-[0.38em] uppercase font-medium bg-clip-text text-transparent mb-3"
              style={{ backgroundImage: rainbowGrad }}
            >
              DISCOVER · DEVELOP · DELIVER
            </div>
            <h2
              className="text-[28px] sm:text-[42px] leading-[1.05] font-bold tracking-[-0.025em] mb-3"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif", color: "var(--nxt-fg)" }}
            >
              Ready to build your next idea?
            </h2>
            <p
              className="text-[14px] sm:text-[15.5px] mb-8 max-w-[440px] mx-auto leading-relaxed"
              style={{ color: "var(--nxt-fg-dim)" }}
            >
              Join a select group of founders building real software with AI. Invite-only access.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="inline-flex items-center gap-2 h-12 px-7 rounded-full text-[14px] font-semibold tracking-tight transition-all hover:-translate-y-0.5 group"
                style={{
                  background: isLight ? "#1F1F23" : "#FFFFFF",
                  color: isLight ? "#FAFAFA" : "#1F1F23",
                  boxShadow: isLight
                    ? "0 12px 32px -10px rgba(31,31,35,0.35)"
                    : "0 12px 32px -10px rgba(255,255,255,0.50)",
                }}
                data-testid="landing-cta-button"
              >
                Request access
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={() => navigate("/signin")}
                className="inline-flex items-center gap-2 h-12 px-6 rounded-full text-[14px] font-medium tracking-tight transition-all hover:opacity-80"
                style={{ color: "var(--nxt-fg-dim)" }}
              >
                Sign in
              </button>
            </div>
            {/* Jwood signature */}
            <div
              className="mt-8 flex items-center justify-center gap-2.5"
              data-testid="landing-jwood-signature"
            >
              <span className="h-px w-8" style={{ background: "var(--nxt-border-soft)" }} />
              <span
                className="mono text-[10px] tracking-[0.30em] uppercase"
                style={{ color: "var(--nxt-fg-faint)" }}
              >
                A product of{" "}
                <span style={{ color: "var(--nxt-fg-dim)", fontWeight: 600 }}>
                  Jwood Technologies
                </span>
              </span>
              <span className="h-px w-8" style={{ background: "var(--nxt-border-soft)" }} />
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
