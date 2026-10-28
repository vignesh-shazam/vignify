import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/admin-shell";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAdmin();

  return (
    <AdminShell email={user.email ?? "owner@vignify.local"}>
      {children}
    </AdminShell>
  );
}