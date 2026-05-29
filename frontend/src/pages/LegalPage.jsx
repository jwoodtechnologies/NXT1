import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import Brand from "@/components/Brand";
import PublicFooter from "@/components/PublicFooter";

const FONT_HEADING = { fontFamily: "'Instrument Serif', serif", fontStyle: "italic" };
const FONT_BODY    = { fontFamily: "'Barlow', sans-serif" };

export default function LegalPage({ title, lastUpdated, body }) {
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = "#000";
    return () => { document.body.style.background = prev; };
  }, []);

  return (
    <div
      className="relative min-h-screen w-full flex flex-col text-white overflow-hidden"
      style={{ background: "#000" }}
      data-testid={`legal-page-${title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Animated ambient orbs */}
      <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: 800, height: 800,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(94,234,212,0.07) 0%, transparent 65%)",
            top: "-25%", left: "-20%",
          }}
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: 600, height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(240,210,138,0.05) 0%, transparent 65%)",
            bottom: "-10%", right: "-15%",
          }}
        />
        <motion.div
          animate={{ x: [0, 25, -15, 0], y: [0, -20, 15, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: 450, height: 450,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,138,61,0.04) 0%, transparent 65%)",
            top: "40%", right: "15%",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-20 px-5 sm:px-10 pt-5 sm:pt-6 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            aria-label="Back to home"
            data-testid="legal-back"
          >
            <ArrowLeft size={15} style={{ color: "rgba(255,255,255,0.6)" }} />
          </Link>
          <Brand size="md" gradient />
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.28em] transition-colors hover:opacity-80"
          style={{ color: "rgba(255,255,255,0.35)", ...FONT_BODY }}
          data-testid="legal-contact"
        >
          <Mail size={12} /> Contact
        </Link>
      </header>

      <main className="relative z-10 flex-1 px-5 sm:px-8 py-8 sm:py-12">
        <div className="max-w-[760px] mx-auto">
          <p className="text-[10px] uppercase tracking-[0.32em] mb-4 flex items-center gap-2"
            style={{ color: "rgba(255,255,255,0.3)", ...FONT_BODY }}>
            <span className="h-1.5 w-1.5 rounded-full inline-block" style={{ background: "#5EEAD4" }} />
            {title}
          </p>
          <h1 className="mb-1" style={{ ...FONT_HEADING, fontSize: "clamp(2.6rem, 6vw, 4rem)", lineHeight: 1, color: "#fff" }}>
            {title}.
          </h1>
          {lastUpdated && (
            <p className="text-[11px] uppercase tracking-[0.22em] mb-8" style={{ color: "rgba(255,255,255,0.25)", ...FONT_BODY }}>
              Last updated · {lastUpdated}
            </p>
          )}

          <div
            className="rounded-3xl p-6 sm:p-10"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 40px 100px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <div className="text-[14.5px] leading-[1.72] space-y-5" style={{ color: "rgba(255,255,255,0.72)", ...FONT_BODY }}
              data-testid="legal-body">
              {body}
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px]"
            style={{ color: "rgba(255,255,255,0.3)", ...FONT_BODY }}>
            <span className="tracking-[0.20em] uppercase">NXT1 · Jwood Technologies</span>
            <Link to="/contact" className="inline-flex items-center gap-1.5 transition-colors hover:opacity-80">
              Have questions?{" "}
              <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>Contact us</span> →
            </Link>
          </div>
        </div>
      </main>

      <div className="relative z-10">
        <PublicFooter />
      </div>
    </div>
  );
}

export function Section({ title: t, children }) {
  return (
    <section className="space-y-3" data-testid="legal-section">
      <h2 className="text-[18px] sm:text-[20px] font-semibold tracking-tight pt-2"
        style={{ color: "#fff", fontFamily: "'Barlow', sans-serif" }}>
        {t}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function Bullets({ items }) {
  return (
    <ul className="space-y-2 pl-1">
      {items.map((i, idx) => (
        <li key={idx} className="flex items-start gap-2.5">
          <span className="mt-2 h-1 w-1 rounded-full shrink-0" style={{ background: "#5EEAD4" }} />
          <span style={{ color: "rgba(255,255,255,0.72)" }}>{i}</span>
        </li>
      ))}
    </ul>
  );
}
