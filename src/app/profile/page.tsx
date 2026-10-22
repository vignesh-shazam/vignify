
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileClient, { type ProfileWallpaper } from "./profile-client";

export const metadata = {
  title: "My Profile | Vignify",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?next=/profile");
  }

  const {
    data,
    error: wallpapersError,
  } = await supabase
    .from("wallpapers")
    .select("id,title,description,status,created_at")
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  const uploads: ProfileWallpaper[] = (data ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description ?? "",
    status: item.status,
    createdAt: item.created_at,
  }));

  const displayName = String(
    user.user_metadata?.full_name ??
      user.user_metadata?.name ??
      user.email?.split("@")[0] ??
      "Creator"
  );

  return (
    <ProfileClient
      email={user.email ?? ""}
      displayName={displayName}
      uploads={uploads}
      loadError={Boolean(wallpapersError)}
    />
  );
}
