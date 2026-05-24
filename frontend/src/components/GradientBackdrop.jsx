/**
 * NXT1 — Adaptive Backdrop (Phase 16 — Enhanced animation)
 *
 * cinema / public variant:
 *   Dark mode — 5 animated orbs (cyan, indigo, amber, pink, teal-deep) + dot grid overlay
 *   Light mode — warm cream with jade + amber orbs
 *
 * workspace variant: carbon-black charcoal + 3 ambient orbs
 * auth variant:      same w/ warmer palette
 */
import { useMemo } from "react";

export default function GradientBackdrop({ intensity = "medium", variant = "public" }) {
  const overlay = useMemo(() => {
    if (intensity === "soft")   return "bg-graphite-scrim-soft";
    if (intensity === "strong") return "bg-graphite-scrim-strong";
    return "bg-graphite-scrim";
  }, [intensity]);

  /* ────────────────────────────────────────────────
     PUBLIC / CINEMA — multi-orb animated backdrop
  ──────────────────────────────────────────────── */
  if (variant === "cinema" || variant === "public") {
    const isLight =
      typeof document !== "undefined" &&
      document.documentElement.dataset.theme === "light";

    return (
      <>
        {/* Pure base layer */}
        <div
          className="absolute inset-0"
          style={{ background: "var(--nxt-bg)" }}
          data-testid="gradient-backdrop"
        />

        {/* Subtle dot grid texture — premium depth effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isLight
              ? "radial-gradient(circle, rgba(26,26,31,0.06) 1px, transparent 1px)"
              : "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 100% 80% at 50% 0%, black 0%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse 100% 80% at 50% 0%, black 0%, transparent 85%)",
          }}
        />

        {/* Orb 1 — cyan / jade, top-left drift */}
        <div
          className="absolute nxt-orb nxt-orb-cyan nxt-orb-drift"
          style={{
            width: 800,
            height: 800,
            top: "-20%",
            left: "-15%",
            opacity: isLight ? 0.22 : 0.28,
            background: isLight
              ? "radial-gradient(closest-side, rgba(20,130,110,0.6) 0%, rgba(20,130,110,0) 70%)"
              : "radial-gradient(closest-side, #5EEAD4 0%, rgba(94,234,212,0) 70%)",
          }}
        />

        {/* Orb 2 — indigo, top-right drift-2 */}
        <div
          className="absolute nxt-orb nxt-orb-indigo nxt-orb-drift-2"
          style={{
            width: 720,
            height: 720,
            top: "5%",
            right: "-18%",
            opacity: isLight ? 0.14 : 0.22,
            background: isLight
              ? "radial-gradient(closest-side, rgba(99,102,241,0.5) 0%, rgba(99,102,241,0) 70%)"
              : "radial-gradient(closest-side, #6366F1 0%, rgba(99,102,241,0) 70%)",
          }}
        />

        {/* Orb 3 — amber, center-right drift (slower) */}
        <div
          className="absolute nxt-orb nxt-orb-amber nxt-orb-drift"
          style={{
            width: 600,
            height: 600,
            top: "38%",
            right: "5%",
            opacity: isLight ? 0.12 : 0.18,
            animationDelay: "8s",
            animationDuration: "24s",
            background: isLight
              ? "radial-gradient(closest-side, rgba(245,158,11,0.5) 0%, rgba(245,158,11,0) 70%)"
              : "radial-gradient(closest-side, #F59E0B 0%, rgba(245,158,11,0) 70%)",
          }}
        />

        {/* Orb 4 — pink, bottom-left drift-2 */}
        <div
          className="absolute nxt-orb nxt-orb-pink nxt-orb-drift-2"
          style={{
            width: 560,
            height: 560,
            bottom: "-12%",
            left: "20%",
            opacity: isLight ? 0.10 : 0.15,
            animationDelay: "4s",
            animationDuration: "20s",
            background: isLight
              ? "radial-gradient(closest-side, rgba(236,72,153,0.4) 0%, rgba(236,72,153,0) 70%)"
              : "radial-gradient(closest-side, #EC4899 0%, rgba(236,72,153,0) 70%)",
          }}
        />

        {/* Orb 5 — teal-deep, bottom-right drift */}
        <div
          className="absolute nxt-orb nxt-orb-drift"
          style={{
            width: 500,
            height: 500,
            bottom: "0%",
            right: "10%",
            opacity: isLight ? 0.08 : 0.14,
            animationDelay: "12s",
            animationDuration: "26s",
            background: isLight
              ? "radial-gradient(closest-side, rgba(16,185,129,0.45) 0%, rgba(16,185,129,0) 70%)"
              : "radial-gradient(closest-side, rgba(94,234,212,0.8) 0%, rgba(94,234,212,0) 70%)",
            filter: "blur(80px)",
            borderRadius: "999px",
          }}
        />

        {/* Soft top light beam */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: isLight
              ? "radial-gradient(ellipse 100% 55% at 50% -5%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 65%)"
              : "radial-gradient(ellipse 100% 55% at 50% -5%, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0) 65%)",
          }}
        />

        {/* Bottom fade shelf */}
        <div
          className="absolute inset-x-0 bottom-0 h-[50vh] pointer-events-none"
          style={{
            background: isLight
              ? "linear-gradient(180deg, rgba(231,224,206,0) 0%, rgba(231,224,206,0.75) 100%)"
              : "linear-gradient(180deg, rgba(31,31,35,0) 0%, rgba(31,31,35,0.70) 100%)",
          }}
        />
      </>
    );
  }

  /* ────────────────────────────────────────────────
     INTERNAL — carbon-black charcoal + ambient orbs
  ──────────────────────────────────────────────── */
  const palette =
    variant === "auth"
      ? { a: "nxt-orb-indigo", b: "nxt-orb-cyan",   c: "nxt-orb-pink"  }
      : { a: "nxt-orb-cyan",   b: "nxt-orb-indigo",  c: "nxt-orb-amber" };

  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: "var(--nxt-bg)" }}
        data-testid="gradient-backdrop"
      />
      <div
        className={`nxt-orb ${palette.a} nxt-orb-drift`}
        style={{ width: 720, height: 720, top: "-12%", left: "-8%", opacity: 0.32 }}
      />
      <div
        className={`nxt-orb ${palette.b} nxt-orb-drift-2`}
        style={{ width: 640, height: 640, top: "38%", right: "-10%", opacity: 0.28 }}
      />
      <div
        className={`nxt-orb ${palette.c} nxt-orb-drift`}
        style={{ width: 540, height: 540, bottom: "-18%", left: "24%", opacity: 0.18, animationDelay: "6s" }}
      />
      <div className={`absolute inset-0 ${overlay} pointer-events-none`} />
      <div
        className="absolute inset-x-0 top-0 h-[260px] pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 100%)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[50vh] pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(31,31,35,0) 0%, rgba(31,31,35,0.85) 60%, var(--nxt-bg) 100%)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(31,31,35,0) 35%, rgba(20,20,24,0.6) 100%)" }}
      />
    </>
  );
}
