/**
 * NXT1 — LandingShowcase (Phase 16 redesign)
 *
 * Premium feature storytelling sections:
 *   1. "From a sentence" — 3 step cards (Describe → Generate → Ship)
 *   2. "The best models" — provider logo wall, reimagined
 *   3. CTA strip
 */
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Layers, MonitorSmartphone, Cpu, Zap, Globe } from "lucide-react";
import { ProviderLogo } from "@/components/premium/ProviderLogos";
import { useTheme } from "@/components/theme/ThemeProvider";

const STEPS = [
  {
    n: "01",
    title: "Describe",
    body: "Type what you want to build. One sentence is enough to start.",
    icon: Sparkles,
    color: "#5EEAD4",
  },
  {
    n: "02",
    title: "Generate",
    body: "Watch the workspace stream code, copy, and design in real time.",
    icon: Layers,
    color: "#6366F1",
  },
  {
    n: "03",
    title: "Ship",
    body: "Preview on phone, tablet, or desktop — then deploy in one click.",
    icon: MonitorSmartphone,
    color: "#F59E0B",
  },
];

const PROVIDERS = [
  { key: "anthropic", label: "Claude",    desc: "Opus & Sonnet",  tile: "#FAF9F5", invert: false },
  { key: "openai",    label: "GPT-4",     desc: "OpenAI",         tile: "#202021", invert: true  },
  { key: "gemini",    label: "Gemini",    desc: "Google",         tile: "#FFFFFF", invert: false },
  { key: "grok",      label: "Grok",      desc: "xAI",            tile: "#0F0F10", invert: true  },
  { key: "deepseek",  label: "DeepSeek",  desc: "DeepSeek AI",    tile: "#FFFFFF", invert: false },
];

