
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type RegisterBody = {
  fullName?: unknown;
  email?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  let body: RegisterBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const fullName =
    typeof body.fullName === "string" ? body.fullName.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password =
    typeof body.password === "string" ? body.password : "";

  if (!fullName || fullName.length > 100) {
    return NextResponse.json(
      { error: "Enter a name between 1 and 100 characters." },
      { status: 400 }
    );
  }

  if (
    !email ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 }
    );
  }

  if (password.length < 8 || password.length > 128) {
    return NextResponse.json(
      { error: "Password must contain between 8 and 128 characters." },
      { status: 400 }
    );
  }

  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return NextResponse.json(
      { error: "Include at least one uppercase letter and one number." },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();
    console.log("Registration diagnostics:", {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL?.trim(),
      keyPrefix: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
        ?.trim()
        .slice(0, 15),
      keyLength:
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim().length,
    });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      console.error("Supabase registration failed:", {
        message: error.message,
        status: error.status,
        code: error.code,
      });

      return NextResponse.json(
        { error: "Registration failed. Check your Supabase configuration and try again." },
        { status: 400 }
      );
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "Registration could not be completed." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        requiresEmailConfirmation: !data.session,
        message: data.session
          ? "Account created successfully."
          : "Registration received. Check your email for the confirmation link.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration API error:", error);

    return NextResponse.json(
      { error: "A server error occurred. Check the development terminal." },
      { status: 500 }
    );
  }
}
