import { ModulePage } from "@/components/admin/module-page";
import { requireAdmin } from "@/lib/admin/auth";
import { Settings } from "lucide-react";
export default async function Page(){await requireAdmin();return <ModulePage title={'Settings & Security'} description={'Review owner access controls, moderation safeguards, and application settings.'} phase={'MVP'} icon={Settings} items={['Owner access', 'Security checklist', 'Moderation defaults']}/>}
