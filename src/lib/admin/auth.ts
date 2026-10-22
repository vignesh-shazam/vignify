import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getAdminSession() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { supabase, user: null, isAdmin: false };
  // app_metadata is controlled by trusted server-side/admin operations, unlike user_metadata.
  const isAdmin = user.app_metadata?.role === "admin";
  return { supabase, user, isAdmin };
}

export async function requireAdmin() {
  const result = await getAdminSession();
  if (!result.user) redirect("/admin/login");
  if (!result.isAdmin) redirect("/home?admin_error=unauthorized");
  return result;
}
