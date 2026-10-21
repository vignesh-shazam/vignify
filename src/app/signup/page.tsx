
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rules = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
  ];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError("Complete all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    if (rules.some((rule) => !rule.valid)) {
      setError("Your password does not meet the requirements.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!terms) {
      setError("Please accept the terms to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Registration failed. Please try again.");
        return;
      }

      setMessage(
        result.message ??
          "Registration request completed. Check your email if confirmation is required."
      );

      if (result.requiresEmailConfirmation) {
        setPassword("");
        setConfirm("");
      }
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      visual="signup"
      eyebrow="Join the community"
      title={
        <>
          Create your <span className="text-[#B9F56B]">account.</span>
        </>
      }
      description="Join Vignify and start making your Android experience uniquely yours."
      footer={
        <p className="text-center text-sm text-white/55">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#B9F56B] hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm text-white/70">Full name</span>
          <input
            className="vignify-input w-full"
            name="fullName"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-white/70">
            Email address
          </span>
          <input
            className="vignify-input w-full"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-white/70">Password</span>
          <span className="relative block">
            <input
              className="vignify-input w-full pr-16"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 text-xs text-white/55 hover:text-[#B9F56B]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </span>
        </label>

        <ul className="space-y-2 text-xs">
          {rules.map((rule) => (
            <li
              key={rule.label}
              className={
                rule.valid ? "text-[#B9F56B]" : "text-white/40"
              }
            >
              <span className="mr-2">{rule.valid ? "✓" : "○"}</span>
              {rule.label}
            </li>
          ))}
        </ul>

        <label className="block">
          <span className="mb-2 block text-sm text-white/70">
            Confirm password
          </span>
          <input
            className="vignify-input w-full"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Confirm your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={isSubmitting}
          />
        </label>

        <label className="flex items-start gap-3 text-xs leading-5 text-white/55">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-1 accent-[#B9F56B]"
            disabled={isSubmitting}
          />
          <span>
            I agree to the{" "}
            <Link
              href="/terms"
              className="text-[#B9F56B] hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-[#B9F56B] hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        {message && (
          <p
            role="status"
            className="rounded-xl border border-[#B9F56B]/20 bg-[#B9F56B]/10 p-3 text-sm leading-6 text-[#B9F56B]"
          >
            {message}
            {message.toLowerCase().includes("confirmation") && (
              <span className="mt-1 block text-xs text-white/60">
                Check your inbox and spam folder for the confirmation email.
              </span>
            )}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/25 border-t-black" />
              Creating account...
            </span>
          ) : (
            <>
              Create account <span className="ml-2">→</span>
            </>
          )}
        </button>
      </form>
    </AuthLayout>
  );
}
