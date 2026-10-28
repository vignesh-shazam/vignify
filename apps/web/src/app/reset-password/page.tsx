
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const rules = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "One number", valid: /[0-9]/.test(password) },
  ];

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!password || !confirm) {
      setError("Complete both password fields.");
    } else if (rules.some((rule) => !rule.valid)) {
      setError("Your password does not meet the requirements.");
    } else if (password !== confirm) {
      setError("Passwords do not match.");
    } else {
      // Demo state only. The backend must verify a reset token and save the password.
      setSuccess(true);
    }
  }

  return (
    <AuthLayout
      visual="reset"
      eyebrow="Account security"
      title={<>Create a new <span className="text-[#B9F56B]">password.</span></>}
      description="Choose a strong password to keep your account safe and secure."
      footer={
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm text-white/60 transition hover:text-[#B9F56B]"
        >
          <span>←</span> Back to login
        </Link>
      }
    >
      {success ? (
        <div
          role="status"
          className="animate-[v-auth-enter_400ms_ease_both] rounded-2xl border border-[#B9F56B]/20 bg-[#B9F56B]/6 p-5"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#B9F56B]/15 text-2xl text-[#B9F56B]">
            ✓
          </div>
          <h2 className="font-semibold">Password checks passed</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">
            This demo has not changed a stored password. A verified reset token
            and backend endpoint are required to complete the reset.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex font-semibold text-[#B9F56B] hover:underline"
          >
            Continue to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">New password</span>
            <span className="relative block">
              <input
                className="vignify-input w-full pr-16"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 text-xs text-white/55 hover:text-[#B9F56B]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
          </label>

          <ul className="space-y-2 py-1 text-xs">
            {rules.map((rule) => (
              <li key={rule.label} className={rule.valid ? "text-[#B9F56B]" : "text-white/40"}>
                <span className="mr-2">{rule.valid ? "✓" : "○"}</span>
                {rule.label}
              </li>
            ))}
          </ul>

          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Confirm new password</span>
            <input
              className="vignify-input w-full"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </label>

          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

          <button type="submit" className="w-full">
            Reset password
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
