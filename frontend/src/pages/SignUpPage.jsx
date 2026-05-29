/**
 * NXT1 — Sign Up (Cinematic Glass Redesign)
 *
 * Always dark / black. Liquid-glass card, Instrument Serif headline.
 * All signup logic, OAuth support, and ?prompt/?return persistence kept intact.
 */
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, ArrowLeft, Loader2, Lock, Mail, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import Brand from "@/components/Brand";
import SocialAuthRow from "@/components/auth/SocialAuthRow";
import PublicFooter from "@/components/PublicFooter";
import { userSignup } from "@/lib/api";
import { setToken } from "@/lib/auth";

const FONT_HEADING = { fontFamily: "'Instrument Serif', serif", fontStyle: "italic" };
const FONT_BODY    = { fontFamily: "'Barlow', sans-serif" };

const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
  color: "#fff",
  ...{ fontFamily: "'Barlow', sans-serif" },
};

export default function SignUpPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const returnTo    = params.get("return") || "/onboarding";
  const promptParam = params.get("prompt") || "";

  useEffect(() => {
    if (promptParam) {
      try { window.localStorage.setItem("nxt1_draft_prompt", promptParam); } catch {}
    }
    const prev = document.body.style.background;
    document.body.style.background = "#000";
    return () => { document.body.style.background = prev; };
  }, [promptParam]);

  const buildReturnUrl = () => {
    const draft = (() => { try { return window.localStorage.getItem("nxt1_draft_prompt") || ""; } catch { return ""; } })();
    if (!draft || returnTo.includes("?")) return returnTo;
    return `${returnTo}?prompt=${encodeURIComponent(draft)}`;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || form.password.length < 8) {
      toast.error("Email and 8+ character password required.");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await userSignup(form);
      setToken(data.token);
      toast.success(`Welcome to NXT1, ${data.user.name || data.user.email}.`);
      navigate(buildReturnUrl());
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  const signinHref = `/signin${promptParam ? `?prompt=${encodeURIComponent(promptParam)}&return=${encodeURIComponent(returnTo)}` : ""}`;

  return (
    <div
      className="relative min-h-screen w-full flex flex-col"
      style={{ background: "#000", color: "#fff" }}
      data-testid="signup-page"
    >
      {/* Ambient glow — top */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(94,234,212,0.06) 0%, transparent 65%)" }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center justify-center w-9 h-9 rounded-full transition-colors hover:bg-white/5"
            aria-label="Back to home" data-testid="signup-back"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            <ArrowLeft size={15} style={{ color: "rgba(255,255,255,0.6)" }} />
          </Link>
          <Brand size="sm" gradient />
        </div>
        <Link to={signinHref}
          className="text-[11px] uppercase tracking-[0.28em] transition-colors hover:opacity-80"
          style={{ color: "rgba(255,255,255,0.35)", ...FONT_BODY }}
          data-testid="link-to-signin">
          Sign in
        </Link>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-5 py-6 sm:py-8">
        <div
          className="w-full max-w-[440px] rounded-[24px] p-7 sm:p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 40px 100px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
          data-testid="signup-card"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#5EEAD4" }} />
            <span className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.3)", ...FONT_BODY }}>
              Create your NXT1 account
            </span>
          </div>

          <h1 className="mb-1.5 text-white" style={{ ...FONT_HEADING, fontSize: "clamp(1.7rem, 4vw, 2.1rem)" }}>
            Start building.
          </h1>
          <p className="text-xs sm:text-sm mb-6 font-light"
            style={{ color: "rgba(255,255,255,0.4)", ...FONT_BODY, lineHeight: 1.6 }}>
            {promptParam
              ? "Your prompt is saved — finish signup and we'll pick up right where you left off."
              : "Build apps, websites, APIs, and dashboards from natural language."}
          </p>

          <SocialAuthRow returnTo={returnTo} prompt={promptParam} />

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-[9px] uppercase tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.22)", ...FONT_BODY }}>or with email</span>
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          <form onSubmit={submit} className="flex flex-col gap-3">
            <GlassField icon={UserIcon} label="Name (optional)">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="w-full h-11 rounded-xl pl-10 pr-4 text-sm outline-none transition-colors"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.22)"; }}
                onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
                data-testid="signup-name-input" />
            </GlassField>

            <GlassField icon={Mail} label="Email" required>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com" autoComplete="email"
                className="w-full h-11 rounded-xl pl-10 pr-4 text-sm outline-none transition-colors"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.22)"; }}
                onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
                data-testid="signup-email-input" />
            </GlassField>

            <GlassField icon={Lock} label="Password" required>
              <div className="relative">
                <input type={showPw ? "text" : "password"} required minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 8 characters" autoComplete="new-password"
                  className="w-full h-11 rounded-xl pl-10 pr-14 text-sm outline-none transition-colors"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.22)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
                  data-testid="signup-password-input" />
                <button type="button" onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-wider transition-colors hover:opacity-80"
                  style={{ color: "rgba(255,255,255,0.38)", ...FONT_BODY }}>
                  {showPw ? "hide" : "show"}
                </button>
              </div>
            </GlassField>

            <button type="submit" disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold bg-white text-black transition-all hover:bg-white/90 active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed mt-1"
              style={FONT_BODY}
              data-testid="signup-submit-button">
              {submitting
                ? <Loader2 size={14} className="animate-spin" />
                : <><span>Create account</span><ArrowRight size={14} /></>}
            </button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: "rgba(255,255,255,0.28)", ...FONT_BODY }}>
            Already have an account?{" "}
            <Link to={signinHref} className="font-medium transition-colors hover:opacity-100"
              style={{ color: "rgba(255,255,255,0.6)" }}
              data-testid="signup-go-to-signin">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

function GlassField({ icon: Icon, label, required, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.24em] mb-1.5" style={{ color: "rgba(255,255,255,0.28)", fontFamily: "'Barlow', sans-serif" }}>
        {label}{required && <span style={{ color: "#ff8a3d" }} className="ml-1">*</span>}
      </span>
      <div className="relative">
        {Icon && (
          <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10"
            style={{ color: "rgba(255,255,255,0.28)" }} />
        )}
        {children}
      </div>
    </label>
  );
}
