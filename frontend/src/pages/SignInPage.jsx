/**
 * NXT1 — Sign In (Cinematic Glass Redesign)
 *
 * Always dark / black background regardless of theme.
 * Liquid-glass card, Instrument Serif headline, Barlow body.
 * All form logic, routing, and OAuth handling preserved.
 */
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Brand from "@/components/Brand";
import SocialAuthRow from "@/components/auth/SocialAuthRow";
import OAuthCallbackInterceptor from "@/components/auth/OAuthCallback";
import { userSignin } from "@/lib/api";
import { setToken } from "@/lib/auth";

const FONT_HEADING = { fontFamily: "'Instrument Serif', serif", fontStyle: "italic" };
const FONT_BODY    = { fontFamily: "'Barlow', sans-serif" };

export default function SignInPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const promptParam = params.get("prompt") || "";
  const returnTo    = params.get("return") || "";

  useEffect(() => {
    if (promptParam) {
      try { window.localStorage.setItem("nxt1_draft_prompt", promptParam); } catch {}
    }
    const prev = document.body.style.background;
    document.body.style.background = "#000";
    return () => { document.body.style.background = prev; };
  }, [promptParam]);

  const buildReturnUrl = (user) => {
    if (returnTo) {
      const draft = (() => { try { return window.localStorage.getItem("nxt1_draft_prompt") || ""; } catch { return ""; } })();
      if (draft && !returnTo.includes("?")) return `${returnTo}?prompt=${encodeURIComponent(draft)}`;
      return returnTo;
    }
    return user?.onboarded ? "/workspace" : "/onboarding";
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await userSignin(form);
      setToken(data.token);
      toast.success(`Welcome back, ${data.user.name || data.user.email}.`);
      navigate(buildReturnUrl(data.user));
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  const signupHref = `/signup${promptParam ? `?prompt=${encodeURIComponent(promptParam)}${returnTo ? `&return=${encodeURIComponent(returnTo)}` : ""}` : ""}`;

  return (
    <OAuthCallbackInterceptor>
      <div
        className="relative min-h-screen w-full flex flex-col items-center justify-center px-5"
        style={{ background: "#000", color: "#fff" }}
        data-testid="signin-page"
      >
        {/* Ambient glow */}
        <div aria-hidden className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(94,234,212,0.07) 0%, transparent 65%)" }} />

        {/* Top bar */}
        <div className="absolute top-0 inset-x-0 flex items-center justify-between px-5 sm:px-8 py-4">
          <Link to="/" className="opacity-70 hover:opacity-100 transition-opacity" aria-label="Back to home" data-testid="signin-back">
            <Brand size="sm" gradient />
          </Link>
          <Link to={signupHref}
            className="text-[11px] uppercase tracking-[0.28em] transition-colors hover:opacity-80"
            style={{ color: "rgba(255,255,255,0.35)", ...FONT_BODY }}
            data-testid="link-to-signup">
            Request access
          </Link>
        </div>

        {/* Glass card */}
        <div
          className="relative z-10 w-full max-w-[380px] rounded-[24px] p-7 sm:p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow: "0 40px 100px -30px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
          data-testid="signin-card"
        >
          <p className="text-[10px] uppercase tracking-[0.32em] mb-4"
            style={{ color: "rgba(255,255,255,0.28)", ...FONT_BODY }}>
            Sign in
          </p>
          <h1 className="text-[2rem] mb-6 text-white" style={FONT_HEADING}>
            Welcome back.
          </h1>

          <SocialAuthRow returnTo={returnTo || "/workspace"} prompt={promptParam} />

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
            <span className="text-[9px] uppercase tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.22)", ...FONT_BODY }}>or</span>
            <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          <form onSubmit={submit} className="flex flex-col gap-3">
            <input
              type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@company.com" autoComplete="email"
              className="w-full h-11 rounded-xl px-4 text-sm outline-none transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "#fff", ...FONT_BODY,
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.22)"; }}
              onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
              data-testid="signin-email-input"
            />
            <input
              type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password" autoComplete="current-password"
              className="w-full h-11 rounded-xl px-4 text-sm outline-none transition-colors"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                color: "#fff", ...FONT_BODY,
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.22)"; }}
              onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; }}
              data-testid="signin-password-input"
            />
            <button
              type="submit"
              disabled={submitting || !form.email || !form.password}
              className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold bg-white text-black transition-all hover:bg-white/90 active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed mt-1"
              style={FONT_BODY}
              data-testid="signin-submit-button"
            >
              {submitting
                ? <Loader2 size={14} className="animate-spin" />
                : <><span>Sign in</span><ArrowRight size={13} strokeWidth={2.2} /></>}
            </button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: "rgba(255,255,255,0.28)", ...FONT_BODY }}>
            New here?{" "}
            <Link to={signupHref} className="font-medium transition-colors hover:opacity-100"
              style={{ color: "rgba(255,255,255,0.6)" }}
              data-testid="signin-go-to-signup">
              Request access
            </Link>
          </p>
        </div>
      </div>
    </OAuthCallbackInterceptor>
  );
}
