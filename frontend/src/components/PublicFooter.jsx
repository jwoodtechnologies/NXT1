/**
 * NXT1 — PublicFooter (Phase 16 redesign)
 *
 * Clean 2-row footer: nav links left, attribution center.
 * Theme-aware, mobile-first.
 */
import { Link } from "react-router-dom";
import Brand from "@/components/Brand";

export default function PublicFooter() {
  return (
    <footer
      className="relative z-10 w-full px-5 sm:px-10 py-8 sm:py-10"
      data-testid="public-footer"
      style={{
        borderTop: "1px solid var(--nxt-border-soft)",
      }}
    >
      <div className="mx-auto max-w-[1080px]">
        {/* Top row: brand + nav */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <Brand size="sm" gradient />
          <nav className="flex items-center gap-5 sm:gap-6 text-[12px]" style={{ color: "var(--nxt-fg-faint)" }}>
            <Link to="/privacy"  className="transition-colors hover:opacity-80" style={{ color: "inherit" }} data-testid="footer-privacy">Privacy</Link>
            <Link to="/terms"    className="transition-colors hover:opacity-80" style={{ color: "inherit" }} data-testid="footer-terms">Terms</Link>
            <Link to="/contact"  className="transition-colors hover:opacity-80" style={{ color: "inherit" }} data-testid="footer-contact">Contact</Link>
            <Link to="/access"   className="transition-colors hover:opacity-80" style={{ color: "inherit" }} data-testid="footer-workspace">Workspace</Link>
          </nav>
        </div>

        {/* Divider */}
        <div className="mt-6 mb-5 h-px" style={{ background: "var(--nxt-border-soft)" }} />

        {/* Bottom row: attribution */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] leading-none"
          style={{ color: "var(--nxt-fg-faint)" }}
          data-testid="footer-attribution"
        >
          <span data-testid="footer-jwood-attribution">
            A product of{" "}
            <span style={{ color: "var(--nxt-fg-dim)", fontWeight: 600 }}>
              Jwood Technologies
            </span>
          </span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span className="inline-flex items-center gap-1.5" data-testid="footer-made-in-usa">
            <USFlag />
            <span>Made in the USA</span>
          </span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ opacity: 0.55 }}>© {new Date().getFullYear()} NXT1</span>
        </div>
      </div>
    </footer>
  );
}

function USFlag() {
  return (
    <svg
      width="16"
      height="11"
      viewBox="0 0 16 11"
      aria-hidden
      style={{ borderRadius: 2, overflow: "hidden", display: "inline-block", flexShrink: 0 }}
    >
      <rect width="16" height="11" fill="#B22234" />
      <rect y="1.55"  width="16" height="1.55" fill="#FFFFFF" />
      <rect y="4.65"  width="16" height="1.55" fill="#FFFFFF" />
      <rect y="7.75"  width="16" height="1.55" fill="#FFFFFF" />
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
