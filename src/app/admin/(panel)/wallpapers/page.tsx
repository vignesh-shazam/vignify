import { requireAdmin } from "@/lib/admin/auth";
import WallpapersClient from "./wallpapers-client";
export default async function WallpapersPage(){const {supabase}=await requireAdmin();const {data,error}=await supabase.from('wallpapers').select('id,title,description,image_path,status,created_at,creator_id,deleted_at').order('created_at',{ascending:false}).limit(200);return <WallpapersClient initialRows={data??[]} loadError={error?.message??null}/>}
