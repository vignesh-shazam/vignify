import { ModulePage } from "@/components/admin/module-page";
import { requireAdmin } from "@/lib/admin/auth";
import { Wrench } from "lucide-react";
export default async function Page(){await requireAdmin();return <ModulePage title={'SEO & Content Pages'} description={'Manage SEO metadata, canonical URLs, and editorial pages.'} phase={'Phase 2'} icon={Wrench} items={[]}/>}
