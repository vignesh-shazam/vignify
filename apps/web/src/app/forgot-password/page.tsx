
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitted(false);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    // Demo state only. Connect the real email-reset API here.
    setSubmitted(true);
  }

  return (
    <AuthLayout
      visual="forgot"
      eyebrow="Account recovery"
      title={<>Forgot your <span className="text-[#B9F56B]">password?</span></>}
      description="No worries. Enter your email and we'll help you get back on track."
      footer={
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm text-white/60 transition hover:text-[#B9F56B]"
        >
          <span>←</span> Back to login
        </Link>
      }
    >
      {submitted ? (
        <div
          role="status"
          className="animate-[v-auth-enter_400ms_ease_both] rounded-2xl border border-[#B9F56B]/20 bg-[#B9F56B]/6 p-5"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B9F56B]/15 text-2xl text-[#B9F56B]">
            ✉
          </div>
          <h2 className="font-semibold">Check your inbox</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Your email passed demo validation. A real reset email will be sent
            after backend integration.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="vignify-interactive mt-4 text-sm font-medium text-[#B9F56B] hover:underline"
          >
            Try another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-white/70">Email address</span>
            <input
              className="vignify-input w-full"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

          <button type="submit" className="w-full">
            Send reset link
          </button>

          <div className="rounded-2xl border border-white/[0.025] p-4">
            <div className="flex gap-3">
              <span className="text-xl text-[#B9F56B]">✧</span>
              <div>
                <p className="text-sm font-medium">A fresh start awaits</p>
                <p className="mt-1 text-xs leading-5 text-white/45">
                  Follow the secure link in your email to choose a new password.
                </p>
              </div>
            </div>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
