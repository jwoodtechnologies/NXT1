import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Brand from "@/components/Brand";
import NxtChatBot from "@/components/landing/NxtChatBot";
import PublicFooter from "@/components/PublicFooter";

const FONT_BODY = { fontFamily: "'Barlow', sans-serif" };

export default function ContactPage() {
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = "#000";
    return () => { document.body.style.background = prev; };
  }, []);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{ background: "#000", color: "#fff" }}
      data-testid="contact-page"
    >
      {/* Animated ambient orbs */}
      <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: 700, height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(94,234,212,0.07) 0%, transparent 65%)",
            top: "-20%", left: "-15%",
          }}
        />
        <motion.div
          animate={{ x: [0, -35, 0], y: [0, 45, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: 550, height: 550,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(240,210,138,0.05) 0%, transparent 65%)",
            bottom: "-5%", right: "-10%",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-20 px-5 sm:px-10 pt-5 sm:pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors hover:bg-white/5"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
            aria-label="Back to home"
            data-testid="contact-back"
          >
            <ArrowLeft size={15} style={{ color: "rgba(255,255,255,0.6)" }} />
          </Link>
          <Brand size="md" gradient />
        </div>
        <Link
          to="/"
          className="text-[11px] uppercase tracking-[0.28em] transition-colors hover:opacity-80"
          style={{ color: "rgba(255,255,255,0.35)", ...FONT_BODY }}
        >
          Back
        </Link>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center">
        <div className="w-full max-w-[920px] px-5 sm:px-8 py-6 sm:py-10">
          <NxtChatBot inline />
        </div>
      </main>

      <div className="relative z-10">
        <PublicFooter />
      </div>
    </div>
  );
}
