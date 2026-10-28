import { ModulePage } from "@/components/module-page";
import { requireAdmin } from "@/lib/auth";
import { Bell } from "lucide-react";
export default async function Page(){await requireAdmin();return <ModulePage title={'Notifications'} description={'Prepare admin announcements and delivery history.'} phase={'Phase 2'} icon={Bell} items={[]}/>}
