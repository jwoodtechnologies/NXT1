/**
 * NXT1 — Landing Page (Space Travel Redesign v2)
 *
 * Changes from v1:
 *   - Page is always dark (black body override; no theme switcher in nav)
 *   - Navbar: no glass bubble around logo; full-width dark-glass bar
 *   - Stats cards: side-by-side on all screens (flex-row, flex-1)
 *   - Prompt cockpit: redesigned for mobile — horizontal-scroll mode pills,
 *     cleaner single-row textarea sizing
 *   - LandingShowcase (Powered by / Preview Live / How it Works) removed
 *   - Partners row: shorter copy, smaller provider names on mobile
 *   - DISCOVER · DEVELOP · DELIVER moved to footer
 */
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight, Sparkles, Layers, Globe, Smartphone, Puzzle, Bot, Rocket, Cpu } from "lucide-react";
import Brand from "@/components/Brand";
import PublicFooter from "@/components/PublicFooter";
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

// ─── Video URL for CTA section ───────────────────────────────────────────────
const CTA_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4";

// ─── Typography shortcuts ─────────────────────────────────────────────────────
const FONT_HEADING = { fontFamily: "'Instrument Serif', serif", fontStyle: "italic" };
const FONT_BODY    = { fontFamily: "'Barlow', sans-serif" };

// ─── Scroll-direction hook — hides nav on scroll-down, reveals on scroll-up ──
function useNavVisible() {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80)               setVisible(true);
      else if (y > lastY.current + 8)  setVisible(false);
      else if (y < lastY.current - 5)  setVisible(true);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return visible;
}

// ─── Typed placeholder ────────────────────────────────────────────────────────
function useTypedPlaceholder(cycle, { isPaused }) {
  const [text, setText] = useState("");
  const stateRef = useRef({ i: 0, phase: "typing", cursor: 0 });
  useEffect(() => {
    if (isPaused) return;
    let mounted = true, timer;
    const tick = () => {
      if (!mounted) return;
      const s = stateRef.current;
      const target = cycle[s.i % cycle.length];
      if (s.phase === "typing") {
        if (s.cursor < target.length) { s.cursor++; setText(target.slice(0, s.cursor)); timer = setTimeout(tick, 28 + Math.random() * 30); }
        else { s.phase = "hold"; timer = setTimeout(tick, 1700); }
      } else if (s.phase === "hold") { s.phase = "erasing"; timer = setTimeout(tick, 20); }
      else {
        if (s.cursor > 0) { s.cursor--; setText(target.slice(0, s.cursor)); timer = setTimeout(tick, 14); }
        else { s.i++; s.phase = "typing"; timer = setTimeout(tick, 220); }
      }
    };
    timer = setTimeout(tick, 600);
    return () => { mounted = false; clearTimeout(timer); };
  }, [cycle, isPaused]);
  return text;
}

