# Vigniti — Developer Wiki

## Table of Contents

1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Prerequisites](#prerequisites)
4. [First-Time Setup](#first-time-setup)
5. [Environment Variables](#environment-variables)
6. [Development Commands](#development-commands)
7. [Build Commands](#build-commands)
8. [Android APK Build](#android-apk-build)
9. [Supabase](#supabase)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)
12. [Architecture Rules](#architecture-rules)

---

## Project Overview

Vigniti is a premium Android customization marketplace — wallpapers, icon packs, themes, widgets, and setups. The project is structured as an npm workspace monorepo with three independent applications and shared packages.

| App | Purpose | Tech |
|---|---|---|
| `apps/web` | Public website and creator marketplace | Next.js 16, Tailwind v4 |
| `apps/admin` | Platform administration panel | Next.js 16, Tailwind v4 |
| `apps/mobile` | Android app | Vite + React + Capacitor |

---

## Repository Structure

```
vignify/
├── apps/
│   ├── admin/              ← Admin panel (Next.js, port 3001)
│   │   ├── src/app/        ← Next.js App Router routes
│   │   ├── src/components/ ← Admin UI components
│   │   ├── src/lib/        ← Server-side auth helpers
│   │   ├── src/styles/     ← Admin CSS
│   │   ├── .env.example
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                ← Public website (Next.js, port 3000)
│   │   ├── src/app/        ← All public routes
│   │   ├── src/components/ ← Web UI components
│   │   ├── src/lib/        ← Utilities and mock data
│   │   ├── .env.example
│   │   ├── next.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── mobile/             ← Android app (Vite + Capacitor)
│       ├── src/entry/      ← Vite entry point (index.html + main.tsx)
│       ├── src/features/   ← Mobile screens, auth, components
│       ├── src/lib/        ← Mobile Supabase client
│       ├── android/        ← Android Studio project
│       ├── capacitor-web/  ← Vite build output (Capacitor reads this)
│       ├── capacitor.config.ts
│       ├── vite.config.ts
│       ├── .env.example
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── shared/             ← Shared TypeScript types, constants, utils
│   ├── supabase/           ← Supabase client/server/mobile factories
│   └── ui/                 ← Shared UI primitives (reserved)
│
├── supabase/
│   ├── migrations/         ← SQL migrations (version controlled)
│   ├── baseline-schema.sql
│   └── config.toml
│
├── scripts/
│   └── build/
│       ├── build.ps1       ← Full APK pipeline (PowerShell)
│       └── build-all.sh    ← Full build script (bash/WSL)
│
├── docs/
│   └── WIKI.md             ← This file
│
├── package.json            ← Workspace root
├── turbo.json              ← Turborepo pipeline
└── README.md
```

---

## Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| Node.js | >= 20 | JavaScript runtime |
| npm | >= 10 | Package manager |
| Java JDK | 17 | Android builds |
| Android SDK | API 34+ | APK compilation |
| Android Studio | Latest | Android project management |
| Supabase CLI | Latest | Database migrations |

Verify your environment:

```powershell
node --version       # should be v20+
npm --version        # should be 10+
java --version       # should be 17+
```

---

## First-Time Setup

```powershell
# 1. Navigate to the repo root
cd "D:\New Things\p\vignify\vignify"

# 2. Install all workspace dependencies (single command, single lockfile)
npm install

# 3. Set up environment variables for each app
Copy-Item apps\admin\.env.example  apps\admin\.env.local
Copy-Item apps\web\.env.example    apps\web\.env.local
Copy-Item apps\mobile\.env.example apps\mobile\.env.local

# 4. Fill in your Supabase credentials in each .env.local
#    NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
#    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

---

## Environment Variables

### Required for all apps

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key (not service-role) |

### Mobile app additionally needs (for Vite build)

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Same value as `NEXT_PUBLIC_SUPABASE_URL` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Same value as `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |

> **Never commit `.env.local` files. Never use the service-role key in any client-side code.**

---

## Development Commands

Run these from `D:\New Things\p\vignify\vignify\`:

```powershell
# Start the public website (http://localhost:3000)
npm run dev:web

# Start the admin panel (http://localhost:3001)
npm run dev:admin

# Start the mobile Vite dev server
npm run dev:mobile
```

To run multiple apps at once, open separate terminal tabs.

---

## Build Commands

```powershell
# Build individual apps
npm run build:web
npm run build:admin
npm run build:mobile

# Type check all apps
npm run typecheck

# Lint all apps
npm run lint
```

---

## Android APK Build

The mobile app uses **Vite** to produce a web bundle, then **Capacitor** syncs it into the Android project, then **Gradle** compiles the APK.

### Quick way — use the PowerShell script

```powershell
cd "D:\New Things\p\vignify\vignify"
.\scripts\build\build.ps1
```

This runs all three steps automatically and tells you where the APK is.

---

### Manual steps

**Step 1 — Build the Vite web bundle**

```powershell
cd "D:\New Things\p\vignify\vignify"
npm run build:mobile
```

Output goes to: `apps\mobile\capacitor-web\`

---

**Step 2 — Sync Capacitor assets to Android**

```powershell
cd "D:\New Things\p\vignify\vignify\apps\mobile"
npx cap sync android
```

This copies `capacitor-web\` into the Android project.

---

**Step 3 — Build the APK**

```powershell
cd "D:\New Things\p\vignify\vignify\apps\mobile\android"
.\gradlew.bat assembleDebug
```

---

**APK output location:**

```
apps\mobile\android\app\build\outputs\apk\debug\app-debug.apk
```

---

### Release APK

```powershell
cd "D:\New Things\p\vignify\vignify\apps\mobile\android"
.\gradlew.bat assembleRelease
```

> Release builds require a signing keystore. Configure it in `android\app\build.gradle` under `signingConfigs`.

---

### Open in Android Studio

```powershell
cd "D:\New Things\p\vignify\vignify\apps\mobile"
npx cap open android
```

---

## Supabase

### Apply migrations

```powershell
cd "D:\New Things\p\vignify\vignify"
supabase db push
```

### Migration files

Located at `supabase\migrations\`. All migrations are version controlled. Never delete or modify existing migration files — add new ones instead.

### Admin authorization

The admin app checks `user.app_metadata.role === "admin"` server-side. This value is set via the Supabase service-role API or dashboard — it cannot be forged by users. The check happens in `apps\admin\src\lib\auth.ts`.

---

## Deployment

| App | Recommended target | Notes |
|---|---|---|
| `apps/web` | Vercel | `next build` output, auto-detected |
| `apps/admin` | Vercel (separate project) | Set `Root Directory` to `apps/admin` |
| `apps/mobile` | Google Play / direct APK | Build via Gradle, sign for release |

Each app deploys independently. They all share the same Supabase project.

For Vercel, set environment variables in the Vercel dashboard — do not commit `.env.local`.

---

## Troubleshooting

### `npm install` fails or packages not found

Make sure you are running `npm install` from the **repo root** (`vignify/`), not from inside an app folder.

```powershell
cd "D:\New Things\p\vignify\vignify"
npm install
```

---

### `@vignify/shared` or `@vignify/supabase` not found

These are workspace packages. Run `npm install` from the root. npm creates symlinks automatically.

---

### Capacitor sync fails — `webDir does not exist`

You must build the Vite bundle before syncing:

```powershell
npm run build:mobile   # creates apps\mobile\capacitor-web\
cd apps\mobile
npx cap sync android
```

---

### `next-env.d.ts` missing

This file is auto-generated by Next.js. Run `next dev` or `next build` once in the relevant app:

```powershell
npm run dev:web     # generates apps\web\next-env.d.ts
npm run dev:admin   # generates apps\admin\next-env.d.ts
```

---

### Gradle build fails — `SDK location not found`

Create `apps\mobile\android\local.properties` with your Android SDK path:

```
sdk.dir=C\:\\Users\\YOUR_NAME\\AppData\\Local\\Android\\Sdk
```

---

### APK installs but shows blank screen

The Vite bundle in `capacitor-web\` may be outdated. Re-run the full pipeline:

```powershell
.\scripts\build\build.ps1
```

---

### TypeScript errors after editing

```powershell
# Check a specific app
cd apps\web
..\..\node_modules\.bin\tsc.cmd --noEmit

# Check all apps from root
npm run typecheck
```

---

## Architecture Rules

These rules keep the codebase maintainable:

1. **Admin, Web, and Mobile are independent.** They have separate entry points, configs, and build commands.
2. **Shared packages do not import from apps.** `packages/shared` and `packages/supabase` are pure — no app-specific code.
3. **Admin never imports from Web or Mobile.**
4. **Web never imports from Mobile.**
5. **Mobile never imports web page implementations.**
6. **No service-role Supabase key in client code.** Server-side only, never exposed to the browser.
7. **Admin authorization is server-side only.** `requireAdmin()` in `apps/admin/src/lib/auth.ts` — never rely on hiding UI elements.
8. **Never change `com.vignify.app`.** This is the Android package identity. Changing it breaks existing installs.
9. **Never commit secrets.** `.env.local`, API keys, tokens — gitignored always.
10. **All SQL migrations go in `supabase/migrations/`.** Never modify existing migration files.
