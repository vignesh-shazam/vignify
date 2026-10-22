import { ModulePage } from "@/components/admin/module-page";
import { requireAdmin } from "@/lib/admin/auth";
import { PanelsTopLeft } from "lucide-react";
export default async function Page(){await requireAdmin();return <ModulePage title={'Homepage & Featured Content'} description={'Curate the homepage, featured wallpapers, and editorial placements.'} phase={'Phase 2'} icon={PanelsTopLeft} items={[]}/>}
