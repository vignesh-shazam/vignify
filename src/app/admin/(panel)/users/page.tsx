import { ModulePage } from "@/components/admin/module-page";
import { requireAdmin } from "@/lib/admin/auth";
import { UsersRound } from "lucide-react";
export default async function Page(){await requireAdmin();return <ModulePage title={'Users & Creators'} description={'Search creator accounts, inspect their submissions, and manage access safely.'} phase={'MVP'} icon={UsersRound} items={['Creator directory', 'Account status', 'Submission history']}/>}
