import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password =
    typeof body.password === "string" ? body.password : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) {
    return NextResponse.json(
      { error: "Enter a valid email and password." },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        {
          error:
            "Invalid email or password, or email confirmation is required.",
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Signed in successfully.",
      user: {
        id: data.user.id,
        email: data.user.email,
        name:
          typeof data.user.user_metadata?.full_name === "string"
            ? data.user.user_metadata.full_name
            : data.user.email,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to sign in. Please try again." },
      { status: 500 },
    );
  }
}   