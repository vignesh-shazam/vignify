# Vigniti Monorepo

Vigniti is a premium digital customization marketplace for Android — wallpapers, themes, icon packs, ringtones, and more.

---

## Architecture

```
Vignify/
├── apps/
│   ├── admin/     — Platform administration (Next.js, port 3001)
│   ├── web/       — Public website & creator marketplace (Next.js, port 3000)
│   └── mobile/    — Android app (Vite + Capacitor)
├── packages/
│   ├── shared/    — Shared TypeScript types, constants, utilities
│   ├── supabase/  — Supabase client factories (client / server / mobile)
│   └── ui/        — Shared UI primitives (reserved for future use)
├── supabase/      — Database migrations and Supabase config
├── scripts/       — Build and Android automation scripts
└── docs/          — Architecture, setup, deployment, migration docs
```

Each application is independently deployable and buildable.

---

## Prerequisites

- Node.js >= 20
- npm >= 10
- Java JDK 17 (for Android builds)
- Android SDK (for APK generation)
- Supabase project

---

## Installation

```bash
# From the monorepo root (Vignify/)
npm install
```

This installs dependencies for all workspaces via a single root `node_modules`.

---

## Environment Setup

Each application has its own `.env.example`. Copy and fill in values:

```bash
cp apps/admin/.env.example apps/admin/.env.local
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env.local
```

Required variables for all apps:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |

Mobile additionally uses:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Same as above, for Vite build |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Same as above, for Vite build |

**Never commit `.env.local` or any real credentials.**

---

## Development

```bash
# Start individual apps
npm run dev:admin    # http://localhost:3001
npm run dev:web      # http://localhost:3000
npm run dev:mobile   # Vite dev server (open in browser or cap run android)
```

---

## Building

```bash
npm run build:admin
npm run build:web
npm run build:mobile
```

Or build all at once:

```bash
bash scripts/build/build-all.sh
```

---

## Type Checking & Linting

```bash
npm run typecheck    # TypeScript check across all apps
npm run lint         # ESLint across all apps
```

---

## Android APK Generation

Prerequisites: Android Studio, Java 17, Android SDK.

```bash
# Full pipeline: Vite build → Capacitor sync → Gradle APK
npm run android:sync    # Sync Capacitor assets to Android project
npm run android:build   # Build debug APK

# Or use the convenience script
bash scripts/android/sync-and-build.sh
```

APK output: `apps/mobile/android/app/build/outputs/apk/debug/app-debug.apk`

Android app identity: `com.vignify.app` — **never change this without approval**.

---

## Deployment

| App | Deployment target |
|---|---|
| Admin | Independent Vercel / server deployment |
| Web | Independent Vercel / server deployment |
| Mobile | Android APK (Google Play Store or direct distribution) |

Each app is deployed independently. They share the same Supabase project.

---

## Supabase

Migrations are under `supabase/migrations/`. To apply:

```bash
supabase db push
```

Supabase Row Level Security policies are the primary authorization boundary.
The admin app uses `app_metadata.role === "admin"` for server-side authorization.

---

## Rollback

The original single-app codebase remains intact at `vignify/` (the git repository root).
The monorepo is built at `Vignify/` alongside it. To roll back:

1. Return to `vignify/` and run `npm install && npm run dev`.
2. The original app is unchanged — nothing was deleted.

---

## Troubleshooting

**`@vignify/shared` not found**
Run `npm install` from the monorepo root. Workspace symlinks are created automatically.

**Capacitor sync fails**
Run `npm run build:mobile` first to produce the `capacitor-web/` directory, then `npm run android:sync`.

**`next-env.d.ts` missing**
Run `next dev` or `next build` once in the relevant app — Next.js generates this file automatically.
