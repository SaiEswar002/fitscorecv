import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

/**
 * Protected dashboard layout.
 * Server Component — reads session from cookies via createClient().
 * Middleware already guards this route, but we double-check here
 * as a defence-in-depth measure.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--color-surface)" }}
    >
      <DashboardNav user={user} />
      <main className="flex-1 container-max px-4 md:px-6 py-8 w-full">
        {children}
      </main>
    </div>
  );
}
