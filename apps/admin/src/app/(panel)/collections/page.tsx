import { ModulePage } from "@/components/module-page";
import { requireAdmin } from "@/lib/auth";
import { GalleryVerticalEnd } from "lucide-react";
export default async function Page(){await requireAdmin();return <ModulePage title={'Collections Management'} description={'Manage curated collections and their wallpaper membership.'} phase={'Phase 2'} icon={GalleryVerticalEnd} items={[]}/>}
