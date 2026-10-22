import { ModulePage } from "@/components/admin/module-page";
import { requireAdmin } from "@/lib/admin/auth";
import { Tags } from "lucide-react";
export default async function Page(){await requireAdmin();return <ModulePage title={'Categories & Tags'} description={'Organize wallpaper categories and tags used throughout Vignify.'} phase={'MVP'} icon={Tags} items={['Category list', 'Tag management', 'Display order']}/>}
