
"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { createMobileSupabaseClient } from "@/lib/supabase";
import "./MobileAuth.css";

export type MobileAuthScreen = "login" | "signup";

type MobileAuthProps = {
  onAuthenticated: () => void;
  onForgotPassword: () => void;
  onScreenChange: (screen: MobileAuthScreen) => void;
};

export default function MobileAuth({
  onAuthenticated,
  onForgotPassword,
  onScreenChange,
}: MobileAuthProps) {
  const [screen, setScreen] = useState<MobileAuthScreen>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function changeScreen(next: MobileAuthScreen) {
    setScreen(next);
    setError("");
    setMessage("");
    onScreenChange(next);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    if (screen === "signup") {
      if (!fullName.trim()) {
        setError("Please enter your full name.");
        return;
      }

      if (password.length < 8) {
        setError("Your password must contain at least 8 characters.");
        return;
      }

      if (!/[A-Z]/.test(password) || !/\d/.test(password)) {
        setError("Include at least one uppercase letter and one number.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Your passwords don't match.");
        return;
      }

      if (!acceptedTerms) {
        setError("Please accept the terms to create your account.");
        return;
      }
    }

    setBusy(true);

    try {
      const supabase = createMobileSupabaseClient();

      if (screen === "login") {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (authError) {
          throw authError;
        }

        if (rememberMe) {
          localStorage.setItem("vignify-remember-me", "true");
        } else {
          localStorage.removeItem("vignify-remember-me");
        }

        onAuthenticated();
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (authError) {
          throw authError;
        }

        if (data.session) {
          onAuthenticated();
        } else {
          setMessage(
            "Your account was created. Check your email to confirm it, then sign in."
          );
          changeScreen("login");
        }
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  const passwordScore = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  return (
    <main className="vignify-auth">
      <div className="vignify-auth-orb vignify-auth-orb-one" />
      <div className="vignify-auth-orb vignify-auth-orb-two" />
      <div className="vignify-auth-grain" />

      <div className="vignify-auth-scroll">
        <header className="vignify-auth-header">
          {screen === "signup" ? (
            <button
              type="button"
              className="vignify-auth-back"
              onClick={() => changeScreen("login")}
              aria-label="Back to login"
            >
              <ArrowLeft size={19} />
            </button>
          ) : (
            <span className="vignify-auth-brand-icon">
              <Sparkles size={19} />
            </span>
          )}

          <span className="vignify-auth-brand">VIGNITI</span>
          <span className="vignify-auth-secure">
            <ShieldCheck size={14} /> SECURE
          </span>
        </header>

        <section className="vignify-auth-art" aria-hidden="true">
          <div className="vignify-auth-art-glow" />
          <div className="vignify-auth-wallpaper-card">
            <div className="vignify-auth-wallpaper-stars" />
            <div className="vignify-auth-wallpaper-moon" />
            <div className="vignify-auth-wallpaper-mountain mountain-back" />
            <div className="vignify-auth-wallpaper-mountain mountain-front" />
            <div className="vignify-auth-wallpaper-caption">
              <span>AMOLED COLLECTION</span>
              <strong>Beyond ordinary.</strong>
            </div>
          </div>
          <div className="vignify-auth-floating-chip">
            <Sparkles size={13} />
            <span>Made for you</span>
          </div>
        </section>

        <section className="vignify-auth-content">
          <p className="vignify-auth-eyebrow">
            {screen === "login" ? "YOUR WORLD, YOUR STYLE" : "JOIN THE COMMUNITY"}
          </p>

          <h1>
            {screen === "login" ? (
              <>
                Welcome <span>back.</span>
              </>
            ) : (
              <>
                Create your <span>space.</span>
              </>
            )}
          </h1>

          <p className="vignify-auth-subtitle">
            {screen === "login"
              ? "Sign in to discover your next favourite look."
              : "A world of wallpapers and customization awaits."}
          </p>

          <div className="vignify-auth-switch" role="group" aria-label="Authentication mode">
            <button
              type="button"
              className={screen === "login" ? "active" : ""}
              onClick={() => changeScreen("login")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={screen === "signup" ? "active" : ""}
              onClick={() => changeScreen("signup")}
            >
              Create account
            </button>
          </div>

          <form className="vignify-auth-form" onSubmit={handleSubmit}>
            {screen === "signup" && (
              <label className="vignify-auth-field">
                <span>Full name</span>
                <div className="vignify-auth-input-wrap">
                  <UserRound size={18} />
                  <input
                    autoComplete="name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Your name"
                    maxLength={100}
                    required
                  />
                </div>
              </label>
            )}

            <label className="vignify-auth-field">
              <span>Email address</span>
              <div className="vignify-auth-input-wrap">
                <Mail size={18} />
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </label>

            <label className="vignify-auth-field">
              <span>Password</span>
              <div className="vignify-auth-input-wrap">
                <LockKeyhole size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    screen === "login" ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="vignify-auth-eye"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {screen === "signup" && password.length > 0 && (
              <div className="vignify-auth-strength">
                <div className="vignify-auth-strength-bars">
                  {[1, 2, 3, 4].map((level) => (
                    <span
                      key={level}
                      className={level <= passwordScore ? `level-${passwordScore}` : ""}
                    />
                  ))}
                </div>
                <span>
                  {["", "Weak", "Fair", "Good", "Strong"][passwordScore]}
                </span>
              </div>
            )}

            {screen === "signup" && (
              <label className="vignify-auth-field">
                <span>Confirm password</span>
                <div className="vignify-auth-input-wrap">
                  <LockKeyhole size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Enter it again"
                    required
                  />
                </div>
              </label>
            )}

            {screen === "login" ? (
              <div className="vignify-auth-options">
                <label className="vignify-auth-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="vignify-auth-text-button"
                  onClick={onForgotPassword}
                >
                  Forgot password?
                </button>
              </div>
            ) : (
              <label className="vignify-auth-checkbox vignify-auth-terms">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                />
                <span>I agree to the Terms of Service and Privacy Policy.</span>
              </label>
            )}

            {error && (
              <p className="vignify-auth-feedback error" role="alert">
                {error}
              </p>
            )}

            {message && (
              <p className="vignify-auth-feedback success" role="status">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="vignify-auth-submit"
              disabled={busy}
            >
              <span>
                {busy
                  ? "Please wait..."
                  : screen === "login"
                    ? "Sign in"
                    : "Create account"}
              </span>
              {!busy && <ArrowRight size={19} />}
            </button>
          </form>

          <p className="vignify-auth-footer">
            {screen === "login"
              ? "New to Vigniti? "
              : "Already part of Vigniti? "}
            <button
              type="button"
              onClick={() =>
                changeScreen(screen === "login" ? "signup" : "login")
              }
            >
              {screen === "login" ? "Create account" : "Sign in"}
            </button>
          </p>
        </section>
      </div>
    </main>
  );
}
