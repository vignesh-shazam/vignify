import { ModulePage } from "@/components/admin/module-page";
import { requireAdmin } from "@/lib/admin/auth";
import { ChartNoAxesCombined } from "lucide-react";
export default async function Page(){await requireAdmin();return <ModulePage title={'Revenue & Monetization'} description={'Prepare monetization reporting and future revenue operations.'} phase={'Phase 3'} icon={ChartNoAxesCombined} items={[]}/>}