export default function LandingShowcase() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const rainbowGrad = isLight
    ? "linear-gradient(110deg, #0E8C73 0%, #B58320 50%, #C25A1F 100%)"
    : "linear-gradient(110deg, #5EEAD4 0%, #F0D28A 50%, #FF8A3D 100%)";

  const cardBase = {
    background: isLight
      ? "linear-gradient(145deg, #FBFAF6 0%, #F4EFE0 100%)"
      : "linear-gradient(145deg, rgba(48,48,56,0.85) 0%, rgba(30,30,36,0.90) 100%)",
    border: `1px solid ${isLight ? "rgba(26,26,31,0.08)" : "rgba(255,255,255,0.07)"}`,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  };

  return (
    <section
      className="relative z-10 px-5 sm:px-6 pt-10 sm:pt-16 pb-8"
      data-testid="landing-showcase"
    >
      <div className="mx-auto max-w-[1080px] space-y-14 sm:space-y-20">

        {/* ─── 1. Three-step how it works ─── */}
        <div>
          <SectionHeader
            overline="HOW IT WORKS"
            title="From a sentence."
            sub="Three steps. The AI does the heavy lifting."
            isLight={isLight}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-10">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.n}
                  className="rounded-3xl p-6 sm:p-7 relative overflow-hidden glow-hover"
                  style={cardBase}
                  data-testid={`showcase-step-${s.n}`}
                >
                  {/* Corner glow */}
                  <div
                    aria-hidden
                    className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 100% 0%, ${s.color}18 0%, transparent 70%)`,
                    }}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-5">
                      <span
                        className="mono text-[10px] tracking-[0.30em] uppercase"
                        style={{ color: "var(--nxt-fg-faint)" }}
                      >
                        {s.n}
                      </span>
                      <span
                        className="h-9 w-9 rounded-2xl flex items-center justify-center"
                        style={{
                          background: `${s.color}14`,
                          border: `1px solid ${s.color}28`,
                        }}
                      >
                        <Icon size={15} style={{ color: s.color }} />
                      </span>
                    </div>
                    <h3
                      className="text-[20px] sm:text-[22px] font-bold tracking-tight mb-2"
                      style={{
                        fontFamily: "'Cabinet Grotesk', sans-serif",
                        color: "var(--nxt-fg)",
                      }}
                    >
                      {s.title}
                    </h3>
                    <p className="text-[13.5px] leading-relaxed" style={{ color: "var(--nxt-fg-dim)" }}>
                      {s.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─── 2. Provider wall ─── */}
        <div>
          <SectionHeader
            overline="POWERED BY"
            title="The best models. Always."
            sub="Switch providers in a tap. Tiered routing keeps you fast and cost-efficient."
            isLight={isLight}
          />
          <div
            className="mt-8 sm:mt-10 rounded-3xl p-7 sm:p-10 relative overflow-hidden"
            style={cardBase}
            data-testid="showcase-provider-wall"
          >
            {/* Ambient glow */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(60% 60% at 50% 100%, rgba(94,234,212,0.07) 0%, transparent 70%)",
              }}
            />
            <div className="relative grid grid-cols-5 gap-4 sm:gap-6 items-center justify-items-center">
              {PROVIDERS.map((p) => (
                <div key={p.key} className="flex flex-col items-center gap-2.5 sm:gap-3 group">
                  <span
                    className="inline-flex items-center justify-center rounded-2xl overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-lg"
                    style={{
                      width: 52,
                      height: 52,
                      background: p.tile,
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), 0 8px 20px -10px rgba(0,0,0,0.5)",
                    }}
                  >
                    <ProviderLogo provider={p.key} size={30} invert={p.invert} />
                  </span>
                  <div className="text-center">
                    <div
                      className="text-[12px] font-semibold tracking-tight"
                      style={{ color: "var(--nxt-fg)" }}
                    >
                      {p.label}
                    </div>
                    <div
                      className="mono text-[9px] tracking-[0.15em] uppercase"
                      style={{ color: "var(--nxt-fg-faint)" }}
                    >
                      {p.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── 3. CTA Strip ─── */}
        <div
          className="relative rounded-3xl overflow-hidden px-8 sm:px-14 py-12 sm:py-16 text-center"
          style={{
            background: isLight
              ? "radial-gradient(80% 80% at 50% 0%, rgba(20,130,110,0.12) 0%, transparent 60%), var(--nxt-surface-soft)"
              : "radial-gradient(80% 80% at 50% 0%, rgba(94,234,212,0.08) 0%, transparent 60%), rgba(36,36,40,0.55)",
            border: `1px solid ${isLight ? "rgba(26,26,31,0.08)" : "rgba(255,255,255,0.07)"}`,
          }}
          data-testid="showcase-cta"
        >
          <div
            className="mono text-[10px] sm:text-[10.5px] tracking-[0.40em] uppercase font-medium bg-clip-text text-transparent mb-4"
            style={{ backgroundImage: rainbowGrad }}
          >
            DISCOVER · DEVELOP · DELIVER
          </div>
          <h2
            className="text-[28px] sm:text-[42px] leading-[1.05] font-bold tracking-[-0.025em] mb-4"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif", color: "var(--nxt-fg)" }}
          >
            Ready to build your next idea?
          </h2>
          <p
            className="text-[14px] sm:text-[15px] max-w-[400px] mx-auto mb-8 leading-relaxed"
            style={{ color: "var(--nxt-fg-dim)" }}
          >
            Join a select group of founders building real software with AI. Invite-only.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 h-12 px-8 rounded-full text-[14px] font-semibold tracking-tight hover:-translate-y-0.5 transition-all group"
            style={{
              background: isLight ? "#1F1F23" : "#FFFFFF",
              color: isLight ? "#FAFAFA" : "#1F1F23",
              boxShadow: isLight
                ? "0 12px 32px -10px rgba(31,31,35,0.35)"
                : "0 12px 32px -10px rgba(255,255,255,0.50)",
            }}
            data-testid="showcase-cta-button"
          >
            Request access
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}

/* ── Section header helper ── */
function SectionHeader({ overline, title, sub, isLight }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div
        className="mono text-[10px] tracking-[0.34em] uppercase mb-3 flex items-center justify-center gap-2"
        style={{ color: "var(--nxt-fg-faint)" }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: isLight ? "#0E8C73" : "#5EEAD4" }}
        />
        {overline}
      </div>
      <h2
        className="text-[28px] sm:text-[40px] leading-[1.05] font-bold tracking-[-0.025em]"
        style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
      >
        <span
          style={{
            background: isLight
              ? "linear-gradient(180deg, #1A1A1F 0%, #6A6259 100%)"
              : "linear-gradient(180deg, #FFFFFF 0%, #9A9AA3 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {title}
        </span>
      </h2>
      {sub && (
        <p
          className="text-[14px] mt-2.5 leading-relaxed"
          style={{ color: "var(--nxt-fg-dim)" }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
