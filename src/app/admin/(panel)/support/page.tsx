import { ModulePage } from "@/components/admin/module-page";
import { requireAdmin } from "@/lib/admin/auth";
import { MessageCircle } from "lucide-react";
export default async function Page(){await requireAdmin();return <ModulePage title={'Support & Feedback'} description={'Manage user support requests and product feedback.'} phase={'Phase 2'} icon={MessageCircle} items={[]}/>}
