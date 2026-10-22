import { ModulePage } from "@/components/admin/module-page";
import { requireAdmin } from "@/lib/admin/auth";
import { BadgeCheck } from "lucide-react";
export default async function Page(){await requireAdmin();return <ModulePage title={'Subscriptions & Plans'} description={'Prepare subscription tiers, entitlements, and billing administration.'} phase={'Phase 3'} icon={BadgeCheck} items={[]}/>}
