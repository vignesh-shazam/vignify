import { ModulePage } from "@/components/admin/module-page";
import { requireAdmin } from "@/lib/admin/auth";
import { ChartNoAxesColumnIncreasing } from "lucide-react";
export default async function Page(){await requireAdmin();return <ModulePage title={'Analytics & Reports'} description={'Review engagement, content growth, moderation, and creator activity.'} phase={'Phase 2'} icon={ChartNoAxesColumnIncreasing} items={[]}/>}
