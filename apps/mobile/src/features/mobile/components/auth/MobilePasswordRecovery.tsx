
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { createMobileSupabaseClient } from "@/lib/supabase";
import "./MobilePasswordRecovery.css";

export type RecoveryScreen = "forgot" | "reset";

type MobilePasswordRecoveryProps = {
  screen: RecoveryScreen;
  onBackToLogin: () => void;
  onResetComplete?: () => void;
};

export default function MobilePasswordRecovery({
  screen,
  onBackToLogin,
}: MobilePasswordRecoveryProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  const requirements = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One number", valid: /\d/.test(password) },
    {
      label: "Passwords match",
      valid: password === confirmPassword && password.length > 0,
    },
  ];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (screen === "forgot") {
      if (!email.trim()) {
        setError("Enter the email address associated with your account.");
        return;
      }
    } else {
      if (requirements.slice(0, 3).some((item) => !item.valid)) {
        setError("Please meet all password requirements.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Your passwords don't match.");
        return;
      }
    }

    setBusy(true);

    try {
      const supabase = createMobileSupabaseClient();

      if (screen === "forgot") {
        const { error: recoveryError } =
          await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: "vignify://reset-password",
          });

        if (recoveryError) throw recoveryError;

        setMessage(
          "If an account exists for this email, you'll receive password-reset instructions shortly.",
        );
        setCompleted(true);
      } else {
        const { data, error: updateError } =
          await supabase.auth.updateUser({ password });

        if (updateError) throw updateError;

        if (!data.user) {
          throw new Error(
            "Your recovery session could not be verified. Please open the latest password-reset email and try again.",
          );
        }

        setMessage("Your password has been updated successfully.");
        setCompleted(true);
      }
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  const isReset = screen === "reset";

  return (
    <main className="vignify-recovery">
      <div className="vignify-recovery-glow glow-one" />
      <div className="vignify-recovery-glow glow-two" />

      <div className="vignify-recovery-inner">
        <header className="vignify-recovery-header">
          <button
            type="button"
            className="vignify-recovery-back"
            onClick={onBackToLogin}
            aria-label="Back to login"
          >
            <ArrowLeft size={19} />
          </button>
          <span>VIGNITI</span>
          <ShieldCheck size={18} className="vignify-recovery-shield" />
        </header>

        <section className="vignify-recovery-illustration" aria-hidden="true">
          <div className="vignify-recovery-halo" />

          {isReset ? (
            <div className="vignify-recovery-lock-scene">
              <div className="vignify-recovery-lock-shackle" />
              <div className="vignify-recovery-lock-body">
                <LockKeyhole size={43} strokeWidth={1.4} />
              </div>
              <span className="recovery-particle particle-one" />
              <span className="recovery-particle particle-two" />
              <span className="recovery-particle particle-three" />
            </div>
          ) : (
            <div className="vignify-recovery-envelope-scene">
              <div className="vignify-recovery-envelope">
                <div className="envelope-flap" />
                <div className="envelope-paper">
                  <KeyRound size={28} />
                </div>
                <div className="envelope-front" />
              </div>
              <div className="vignify-recovery-mini-lock">
                <LockKeyhole size={18} />
              </div>
              <span className="recovery-particle particle-one" />
              <span className="recovery-particle particle-two" />
              <span className="recovery-particle particle-three" />
            </div>
          )}
        </section>

        <section className="vignify-recovery-content">
          <p className="vignify-recovery-eyebrow">
            {isReset ? "SECURE YOUR ACCOUNT" : "ACCOUNT RECOVERY"}
          </p>

          <h1>
            {isReset ? (
              <>
                New <span>password.</span>
              </>
            ) : (
              <>
                Forgot your <span>password?</span>
              </>
            )}
          </h1>

          <p className="vignify-recovery-description">
            {isReset
              ? "Create a strong password to protect your Vigniti account."
              : "It happens. Enter your email and we'll send you instructions to get back in."}
          </p>

          {completed ? (
            <div className="vignify-recovery-success" role="status">
              <span className="vignify-recovery-success-icon">
                <Check size={22} />
              </span>
              <p>{message}</p>
              <button
                type="button"
                className="vignify-recovery-submit"
                onClick={onBackToLogin}
              >
                Back to sign in <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <form className="vignify-recovery-form" onSubmit={handleSubmit}>
              {isReset ? (
                <>
                  <label className="vignify-recovery-field">
                    <span>New password</span>
                    <div className="vignify-recovery-input">
                      <LockKeyhole size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Create a strong password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </label>

                  <label className="vignify-recovery-field">
                    <span>Confirm password</span>
                    <div className="vignify-recovery-input">
                      <LockKeyhole size={18} />
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Enter your password again"
                        required
                      />
                    </div>
                  </label>

                  <div className="vignify-recovery-checklist">
                    {requirements.map((item) => (
                      <div key={item.label} className={item.valid ? "valid" : ""}>
                        <Check size={14} />
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <label className="vignify-recovery-field">
                  <span>Email address</span>
                  <div className="vignify-recovery-input">
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
              )}

              {error && (
                <p className="vignify-recovery-error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="vignify-recovery-submit"
                disabled={busy}
              >
                <span>
                  {busy
                    ? "Please wait..."
                    : isReset
                      ? "Update password"
                      : "Send recovery email"}
                </span>
                {!busy && <ArrowRight size={18} />}
              </button>
            </form>
          )}

          {!completed && (
            <button
              type="button"
              className="vignify-recovery-login-link"
              onClick={onBackToLogin}
            >
              <ArrowLeft size={15} /> Back to sign in
            </button>
          )}
        </section>
      </div>
    </main>
  );
}
