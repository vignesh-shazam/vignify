
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Enter your password.");
      return;
    }

    setMessage("Form validated. Connect the authentication API to sign in.");
  }

  return (
    <AuthLayout
      visual="login"
      eyebrow="Welcome back"
      title={<>Good to <span className="text-[#B9F56B]">see you again.</span></>}
      description="Sign in to continue your creative journey with Vignify."
      footer={
        <p className="text-center text-sm text-white/55">
          Don&apos;t have an account?{" "}
          <Link className="font-semibold text-[#B9F56B] hover:underline" href="/signup">
            Sign up
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
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

        <label className="block">
          <span className="mb-2 block text-sm text-white/70">Password</span>
          <span className="relative block">
            <input
              className="vignify-input w-full pr-16"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
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

        <div className="flex items-center justify-between gap-3 text-xs">
          <label className="flex cursor-pointer items-center gap-2 text-white/55">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-[#B9F56B]"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-[#B9F56B] hover:underline">
            Forgot password?
          </Link>
        </div>

        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        {message && <p role="status" className="text-sm leading-6 text-[#B9F56B]">{message}</p>}

        <button type="submit" className="w-full">
          Sign in <span className="ml-2">→</span>
        </button>
      </form>
    </AuthLayout>
  );
}
