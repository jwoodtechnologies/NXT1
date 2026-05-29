/**
 * NXT1 — Workspace Access / Passkey Gate (Cinematic Glass Redesign)
 *
 * Always-dark, liquid-glass panel. Admin-only passkey entry.
 * All auth logic preserved.
 */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import Brand from "@/components/Brand";
import { login } from "@/lib/api";
import { clearToken, isAuthenticated, setToken } from "@/lib/auth";

const FONT_HEADING = { fontFamily: "'Instrument Serif', serif", fontStyle: "italic" };
const FONT_BODY    = { fontFamily: "'Barlow', sans-serif" };

export default function LoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) return;
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("nxt1.token") || ""}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.role === "admin") navigate("/admin", { replace: true }); else clearToken(); })
      .catch(() => clearToken());
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    setSubmitting(true);
    try {
      clearToken();
      const { data } = await login(password);
      setToken(data.token);
      navigate("/admin", { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Wrong passkey");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-5"
      style={{ background: "#000" }}
      data-testid="login-page"
    >
      {/* Ambient top glow */}
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(94,234,212,0.06) 0%, transparent 65%)" }} />

      {/* Back to home */}
      <Link to="/" className="absolute top-5 left-5 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Back to home" data-testid="login-back">
        <Brand size="sm" gradient />
      </Link>

      {/* Glass panel */}
      <form
        onSubmit={onSubmit}
        className="relative z-10 w-full max-w-[340px] rounded-[24px] p-7 sm:p-8 flex flex-col gap-4"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: "0 40px 100px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
        data-testid="login-form"
      >
        <p className="text-[10px] uppercase tracking-[0.32em]" style={{ color: "rgba(255,255,255,0.28)", ...FONT_BODY }}>
          Workspace
        </p>
        <h1 className="text-[1.75rem] text-white" style={FONT_HEADING}>
          Enter passkey.
        </h1>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Passkey"
          className="w-full h-11 rounded-xl px-4 text-sm outline-none transition-colors tracking-widest"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.09)",
            color: "#fff", ...FONT_BODY,
          }}
          onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.22)"; }}
          onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
          autoFocus
          autoComplete="current-password"
          data-testid="login-password-input"
        />

        <button
          type="submit"
          disabled={submitting || !password.trim()}
          className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold bg-white text-black transition-all hover:bg-white/90 active:scale-[0.99] disabled:opacity-25 disabled:cursor-not-allowed"
          style={FONT_BODY}
          data-testid="login-submit-button"
        >
          {submitting
            ? <Loader2 size={14} className="animate-spin" />
            : <><span>Enter</span><ArrowRight size={14} strokeWidth={2.2} /></>}
        </button>
      </form>

      {/* Bottom links */}
      <div className="absolute bottom-6 inset-x-0 flex items-center justify-center gap-5 text-[10px] uppercase tracking-[0.22em]"
        style={{ color: "rgba(255,255,255,0.22)", ...FONT_BODY }}>
        <Link to="/signin" className="hover:opacity-70 transition-opacity" data-testid="login-go-to-signin">User sign in</Link>
        <span aria-hidden>·</span>
        <Link to="/signup" className="hover:opacity-70 transition-opacity" data-testid="login-request-access-link">Request access</Link>
      </div>
    </div>
  );
}
