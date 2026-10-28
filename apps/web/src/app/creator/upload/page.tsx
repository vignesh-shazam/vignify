import { redirect } from "next/navigation";
import { createClient } from "@vignify/supabase/server";
import CreatorUploadClient from "./upload-client";

export const metadata = { title: "My Uploads | Vigniti" };

export default async function CreatorUploadPage() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login?next=/creator/upload");

  return <CreatorUploadClient email={user.email ?? ""} />;
}
