/**
 * NXT1 — PublicFooter
 *
 * Cinematic dark footer that blends with the space-travel landing page.
 * Works on both landing (always black) and auth pages (uses nxt-bg).
 */
import { Link } from "react-router-dom";
import Brand from "@/components/Brand";

const FONT_HEADING = { fontFamily: "'Instrument Serif', serif", fontStyle: "italic" };
const FONT_BODY    = { fontFamily: "'Barlow', sans-serif" };

export default function PublicFooter() {
  return (
    <footer
      className="relative w-full"
      style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      data-testid="public-footer"
    >
      <div className="mx-auto max-w-[1080px] px-5 sm:px-8 pt-10 pb-8">

        {/* Top row — Brand + nav links */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <Brand size="md" gradient />
            <span className="text-[11px] tracking-[0.22em] uppercase" style={{ color: "rgba(255,255,255,0.22)", ...FONT_BODY }}>
              v0.6
            </span>
          </div>
          <div className="flex items-center gap-5 sm:gap-6">
            {[
              { to: "/privacy",  label: "Privacy"   },
              { to: "/terms",    label: "Terms"     },
              { to: "/contact",  label: "Contact"   },
              { to: "/access",   label: "Workspace" },
            ].map(({ to, label }) => (
              <Link key={to} to={to}
                className="text-[12px] transition-colors hover:opacity-100"
                style={{ color: "rgba(255,255,255,0.38)", ...FONT_BODY }}
                data-testid={`footer-${label.toLowerCase()}`}>
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Thin rule */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: "2rem" }} />

        {/* Tagline */}
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <p
            className="tracking-[0.28em] uppercase text-sm sm:text-base"
            style={{ ...FONT_HEADING, fontSize: "clamp(1rem, 2.5vw, 1.3rem)", letterSpacing: "0.25em", color: "rgba(255,255,255,0.55)" }}
          >
            Discover · Develop · Deliver
          </p>
          <p className="text-[11px] sm:text-[12px]" style={{ color: "rgba(255,255,255,0.25)", ...FONT_BODY }}>
            A product of{" "}
            <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>Jwood Technologies</span>
          </p>
        </div>

        {/* Bottom row — copyright + USA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.18)", ...FONT_BODY }}>
            © {new Date().getFullYear()} Jwood Technologies. All rights reserved.
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px]" style={{ color: "rgba(255,255,255,0.22)", ...FONT_BODY }}>
            <USFlag />
            Made in the USA
          </span>
        </div>

      </div>
    </footer>
  );
}

function USFlag() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden
      style={{ borderRadius: 1.5, overflow: "hidden", display: "inline-block", flex: "0 0 auto" }}>
      <rect width="16" height="11" fill="#B22234" />
      <rect y="1.55" width="16" height="1.55" fill="#FFFFFF" />
      <rect y="4.65" width="16" height="1.55" fill="#FFFFFF" />
      <rect y="7.75" width="16" height="1.55" fill="#FFFFFF" />
      <rect width="6.6" height="6.2" fill="#3C3B6E" />
      <circle cx="1.6" cy="1.6" r="0.35" fill="#FFFFFF" />
      <circle cx="3.2" cy="1.6" r="0.35" fill="#FFFFFF" />
      <circle cx="4.8" cy="1.6" r="0.35" fill="#FFFFFF" />
      <circle cx="2.4" cy="3.0" r="0.35" fill="#FFFFFF" />
      <circle cx="4.0" cy="3.0" r="0.35" fill="#FFFFFF" />
      <circle cx="1.6" cy="4.4" r="0.35" fill="#FFFFFF" />
      <circle cx="3.2" cy="4.4" r="0.35" fill="#FFFFFF" />
      <circle cx="4.8" cy="4.4" r="0.35" fill="#FFFFFF" />
    </svg>
  );
}
