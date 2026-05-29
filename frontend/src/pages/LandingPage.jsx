/**
 * NXT1 — Landing Page (Space Travel Redesign)
 *
 * Cinematic overhaul: looping video backgrounds with rAF-driven crossfade,
 * liquid-glass design system, Instrument Serif italic + Barlow typography,
 * and Framer Motion entrance animations.
 *
 * Core NXT1 branding is preserved:
 *   • NXT1 wordmark (Brand component)
 *   • DISCOVER · DEVELOP · DELIVER tagline
 *   • "A private platform for founders…" subtitle
 *   • Prompt cockpit — the primary build surface
 *   • Jwood Technologies attribution
 *   • Agents library + Models showcase
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Sparkles, Layers, Globe, Smartphone, Puzzle, Bot, Rocket, Cpu } from "lucide-react";
import Brand from "@/components/Brand";
import ModelPickerCockpit from "@/components/premium/ModelPickerCockpit";
import LandingShowcase from "@/components/landing/LandingShowcase";
import PublicFooter from "@/components/PublicFooter";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import { isAuthenticated } from "@/lib/auth";

// ─── Video sources ────────────────────────────────────────────────────────────
const HERO_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4";
const CAPS_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4";

// ─── Build modes ──────────────────────────────────────────────────────────────
const MODES = [
  { key: "fullstack", label: "Full Stack", icon: Layers },
  { key: "website",   label: "Website",    icon: Globe },
  { key: "mobile",    label: "Mobile",     icon: Smartphone },
  { key: "extension", label: "Extension",  icon: Puzzle },
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

// ─── Capability cards ─────────────────────────────────────────────────────────
const CAPS = [
  {
    title: "AI Agents",
    body: "191 specialised agents — backend architects, security auditors, test automators, DevOps responders — answering through whichever provider you choose.",
    tags: ["Backend", "Security", "DevOps", "Testing"],
    Icon: Bot,
  },
  {
    title: "Rapid Deploy",
    body: "From prompt to production in minutes. One-click hosting, automatic SSL, CI/CD wiring, and zero infrastructure overhead. You build; we ship it.",
    tags: ["One-Click", "Auto-SSL", "CI/CD", "Zero Ops"],
    Icon: Rocket,
  },
  {
    title: "Multi-Model",
    body: "Every major AI provider in a single interface. Claude, GPT-4, Gemini, Grok, DeepSeek — connect your own keys and switch models per task.",
    tags: ["Claude", "GPT-4", "Gemini", "DeepSeek"],
    Icon: Cpu,
  },
];

// ─── Typography shortcuts ────────────────────────────────────────────────────
const FONT_HEADING = { fontFamily: "'Instrument Serif', serif", fontStyle: "italic" };
const FONT_BODY    = { fontFamily: "'Barlow', sans-serif" };

// ─── Typed placeholder hook ───────────────────────────────────────────────────
function useTypedPlaceholder(cycle, { isPaused }) {
  const [text, setText] = useState("");
  const stateRef = useRef({ i: 0, phase: "typing", cursor: 0 });

  useEffect(() => {
    if (isPaused) return;
    let mounted = true;
    let timer;
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
      } else {
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
    timer = setTimeout(tick, 600);
    return () => { mounted = false; clearTimeout(timer); };
  }, [cycle, isPaused]);

  return text;
}

// ─── FadingVideo — rAF crossfade looper (no CSS transitions) ─────────────────
function FadingVideo({ src, className, style }) {
  const videoRef  = useRef(null);
  const rafRef    = useRef(null);
  const fadingRef = useRef(false);
  const FADE_MS   = 500;
  const LEAD_S    = 0.55;

  const fadeTo = useCallback((target) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const v = videoRef.current;
    if (!v) return;
    const t0   = performance.now();
    const from = parseFloat(v.style.opacity) || 0;
    const step = (now) => {
      const p = Math.min((now - t0) / FADE_MS, 1);
      v.style.opacity = from + (target - from) * p;
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.style.opacity = "0";

    const onLoaded = () => {
      v.style.opacity = "0";
      v.play().catch(() => {});
      fadeTo(1);
    };
    const onTime = () => {
      if (!fadingRef.current && v.duration > 0) {
        const rem = v.duration - v.currentTime;
        if (rem <= LEAD_S && rem > 0) { fadingRef.current = true; fadeTo(0); }
      }
    };
    const onEnd = () => {
      v.style.opacity = "0";
      setTimeout(() => {
        v.currentTime = 0;
        v.play().catch(() => {});
        fadingRef.current = false;
        fadeTo(1);
      }, 100);
    };

    v.addEventListener("loadeddata", onLoaded);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended",      onEnd);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      v.removeEventListener("loadeddata", onLoaded);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended",      onEnd);
    };
  }, [fadeTo]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      playsInline
      preload="auto"
      className={className}
      style={{ opacity: 0, ...style }}
    />
  );
}

// ─── BlurText — word-by-word reveal animation ────────────────────────────────
function BlurText({ text, className, style }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { amount: 0.1, once: true });

  return (
    <p
      ref={ref}
      className={className}
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", rowGap: "0.1em", ...style }}
    >
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={inView ? {
            filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
            opacity: [0, 0.5, 1],
            y:      [50, -5, 0],
          } : {}}
          transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut", times: [0, 0.5, 1] }}
          style={{ display: "inline-block", marginRight: "0.28em" }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

// ─── CapabilityCard ───────────────────────────────────────────────────────────
function CapabilityCard({ title, body, tags, Icon }) {
  return (
    <div className="liquid-glass rounded-[1.25rem] p-6 flex flex-col" style={{ minHeight: 360 }}>
      <div className="flex items-start justify-between gap-4">
        <div className="liquid-glass w-11 h-11 rounded-[0.75rem] flex items-center justify-center shrink-0">
          <Icon size={22} color="white" strokeWidth={1.5} />
        </div>
        <div className="flex flex-wrap justify-end gap-1.5" style={{ maxWidth: "65%" }}>
          {tags.map((tag) => (
            <span
              key={tag}
              className="liquid-glass rounded-full px-3 py-1 text-[11px] whitespace-nowrap"
              style={{ color: "rgba(255,255,255,0.9)", ...FONT_BODY }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-1" />
      <div className="mt-6">
        <h3 style={{ ...FONT_HEADING, fontSize: "2.25rem", letterSpacing: "-1px", lineHeight: 1, color: "#fff" }}>
          {title}
        </h3>
        <p
          className="mt-3 text-sm leading-snug"
          style={{ color: "rgba(255,255,255,0.85)", ...FONT_BODY, fontWeight: 300, maxWidth: "32ch" }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

// ─── Inline SVG icons for stat cards ─────────────────────────────────────────
function ClockIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate    = useNavigate();
  const [authed,   setAuthed]   = useState(false);
  const [draft,    setDraft]    = useState("");
  const [mode,     setMode]     = useState("fullstack");
  const [provider, setProvider] = useState("anthropic");
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
    try { window.localStorage.setItem("nxt1_draft_prompt", val); } catch { /* ignore */ }
  };

  const onBuild = () => {
    const v = (draft || "").trim();
    if (!v) { textareaRef.current?.focus(); return; }
    try { window.localStorage.setItem("nxt1_draft_prompt", v); } catch { /* ignore */ }
    navigate(`${authed ? "/workspace" : "/signup"}?prompt=${encodeURIComponent(v)}&mode=${mode}&return=/dashboard`);
  };

  // Framer Motion entrance preset
  const fade = (delay) => ({
    initial:    { filter: "blur(10px)", opacity: 0, y: 20 },
    animate:    { filter: "blur(0px)",  opacity: 1, y: 0  },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  });

  return (
    <div
      data-landing
      data-testid="landing-page"
      style={{ background: "#000", color: "#fff", minHeight: "100vh" }}
    >
      {/* ════════════════════════════════════════════════════════════════
          SECTION 1 — HERO  (full viewport · space travel video bg)
          ════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: "100vh", background: "#000" }}>

        {/* Background video — 120% w/h, focal point at the top of frame */}
        <FadingVideo
          src={HERO_VIDEO}
          className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0"
          style={{ width: "120%", height: "120%" }}
        />

        {/* Content layer */}
        <div className="relative z-10 flex flex-col" style={{ minHeight: "100vh" }}>

          {/* ── Navbar (fixed) ─────────────────────────────────────── */}
          <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-8 lg:px-16 pt-4">
            <div className="flex items-center justify-between max-w-screen-xl mx-auto">

              {/* Logo pill */}
              <div className="liquid-glass w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                <Brand size="sm" gradient />
              </div>

              {/* Center pill — desktop nav + CTA */}
              <nav className="hidden md:flex items-center liquid-glass rounded-full px-1.5 py-1.5">
                {[
                  { label: "How it Works", id: "flow"     },
                  { label: "Build",        id: "build"    },
                  { label: "Ship",         id: "ship"     },
                  { label: "Agents",       id: "agents"   },
                  { label: "Models",       id: "showcase" },
                ].map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="px-3 py-2 text-sm font-medium rounded-full hover:bg-white/5 transition-colors whitespace-nowrap"
                    style={{ color: "rgba(255,255,255,0.9)", ...FONT_BODY }}
                  >
                    {s.label}
                  </a>
                ))}
                <button
                  onClick={() => navigate(authed ? "/workspace" : "/signup")}
                  className="ml-1 flex items-center gap-1.5 bg-white text-black text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap hover:bg-white/90 transition-colors"
                  style={FONT_BODY}
                >
                  {authed ? "Open Workspace" : "Request Access"}
                  <ArrowUpRight size={14} />
                </button>
              </nav>

              {/* Right — theme switcher + auth link */}
              <div className="flex items-center gap-2">
                <ThemeSwitcher />
                {authed ? (
                  <button
                    onClick={() => navigate("/workspace")}
                    className="text-sm px-3 py-2 rounded-full transition-colors hover:bg-white/5"
                    style={{ color: "rgba(255,255,255,0.8)", ...FONT_BODY }}
                  >
                    Workspace <ArrowUpRight size={13} className="inline" />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/signin")}
                    className="text-sm px-3 py-2 rounded-full transition-colors hover:bg-white/5"
                    style={{ color: "rgba(255,255,255,0.8)", ...FONT_BODY }}
                    data-testid="nav-signin-button"
                  >
                    Sign in
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* ── Hero body ──────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 pt-28 pb-6">

            {/* Badge */}
            <motion.div {...fade(0.4)} className="mb-6">
              <div className="liquid-glass rounded-full flex items-center gap-2 pl-1.5 pr-4 py-1.5">
                <span
                  className="bg-white text-black px-3 py-1 text-xs font-semibold rounded-full"
                  style={FONT_BODY}
                >
                  New
                </span>
                <span
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.9)", ...FONT_BODY }}
                >
                  Private AI Build Platform — V0.6 Now Live
                </span>
              </div>
            </motion.div>

            {/* Headline — word-by-word blur reveal */}
            <BlurText
              text="Build Software. Ship it to the World."
              className="max-w-3xl text-center mb-5"
              style={{
                ...FONT_HEADING,
                fontSize: "clamp(2.6rem, 7vw, 5.5rem)",
                lineHeight: 0.9,
                letterSpacing: "-3px",
                color: "#fff",
              }}
            />

            {/* Subheading */}
            <motion.p
              {...fade(0.8)}
              className="text-sm md:text-base max-w-xl text-center font-light leading-relaxed mb-8"
              style={{ color: "rgba(255,255,255,0.72)", ...FONT_BODY }}
            >
              A private platform for founders building software — quietly, on their own terms.
              Discover, develop, and deliver with AI-powered speed.
            </motion.p>

            {/* ── Prompt Cockpit ──────────────────────────────────── */}
            <motion.div
              {...fade(1.0)}
              className="w-full max-w-[760px] mx-auto mb-6"
              data-testid="landing-prompt-cockpit"
            >
              <div
                className="liquid-glass-strong rounded-[28px]"
                style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.52) 100%)" }}
              >
                <textarea
                  ref={textareaRef}
                  rows={3}
                  value={draft}
                  onChange={(e) => onDraftChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onBuild(); }
                  }}
                  placeholder={placeholder || "Describe what you want to build…"}
                  className="w-full bg-transparent outline-none resize-none leading-[1.55] tracking-tight px-6 pt-5 pb-3 placeholder:text-white/25"
                  style={{ color: "#fff", ...FONT_BODY, fontSize: "16px" }}
                  data-testid="landing-prompt-input"
                />

                {/* Mode pills */}
                <div className="px-3 sm:px-4 pt-1 pb-2">
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2" role="tablist" aria-label="Build type">
                    {MODES.map((m) => {
                      const Icon   = m.icon;
                      const active = mode === m.key;
                      return (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => setMode(m.key)}
                          data-testid={`landing-mode-${m.key}`}
                          role="tab"
                          aria-selected={active}
                          className="flex flex-col items-center justify-center gap-1.5 px-1 py-2.5 rounded-2xl transition-all duration-200"
                          style={active ? {
                            background: "linear-gradient(180deg, rgba(94,234,212,0.16) 0%, rgba(94,234,212,0.04) 100%)",
                            boxShadow: "inset 0 0 0 1px rgba(94,234,212,0.32)",
                            color: "#fff",
                          } : {
                            background: "rgba(255,255,255,0.04)",
                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.65)",
                          }}
                        >
                          <Icon
                            size={15}
                            strokeWidth={1.7}
                            style={{ color: active ? "#5EEAD4" : "rgba(255,255,255,0.65)" }}
                          />
                          <span
                            className="text-[11px] sm:text-[12px] font-medium tracking-tight whitespace-nowrap"
                            style={FONT_BODY}
                          >
                            {m.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action row — model picker + Build CTA */}
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
                    data-testid="landing-build-button"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold tracking-tight bg-white text-[#1F1F23] hover:bg-white/95 transition-all duration-200 shadow-[0_8px_28px_-10px_rgba(255,255,255,0.55)] hover:shadow-[0_14px_42px_-10px_rgba(255,255,255,0.75)] hover:-translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none shrink-0"
                    style={FONT_BODY}
                  >
                    <Sparkles size={13} />
                    Build
                  </button>
                </div>
              </div>

              {/* Keyboard hint */}
              <p
                className="mt-3 text-center text-[10px] tracking-[0.24em] uppercase"
                style={{ color: "rgba(255,255,255,0.25)", ...FONT_BODY }}
              >
                ⌘ + ↵ to build
              </p>

              {/* Suggestion chips */}
              <div
                className="mt-4 flex flex-wrap items-center justify-center gap-1.5"
                data-testid="landing-suggestion-chips"
              >
                {(MODE_SUGGESTIONS[mode] || []).map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => { onDraftChange(s.prompt); setTimeout(() => textareaRef.current?.focus(), 30); }}
                    className="liquid-glass inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-[11.5px] transition-colors hover:opacity-90"
                    style={{ color: "rgba(255,255,255,0.65)", ...FONT_BODY }}
                    data-testid={`landing-suggest-${s.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Sparkles size={10} style={{ color: "#5EEAD4" }} />
                    {s.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div {...fade(1.3)} className="flex items-stretch gap-4 flex-wrap justify-center">
              {[
                { icon: <ClockIcon />, value: "191+", label: "Specialized AI Agents" },
                { icon: <GlobeIcon />, value: "52",   label: "Personal Skill Integrations" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="liquid-glass p-5 rounded-[1.25rem] flex flex-col gap-3"
                  style={{ width: 210 }}
                >
                  {stat.icon}
                  <div>
                    <div style={{ ...FONT_HEADING, fontSize: "2.5rem", letterSpacing: "-1px", lineHeight: 1, color: "#fff" }}>
                      {stat.value}
                    </div>
                    <div className="text-xs font-light mt-2" style={{ color: "rgba(255,255,255,0.6)", ...FONT_BODY }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Partners / tagline row ─────────────────────────────── */}
          <motion.div {...fade(1.5)} className="flex flex-col items-center gap-4 pb-8 px-4">
            <div
              className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium"
              style={{ color: "rgba(255,255,255,0.85)", ...FONT_BODY }}
            >
              DISCOVER · DEVELOP · DELIVER — A product of Jwood Technologies
            </div>
            <div className="flex items-center gap-8 md:gap-14 flex-wrap justify-center">
              {["Claude", "GPT-4", "Gemini", "Grok", "DeepSeek"].map((name) => (
                <span
                  key={name}
                  style={{ ...FONT_HEADING, fontSize: "1.75rem", color: "rgba(255,255,255,0.65)", letterSpacing: "-0.5px" }}
                >
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 2 — CAPABILITIES  (space video 2, full-bleed)
          ════════════════════════════════════════════════════════════════ */}
      <section
        id="build"
        className="relative overflow-hidden scroll-mt-20"
        style={{ minHeight: "100vh", background: "#000" }}
      >
        <FadingVideo
          src={CAPS_VIDEO}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Serve both "How it Works" and "flow" anchors from this section */}
        <span id="flow" className="absolute top-0" style={{ visibility: "hidden" }} />

        <div
          className="relative z-10 flex flex-col px-8 md:px-16 lg:px-20 pt-24 pb-10"
          style={{ minHeight: "100vh" }}
        >
          {/* Section label + heading */}
          <div className="mb-auto">
            <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.72)", ...FONT_BODY }}>
              // Capabilities
            </p>
            <h2
              style={{
                ...FONT_HEADING,
                fontSize: "clamp(3rem, 8vw, 6rem)",
                letterSpacing: "-3px",
                lineHeight: 0.9,
                color: "#fff",
              }}
            >
              Build<br />evolved
            </h2>
          </div>

          {/* Capability cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {CAPS.map((c) => <CapabilityCard key={c.title} {...c} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          SECTION 3 — AGENTS LIBRARY
          ════════════════════════════════════════════════════════════════ */}
      <section
        id="agents"
        className="relative py-20 px-5 sm:px-8 scroll-mt-20"
        style={{ background: "#000" }}
      >
        {/* Subtle ambient glow */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(94,234,212,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-[1080px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Copy */}
            <div>
              <p
                className="text-xs tracking-[0.42em] uppercase font-medium mb-4"
                style={{ color: "rgba(255,255,255,0.32)", ...FONT_BODY }}
              >
                AGENTS LIBRARY
              </p>
              <h2
                className="mb-4"
                style={{ ...FONT_HEADING, fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "-1px", lineHeight: 1.05, color: "#fff" }}
              >
                Pick an agent. Tell it what to do.
              </h2>
              <p
                className="text-sm leading-relaxed max-w-[460px] mb-6"
                style={{ color: "rgba(255,255,255,0.52)", ...FONT_BODY, fontWeight: 300 }}
              >
                191 specialised AI agents (backend architects, security auditors,
                test automators, DevOps responders) plus 52 personal-assistant
                skills (GitHub, Notion, iMessage, Apple Notes, Whisper). All
                browsable from a single workspace surface — connect your own
                keys and they answer through whichever provider you choose.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate(authed ? "/workspace/agents" : "/signin?return=/workspace/agents")}
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-sm font-semibold tracking-tight transition-all hover:-translate-y-0.5 bg-white"
                  style={{ color: "#1F1F23", ...FONT_BODY }}
                  data-testid="landing-agents-cta"
                >
                  Open agents library <ArrowUpRight size={14} />
                </button>
                <span
                  className="text-[11px] tracking-[0.22em] uppercase"
                  style={{ color: "rgba(255,255,255,0.25)", ...FONT_BODY }}
                >
                  Workspace · Auth required
                </span>
              </div>
            </div>

            {/* Agent chip grid */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {[
                { name: "backend-architect",     hint: "Service design" },
                { name: "security-auditor",      hint: "OWASP review" },
                { name: "frontend-developer",    hint: "UI components" },
                { name: "test-automator",        hint: "Coverage + CI" },
                { name: "devops-troubleshooter", hint: "Incident triage" },
                { name: "code-reviewer",         hint: "Refactor" },
                { name: "github",                hint: "Personal skill" },
                { name: "notion",                hint: "Personal skill" },
              ].map((a) => (
                <div key={a.name} className="liquid-glass rounded-xl px-3 py-3">
                  <div className="font-mono text-[12px] truncate" style={{ color: "#fff" }}>{a.name}</div>
                  <div className="text-[10.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.42)", ...FONT_BODY }}>
                    {a.hint}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Anchors for "ship" and "showcase" nav links */}
      <span id="ship" style={{ display: "block", visibility: "hidden" }} />

      {/* ════════════════════════════════════════════════════════════════
          MODELS SHOWCASE (LandingShowcase — existing component)
          ════════════════════════════════════════════════════════════════ */}
      <div id="showcase" className="scroll-mt-20">
        <LandingShowcase />
      </div>

      <PublicFooter />
    </div>
  );
}