// ─── FadingVideo ──────────────────────────────────────────────────────────────
function FadingVideo({ src, className, style }) {
  const videoRef  = useRef(null);
  const rafRef    = useRef(null);
  const fadingRef = useRef(false);

  const fadeTo = useCallback((target) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const v = videoRef.current;
    if (!v) return;
    const t0 = performance.now(), from = parseFloat(v.style.opacity) || 0;
    const step = (now) => {
      const p = Math.min((now - t0) / 500, 1);
      v.style.opacity = from + (target - from) * p;
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.style.opacity = "0";
    const onLoaded = () => { v.style.opacity = "0"; v.play().catch(() => {}); fadeTo(1); };
    const onTime   = () => {
      if (!fadingRef.current && v.duration > 0) {
        const rem = v.duration - v.currentTime;
        if (rem <= 0.55 && rem > 0) { fadingRef.current = true; fadeTo(0); }
      }
    };
    const onEnd = () => {
      v.style.opacity = "0";
      setTimeout(() => { v.currentTime = 0; v.play().catch(() => {}); fadingRef.current = false; fadeTo(1); }, 100);
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
    <video ref={videoRef} src={src} autoPlay muted playsInline preload="auto"
      className={className} style={{ opacity: 0, ...style }} />
  );
}

// ─── BlurText ────────────────────────────────────────────────────────────────
function BlurText({ text, className, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.1, once: true });
  return (
    <p ref={ref} className={className}
      style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", rowGap: "0.1em", ...style }}>
      {text.split(" ").map((word, i) => (
        <motion.span key={i}
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={inView ? { filter: ["blur(10px)", "blur(5px)", "blur(0px)"], opacity: [0, 0.5, 1], y: [50, -5, 0] } : {}}
          transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut", times: [0, 0.5, 1] }}
          style={{ display: "inline-block", marginRight: "0.28em" }}>
          {word}
        </motion.span>
      ))}
    </p>
  );
}

// ─── CapabilityCard ───────────────────────────────────────────────────────────
function CapabilityCard({ title, body, tags, Icon }) {
  return (
    <div className="liquid-glass rounded-[1.25rem] p-6 flex flex-col" style={{ minHeight: 340 }}>
      <div className="flex items-start justify-between gap-4">
        <div className="liquid-glass w-11 h-11 rounded-[0.75rem] flex items-center justify-center shrink-0">
          <Icon size={22} color="white" strokeWidth={1.5} />
        </div>
        <div className="flex flex-wrap justify-end gap-1.5" style={{ maxWidth: "65%" }}>
          {tags.map((tag) => (
            <span key={tag} className="liquid-glass rounded-full px-3 py-1 text-[11px] whitespace-nowrap"
              style={{ color: "rgba(255,255,255,0.88)", ...FONT_BODY }}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="flex-1" />
      <div className="mt-6">
        <h3 style={{ ...FONT_HEADING, fontSize: "2.1rem", letterSpacing: "-1px", lineHeight: 1, color: "#fff" }}>
          {title}
        </h3>
        <p className="mt-3 text-sm leading-snug"
          style={{ color: "rgba(255,255,255,0.82)", ...FONT_BODY, fontWeight: 300, maxWidth: "32ch" }}>
          {body}
        </p>
      </div>
    </div>
  );
}

// ─── Stat card icons ──────────────────────────────────────────────────────────
function ClockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// ─── Cinematic CTA Section — before footer ────────────────────────────────────
function CinematicCTASection({ authed, onAction }) {
  return (
    <section className="relative overflow-hidden" style={{
      minHeight: "85vh",
      background: "radial-gradient(ellipse 100% 65% at 50% 50%, #0d1b35 0%, #070f1e 45%, #030609 80%, #000 100%)",
    }}>
      {/* Video — shifted down 17% so the top of the frame is focal point */}
      <FadingVideo
        src={CTA_VIDEO}
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ transform: "translateY(17%)" }}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 z-[1]" style={{ background: "rgba(0,0,0,0.52)" }} />
      {/* Bottom fade to black so it bleeds into footer */}
      <div className="absolute bottom-0 inset-x-0 z-[2] h-32"
        style={{ background: "linear-gradient(to bottom, transparent, #000)" }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-5 sm:px-8"
        style={{ minHeight: "85vh" }}>

        {/* Discover · Develop · Deliver */}
        <div className="liquid-glass rounded-full px-4 py-1.5 mb-8"
          style={{ ...FONT_BODY, fontSize: "11px", letterSpacing: "0.32em", color: "rgba(255,255,255,0.75)", textTransform: "uppercase" }}>
          Discover · Develop · Deliver
        </div>

        {/* Headline */}
        <h2 className="max-w-2xl mb-5 text-white"
          style={{
            ...FONT_HEADING,
            fontSize: "clamp(2.6rem, 6vw, 5rem)",
            lineHeight: 0.93,
            letterSpacing: "-2px",
          }}>
          Your next build is one prompt away.
        </h2>

        {/* Subtitle */}
        <p className="max-w-md mb-10 font-light"
          style={{ color: "rgba(255,255,255,0.62)", ...FONT_BODY, fontSize: "clamp(0.875rem, 2vw, 1rem)", lineHeight: 1.65 }}>
          NXT1 gives you 191 AI agents, every major model, and one‑click deploy —
          all in one private platform built for founders who ship.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            onClick={onAction}
            className="liquid-glass-strong inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={FONT_BODY}>
            {authed ? "Open Workspace" : "Request Early Access"} <ArrowUpRight size={15} />
          </button>
          <span style={{ ...FONT_BODY, fontSize: "11px", color: "rgba(255,255,255,0.28)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            A product of Jwood Technologies
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const navigate    = useNavigate();
  const navVisible  = useNavVisible();
  const [authed,   setAuthed]   = useState(false);
  const [draft,    setDraft]    = useState("");
  const [mode,     setMode]     = useState("fullstack");
  const textareaRef = useRef(null);
  const placeholder = useTypedPlaceholder(PLACEHOLDER_CYCLE, { isPaused: !!draft });

  useEffect(() => {
    setAuthed(isAuthenticated());
    try { const s = window.localStorage.getItem("nxt1_draft_prompt") || ""; if (s) setDraft(s); } catch {}
    setTimeout(() => textareaRef.current?.focus(), 80);

    // Lock landing page to always-black background regardless of theme setting
    const prev = document.body.style.background;
    document.body.style.background = "#000";
    return () => { document.body.style.background = prev; };
  }, []);

  const onDraftChange = (val) => {
    setDraft(val);
    try { window.localStorage.setItem("nxt1_draft_prompt", val); } catch {}
  };

  const onBuild = () => {
    const v = (draft || "").trim();
    if (!v) { textareaRef.current?.focus(); return; }
    try { window.localStorage.setItem("nxt1_draft_prompt", v); } catch {}
    navigate(`${authed ? "/workspace" : "/signup"}?prompt=${encodeURIComponent(v)}&mode=${mode}&return=/dashboard`);
  };

  const fade = (delay) => ({
    initial:    { filter: "blur(10px)", opacity: 0, y: 20 },
    animate:    { filter: "blur(0px)",  opacity: 1, y: 0  },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  });

  return (
    <div data-landing data-testid="landing-page" style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>

      {/* ════════════════════════════════════════════════════════════
          HERO  — full viewport, space travel video
          ════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse 120% 80% at 40% 0%, #0d1b3e 0%, #07111e 50%, #010408 90%, #000 100%)",
      }}>

        <FadingVideo
          src={HERO_VIDEO}
          className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0"
          style={{ width: "120%", height: "120%" }}
        />

        <div className="relative z-10 flex flex-col" style={{ minHeight: "100vh" }}>

          {/* ── Navbar — hides on scroll-down, reveals on scroll-up ── */}
          <header
            className="fixed top-0 inset-x-0 z-50 transition-transform duration-300"
            style={{
              transform: navVisible ? "translateY(0)" : "translateY(-100%)",
              background: "rgba(0,0,0,0.38)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
          >
            <div className="flex items-center justify-between px-4 sm:px-8 lg:px-16 py-3 max-w-screen-xl mx-auto">

              {/* Logo — no bubble, just the wordmark */}
              <Brand size="md" gradient />

              {/* Desktop center pill nav */}
              <nav className="hidden md:flex items-center liquid-glass rounded-full px-1.5 py-1.5">
                {[
                  { label: "How it Works", id: "flow"   },
                  { label: "Build",        id: "build"  },
                  { label: "Agents",       id: "agents" },
                ].map((s) => (
                  <a key={s.id} href={`#${s.id}`}
                    className="px-3 py-2 text-sm font-medium rounded-full hover:bg-white/5 transition-colors whitespace-nowrap"
                    style={{ color: "rgba(255,255,255,0.88)", ...FONT_BODY }}>
                    {s.label}
                  </a>
                ))}
                <button
                  onClick={() => navigate(authed ? "/workspace" : "/signup")}
                  className="ml-1 flex items-center gap-1.5 bg-white text-black text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap hover:bg-white/90 transition-colors"
                  style={FONT_BODY}>
                  {authed ? "Open Workspace" : "Request Access"}
                  <ArrowUpRight size={14} />
                </button>
              </nav>

              {/* Right — sign in (both screens) */}
              <div className="flex items-center gap-2">
                {authed ? (
                  <button onClick={() => navigate("/workspace")}
                    className="text-sm px-3 py-2 rounded-full hover:bg-white/5 transition-colors"
                    style={{ color: "rgba(255,255,255,0.8)", ...FONT_BODY }}>
                    Workspace <ArrowUpRight size={13} className="inline" />
                  </button>
                ) : (
                  <>
                    <button onClick={() => navigate("/signin")}
                      className="text-sm px-3 py-2 rounded-full hover:bg-white/5 transition-colors"
                      style={{ color: "rgba(255,255,255,0.75)", ...FONT_BODY }}
                      data-testid="nav-signin-button">
                      Sign in
                    </button>
                    {/* Mobile: compact Request Access */}
                    <button
                      onClick={() => navigate("/signup")}
                      className="md:hidden flex items-center gap-1 bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={FONT_BODY}>
                      Access <ArrowUpRight size={12} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* ── Hero body ──────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-6">

            {/* Badge */}
            <motion.div {...fade(0.4)} className="mb-5">
              <div className="liquid-glass rounded-full flex items-center gap-2 pl-1.5 pr-4 py-1.5">
                <span className="bg-white text-black px-2.5 py-0.5 text-xs font-semibold rounded-full" style={FONT_BODY}>New</span>
                <span className="text-xs sm:text-sm" style={{ color: "rgba(255,255,255,0.88)", ...FONT_BODY }}>
                  Private AI Build Platform — V0.6 Now Live
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <BlurText
              text="Build Software. Ship it to the World."
              className="max-w-3xl text-center mb-4"
              style={{
                ...FONT_HEADING,
                fontSize: "clamp(2.4rem, 6.5vw, 5.5rem)",
                lineHeight: 0.9,
                letterSpacing: "-2px",
                color: "#fff",
              }}
            />

            {/* Subheading */}
            <motion.p {...fade(0.8)}
              className="text-sm sm:text-base max-w-lg text-center font-light leading-relaxed mb-7"
              style={{ color: "rgba(255,255,255,0.68)", ...FONT_BODY }}>
              A private platform for founders building software — quietly, on their own terms.
            </motion.p>

            {/* ── Prompt Cockpit — redesigned for mobile ────────── */}
            <motion.div {...fade(1.0)} className="w-full max-w-[720px] mx-auto mb-6" data-testid="landing-prompt-cockpit">
              <div className="rounded-3xl overflow-hidden"
                style={{
                  background: "rgba(12,12,14,0.72)",
                  backdropFilter: "blur(40px)",
                  WebkitBackdropFilter: "blur(40px)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 60px -20px rgba(0,0,0,0.7)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}>

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  rows={3}
                  value={draft}
                  onChange={(e) => onDraftChange(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onBuild(); } }}
                  placeholder={placeholder || "Describe what you want to build…"}
                  className="w-full bg-transparent outline-none resize-none leading-relaxed px-5 pt-5 pb-3 placeholder:text-white/20"
                  style={{ color: "#fff", ...FONT_BODY, fontSize: "15px" }}
                  data-testid="landing-prompt-input"
                />

                {/* Mode pills — horizontal scroll on mobile */}
                <div className="px-4 pb-2">
                  <div className="flex items-center gap-2 overflow-x-auto"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    role="tablist" aria-label="Build type">
                    {MODES.map((m) => {
                      const Icon = m.icon;
                      const active = mode === m.key;
                      return (
                        <button key={m.key} type="button" onClick={() => setMode(m.key)}
                          data-testid={`landing-mode-${m.key}`}
                          role="tab" aria-selected={active}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full shrink-0 text-sm transition-all duration-200 whitespace-nowrap"
                          style={active ? {
                            background: "rgba(94,234,212,0.14)",
                            boxShadow: "inset 0 0 0 1px rgba(94,234,212,0.35)",
                            color: "#fff", ...FONT_BODY, fontWeight: 500,
                          } : {
                            background: "rgba(255,255,255,0.05)",
                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.55)", ...FONT_BODY,
                          }}>
                          <Icon size={13} strokeWidth={1.8}
                            style={{ color: active ? "#5EEAD4" : "rgba(255,255,255,0.5)" }} />
                          {m.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 16px" }} />

                {/* Action row — Build button only */}
                <div className="flex items-center justify-end px-4 py-3">
                  <button type="button" onClick={onBuild} disabled={!draft.trim()}
                    data-testid="landing-build-button"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-white text-[#0c0c0e] hover:bg-white/90 transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
                    style={FONT_BODY}>
                    <Sparkles size={13} /> Build
                  </button>
                </div>
              </div>

              {/* Keyboard hint */}
              <p className="mt-2.5 text-center text-[10px] tracking-[0.2em] uppercase"
                style={{ color: "rgba(255,255,255,0.22)", ...FONT_BODY }}>
                ⌘ + ↵ to build
              </p>

              {/* Suggestion chips */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5" data-testid="landing-suggestion-chips">
                {(MODE_SUGGESTIONS[mode] || []).map((s) => (
                  <button key={s.label} type="button"
                    onClick={() => { onDraftChange(s.prompt); setTimeout(() => textareaRef.current?.focus(), 30); }}
                    className="liquid-glass inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-xs hover:opacity-90 transition-colors"
                    style={{ color: "rgba(255,255,255,0.6)", ...FONT_BODY }}
                    data-testid={`landing-suggest-${s.label.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Sparkles size={9} style={{ color: "#5EEAD4" }} />
                    {s.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Stats — always side-by-side */}
            <motion.div {...fade(1.3)} className="flex items-stretch gap-3 w-full max-w-[440px]">
              {[
                { icon: <ClockIcon />, value: "191+", label: "AI Agents" },
                { icon: <GlobeIcon />, value: "52",   label: "Skill Integrations" },
              ].map((stat, i) => (
                <div key={i} className="liquid-glass p-4 rounded-[1.25rem] flex flex-col gap-2 flex-1">
                  {stat.icon}
                  <div>
                    <div style={{ ...FONT_HEADING, fontSize: "2rem", letterSpacing: "-1px", lineHeight: 1, color: "#fff" }}>
                      {stat.value}
                    </div>
                    <div className="text-xs font-light mt-1" style={{ color: "rgba(255,255,255,0.55)", ...FONT_BODY }}>
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Provider row — bottom of hero */}
          <motion.div {...fade(1.5)} className="flex flex-col items-center gap-3 pb-6 px-4">
            <div className="flex items-center gap-5 sm:gap-10 flex-wrap justify-center">
              {["Claude", "GPT-4", "Gemini", "Grok", "DeepSeek"].map((name) => (
                <span key={name} style={{ ...FONT_HEADING, fontSize: "clamp(1.2rem, 3.5vw, 1.75rem)", color: "rgba(255,255,255,0.55)", letterSpacing: "-0.5px" }}>
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CAPABILITIES — space video 2
          ════════════════════════════════════════════════════════════ */}
      <section id="build" className="relative overflow-hidden scroll-mt-16" style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse 110% 70% at 65% 100%, #0a1930 0%, #060d1a 50%, #020508 85%, #000 100%)",
      }}>
        <FadingVideo src={CAPS_VIDEO} className="absolute inset-0 w-full h-full object-cover z-0" />
        <span id="flow" className="absolute top-0" style={{ visibility: "hidden" }} />

        <div className="relative z-10 flex flex-col px-6 sm:px-12 lg:px-20 pt-24 pb-10" style={{ minHeight: "100vh" }}>
          <div className="mb-auto">
            <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.65)", ...FONT_BODY }}>// Capabilities</p>
            <h2 style={{ ...FONT_HEADING, fontSize: "clamp(3rem, 8vw, 6rem)", letterSpacing: "-3px", lineHeight: 0.9, color: "#fff" }}>
              Build<br />evolved
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
            {CAPS.map((c) => <CapabilityCard key={c.title} {...c} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          AGENTS LIBRARY
          ════════════════════════════════════════════════════════════ */}
      <section id="agents" className="relative py-16 sm:py-20 px-5 sm:px-8 scroll-mt-16" style={{ background: "#000" }}>
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 55% 35% at 50% 100%, rgba(94,234,212,0.05) 0%, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-[1080px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            <div>
              <p className="text-[11px] tracking-[0.4em] uppercase font-medium mb-4" style={{ color: "rgba(255,255,255,0.28)", ...FONT_BODY }}>
                AGENTS LIBRARY
              </p>
              <h2 className="mb-4"
                style={{ ...FONT_HEADING, fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-1px", lineHeight: 1.05, color: "#fff" }}>
                Pick an agent. Tell it what to do.
              </h2>
              <p className="text-sm leading-relaxed max-w-[440px] mb-6"
                style={{ color: "rgba(255,255,255,0.48)", ...FONT_BODY, fontWeight: 300 }}>
                191 specialised AI agents (backend architects, security auditors,
                test automators, DevOps responders) plus 52 personal-assistant
                skills. All browsable from a single workspace surface — connect
                your own keys and they answer through whichever provider you choose.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button type="button"
                  onClick={() => navigate(authed ? "/workspace/agents" : "/signin?return=/workspace/agents")}
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-full text-sm font-semibold transition-all hover:-translate-y-0.5 bg-white"
                  style={{ color: "#0c0c0e", ...FONT_BODY }}
                  data-testid="landing-agents-cta">
                  Open agents library <ArrowUpRight size={14} />
                </button>
                <span className="text-[10px] tracking-[0.22em] uppercase" style={{ color: "rgba(255,255,255,0.22)", ...FONT_BODY }}>
                  Auth required
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
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
                  <div className="font-mono text-[11px] sm:text-[12px] truncate" style={{ color: "#fff" }}>{a.name}</div>
                  <div className="text-[10px] sm:text-[10.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.38)", ...FONT_BODY }}>{a.hint}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          CINEMATIC CTA — video section before footer
          ════════════════════════════════════════════════════════════ */}
      <CinematicCTASection
        authed={authed}
        onAction={() => navigate(authed ? "/workspace" : "/signup")}
      />

      <PublicFooter />
    </div>
  );
}
