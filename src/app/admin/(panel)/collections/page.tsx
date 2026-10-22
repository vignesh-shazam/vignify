import { ModulePage } from "@/components/admin/module-page";
import { requireAdmin } from "@/lib/admin/auth";
import { GalleryVerticalEnd } from "lucide-react";
export default async function Page(){await requireAdmin();return <ModulePage title={'Collections Management'} description={'Manage curated collections and their wallpaper membership.'} phase={'Phase 2'} icon={GalleryVerticalEnd} items={[]}/>}
