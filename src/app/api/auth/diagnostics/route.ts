
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  return NextResponse.json({
    urlPresent: Boolean(url),
    keyPresent: Boolean(key),
    urlLooksValid: Boolean(
      url && /^https:\/\/.+\.supabase\.co\/?$/.test(url)
    ),
    keyLooksLikePublishable: Boolean(
      key && key.startsWith("sb_publishable_")
    ),
  });
}
