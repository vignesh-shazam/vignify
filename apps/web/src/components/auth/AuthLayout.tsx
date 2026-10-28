"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

type AuthLayoutProps = {
  children: ReactNode;
  eyebrow: string;
  title: ReactNode;
  description: string;
  visual: "login" | "signup" | "forgot" | "reset";
  footer: ReactNode;
};

const visualContent = {
  login: {
    icon: "V",
    label: "Create. Edit. Transform.",
    floating: ["▧", "▶", "✳"],
  },
  signup: {
    icon: "✳",
    label: "Be part of a creative community.",
    floating: ["▧", "＋", "✦"],
  },
  forgot: {
    icon: "✉",
    label: "Your next chapter starts here.",
    floating: ["✉", "↗", "✦"],
  },
  reset: {
    icon: "⌑",
    label: "Your security matters.",
    floating: ["⌑", "✦", "↻"],
  },
};

export default function AuthLayout({
  children,
  eyebrow,
  title,
  description,
  visual,
  footer,
}: AuthLayoutProps) {
  const art = visualContent[visual];

  return (
    <main className="v-auth relative min-h-screen overflow-hidden bg-[#030807] text-white">
      <div aria-hidden="true" className="v-auth-ambient" />
      <div aria-hidden="true" className="v-auth-grid" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1500px] items-center gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:gap-14 lg:px-16 lg:py-12">
        <section className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden rounded-[32px] border border-white/[0.09] bg-white/[0.02] p-9 lg:flex xl:p-12">
          <div className="v-auth-orb v-auth-orb-one" />
          <div className="v-auth-orb v-auth-orb-two" />
          <div className="v-auth-orbit" />

          <Link href="/" className="relative z-10 inline-flex w-fit items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B9F56B] text-xl font-black text-black shadow-[0_0_30px_#B9F56B45]">
              V
            </span>
            <span className="text-2xl font-bold tracking-tight">
              Vigniti<span className="text-[#B9F56B]">.</span>
            </span>
          </Link>

          <div className="relative z-10 max-w-lg">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#B9F56B]">
              {eyebrow}
            </p>
            <h2 className="text-5xl font-semibold leading-[1.08] tracking-tight xl:text-6xl">
              {title}
            </h2>
            <p className="mt-6 max-w-sm text-base leading-7 text-white/55">
              {description}
            </p>

            <div className="relative mt-12 h-52 max-w-md">
              <div className="v-auth-art-card v-auth-art-card-back">
                <span>{art.floating[0]}</span>
              </div>
              <div className="v-auth-art-card v-auth-art-card-front">
                <span>{art.icon}</span>
              </div>
              <div className="v-auth-art-chip">{art.floating[1]}</div>
              <div className="v-auth-art-chip v-auth-art-chip-two">
                {art.floating[2]}
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between gap-4">
            <p className="text-xs text-white/40">{art.label}</p>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <div className="flex gap-2">
                <span className="h-1.5 w-8 rounded-full bg-[#B9F56B]" />
                <span className="h-1.5 w-5 rounded-full bg-white/15" />
                <span className="h-1.5 w-5 rounded-full bg-white/15" />
              </div>
            </div>
          </div>
        </section>

        <section className="v-auth-form-enter mx-auto w-full max-w-[480px]">
          <div className="mb-7 flex items-center justify-between lg:hidden">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B9F56B] text-xl font-black text-black">
                V
              </span>
              <span className="text-2xl font-bold">
                Vigniti<span className="text-[#B9F56B]">.</span>
              </span>
            </Link>
            <span className="text-xs text-white/40">{eyebrow}</span>
          </div>

          <div className="v-auth-glass rounded-[28px] p-6 sm:p-9 md:p-10">
            <div className="mb-8">
              <div className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-[#B9F56B]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#B9F56B]" />
                {eyebrow}
              </div>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-white/50">
                {description}
              </p>
            </div>

            {children}

            <div className="mt-7 border-t border-white/[0.08] pt-6">
              {footer}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-white/30">
            © {new Date().getFullYear()} Vignify. Make it yours.
          </p>
        </section>
      </div>
    </main>
  );
}