import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Singleton Supabase client for the Capacitor/Vite mobile app.
 * Reads env vars from both Next.js (NEXT_PUBLIC_*) and Vite (VITE_*) builds.
 * Never uses the service-role key.
 */

let mobileClient: SupabaseClient | null = null;

type ViteEnvironment = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
};

function getSupabaseConfig() {
  const nextUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const nextKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  const viteEnv = (
    import.meta as ImportMeta & { env?: ViteEnvironment }
  ).env;

  const supabaseUrl = (nextUrl || viteEnv?.VITE_SUPABASE_URL)?.trim();
  const supabasePublishableKey = (
    nextKey || viteEnv?.VITE_SUPABASE_PUBLISHABLE_KEY
  )?.trim();

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Supabase configuration is missing. " +
        "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY " +
        "(Next.js) or VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (Vite).",
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
