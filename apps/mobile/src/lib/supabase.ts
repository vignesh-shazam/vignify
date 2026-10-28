/**
 * Mobile Supabase client.
 *
 * Reads credentials from Vite environment variables (import.meta.env).
 * Supports both VITE_* and NEXT_PUBLIC_* prefixes — whichever is set in .env.local.
 *
 * Never reads process.env — that is a Node.js global unavailable in Vite browser builds.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let mobileClient: SupabaseClient | null = null;

function getSupabaseConfig() {
  // Vite exposes env vars via import.meta.env.
  // We check VITE_* first, then NEXT_PUBLIC_* (both work if defined in .env.local).
  const env = import.meta.env;

  const supabaseUrl = (
    (env.VITE_SUPABASE_URL as string | undefined) ||
    (env.NEXT_PUBLIC_SUPABASE_URL as string | undefined)
  )?.trim();

  const supabasePublishableKey = (
    (env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
    (env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string | undefined)
  )?.trim();

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Supabase credentials are missing. " +
        "Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to apps/mobile/.env.local",
    );
  }

  return { supabaseUrl, supabasePublishableKey };
}

export function createMobileSupabaseClient(): SupabaseClient {
  if (mobileClient) return mobileClient;

  const { supabaseUrl, supabasePublishableKey } = getSupabaseConfig();

  mobileClient = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storage:
        typeof window !== "undefined" ? window.localStorage : undefined,
    },
  });

  return mobileClient;
}
