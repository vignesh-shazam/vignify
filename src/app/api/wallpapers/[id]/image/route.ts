import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  const { id } = await params;

  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid wallpaper ID." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: wallpaper, error: wallpaperError } = await supabase
    .from("wallpapers")
    .select("id,creator_id,image_path,status,deleted_at")
    .eq("id", id)
    .maybeSingle();

  if (wallpaperError) {
    return NextResponse.json({ error: "Unable to load wallpaper." }, { status: 500 });
  }

  if (!wallpaper) {
    return NextResponse.json({ error: "Wallpaper not found." }, { status: 404 });
  }

  const isOwner = Boolean(user && user.id === wallpaper.creator_id);
  const isAdmin = user?.app_metadata?.role === "admin";
  const isPublic = wallpaper.status === "published" && !wallpaper.deleted_at;

  if (!isPublic && !isOwner && !isAdmin) {
    return NextResponse.json({ error: "Wallpaper not found." }, { status: 404 });
  }

  const { data: file, error: storageError } = await supabase.storage
    .from("wallpapers")
    .download(wallpaper.image_path);

  if (storageError || !file) {
    console.error("Wallpaper image download failed:", storageError?.message);
    return NextResponse.json({ error: "Unable to load wallpaper image." }, { status: 404 });
  }

  const contentType = file.type;
  if (!["image/jpeg", "image/png", "image/webp"].includes(contentType)) {
    return NextResponse.json({ error: "Unsupported image type." }, { status: 415 });
  }

  return new NextResponse(file, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": isPublic ? "public, max-age=300, stale-while-revalidate=60" : "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
      "Vary": "Cookie",
    },
  });
}
