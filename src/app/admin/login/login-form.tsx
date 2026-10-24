"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Mail,
  LockKeyhole,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const supabase = createClient();

      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (authError || !data.user) {
        setError(
          authError?.message ?? "Unable to sign in. Please try again."
        );
        return;
      }

      // Only trusted Supabase app_metadata grants admin access.
      if (data.user.app_metadata?.role !== "admin") {
        await supabase.auth.signOut();
        setError(
          "This account is not authorized to access the admin panel."
        );
        return;
      }

      // The checkbox is a UI preference only. Session persistence
      // continues to be controlled by the existing Supabase client.
      void rememberMe;

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-ambient admin-login-ambient-one" aria-hidden="true" />
      <div className="admin-login-ambient admin-login-ambient-two" aria-hidden="true" />

      <section className="admin-login-layout" aria-label="Vignify administrator sign in">
        <aside className="admin-login-visual">
          <div className="admin-login-image" aria-hidden="true" />
          <div className="admin-login-image-shade" aria-hidden="true" />
          <div className="admin-login-visual-content">
            <Link href="/" className="admin-login-visual-brand" aria-label="Vignify home">
              <span className="admin-login-brand-mark">V</span>
              <span>Vignify</span>
            </Link>

            <div className="admin-login-story">
              <p className="admin-login-eyebrow">
                <span className="admin-login-eyebrow-dot" />
                YOUR WALLPAPER UNIVERSE
              </p>
              <h2>
                Beautiful
                <span>Wallpapers</span>
                for Every Screen
              </h2>
              <p className="admin-login-description">
                Discover, create and share stunning wallpapers with the Vignify community.
              </p>
            </div>
          </div>

          <div className="admin-login-owner">
            <div className="admin-login-avatar" aria-hidden="true">V</div>
            <div className="admin-login-owner-copy">
              <strong>Vignesh Durai</strong>
              <span>Owner <span className="admin-login-owner-separator">•</span> Vignify</span>
              <em>“Turning imagination into beautiful screens.”</em>
            </div>
            <ChevronDown
              size={16}
              strokeWidth={1.8}
              className="admin-login-owner-chevron"
              aria-hidden="true"
            />
          </div>
        </aside>

        <section className="admin-login-content">
          <div className="admin-login-content-inner">
            <Link href="/" className="admin-login-brand" aria-label="Vignify home">
              <span className="admin-login-brand-mark" aria-hidden="true">V</span>
              <span className="admin-login-brand-copy">
                <strong>Vignify</strong>
                <small>Admin Panel</small>
              </span>
            </Link>

            <header className="admin-login-heading">
              <h1>Sign in to Admin Panel</h1>
              <p>Access your Vignify admin dashboard</p>
            </header>

            <form className="admin-login-form" onSubmit={submit}>
              <div className="admin-login-field">
                <label htmlFor="admin-email">Email address</label>
                <div className="admin-login-input-wrap">
                  <Mail size={19} strokeWidth={1.7} aria-hidden="true" />
                  <input
                    id="admin-email"
                    type="email"
                    name="email"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={busy}
                  />
                </div>
              </div>

              <div className="admin-login-field">
                <label htmlFor="admin-password">Password</label>
                <div className="admin-login-input-wrap admin-login-password-wrap">
                  <LockKeyhole size={19} strokeWidth={1.7} aria-hidden="true" />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={busy}
                  />
                  <button
                    type="button"
                    className="admin-login-password-toggle"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    disabled={busy}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="admin-login-options">
                <label className="admin-login-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={busy}
                  />
                  <span>Remember me</span>
                </label>

                <Link href="/forgot-password" className="admin-login-forgot">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <p className="admin-login-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="admin-login-submit" disabled={busy}>
                <span>{busy ? "Signing in..." : "Sign in"}</span>
                {!busy && <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />}
                {busy && <span className="admin-login-spinner" aria-hidden="true" />}
              </button>
            </form>

            <div className="admin-login-divider"><span>or</span></div>

            <Link href="/" className="admin-login-back">
              <ArrowLeft size={16} strokeWidth={1.8} />
              <span>Back to Vignify</span>
            </Link>

            <p className="admin-login-security-note">
              <LockKeyhole size={12} aria-hidden="true" />
              Secure access for authorized administrators
            </p>
          </div>
        </section>
      </section>

      <footer className="admin-login-footer">
        <span>© {new Date().getFullYear()} Vignify. All rights reserved.</span>
        <nav aria-label="Footer">
          <Link href="/privacy">Privacy</Link>
          <span aria-hidden="true">/</span>
          <Link href="/terms">Terms</Link>
          <span aria-hidden="true">/</span>
          <Link href="/help">Help</Link>
        </nav>
      </footer>
    </main>
  );
}
