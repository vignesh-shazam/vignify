# Vignify Admin Panel — Setup and Verification

## Included

- Owner-only admin login at `/admin/login`
- Shared admin layout with the 15 approved navigation modules
- Dashboard and All Wallpapers moderation UI
- Module placeholder pages for planned features
- Server-side owner authorization based on Supabase `app_metadata.role`
- Wallpaper moderation RPC, soft deletion/recovery, and audit-log migration
- Private wallpaper image access rules for owners, authorized admins, and published/non-deleted wallpapers

## Important security rules

- Do not commit `.env.local`, `.env.*`, passwords, tokens, or service-role keys.
- Never assign the admin role through `user_metadata`; it is user-editable.
- Grant `app_metadata.role = admin` only to the intended owner account.
- Review and test the migration in a staging Supabase project before production.
- The service-role key is not required by this implementation and must never be exposed in browser code.

## Environment

Create a local `.env.local` yourself (do not commit it) with the variables already used by the app:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

Use your actual project values locally. Do not paste secrets into chat or commit them.

## Database migration

Review `supabase/migrations/202610220001_admin_panel.sql` and apply it first in a staging project. The migration adds soft-delete/review metadata, the audit log table, admin moderation RPC, and storage read policy.

This migration assumes the existing `public.wallpapers` table and private Storage bucket named `wallpapers` are already present. Verify the existing policies and backup the database before production application.

## Assign the owner role

In Supabase Dashboard → SQL Editor, verify the exact email for the intended owner account, then run the following with the placeholder replaced by that exact email:

```sql
UPDATE auth.users
SET raw_app_meta_data =
  COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
WHERE email = 'OWNER_EMAIL_HERE'
RETURNING id, email, raw_app_meta_data;
```

Confirm exactly one intended user was updated and the returned metadata contains `"role": "admin"`. Do not grant the role to other accounts. Sign out of the app and sign in again so the refreshed session contains the updated role.

## Run locally

```bash
npm install
npm run dev
```

Useful verification commands:

```bash
npm run typecheck
npm run lint
npm run build
```

Open `http://localhost:3000/admin/login`, sign in with the authorized owner account, then verify `/admin` and `/admin/wallpapers`.

## Current implementation status

- Dashboard and All Wallpapers are connected to the existing `wallpapers` table.
- Moderation actions call a database RPC that rechecks the trusted role server-side.
- Other navigation modules are included; some are explicitly starter/Coming Soon pages and do not yet have full database workflows.
- Analytics, billing, subscriptions, notifications, and other planned features should not be treated as production-complete.

## Design reference

The approved All Wallpapers screenshot is included at `docs/admin-all-wallpapers-reference.png`. Preserve its dark surface, lime/cyan accents, sidebar hierarchy, status tabs, KPI cards, and four-column desktop wallpaper grid.
