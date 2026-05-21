import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { getUserLinkSummary } from "@/lib/user-links";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  await dbConnect();
  const initialData = await getUserLinkSummary(session.user.id);

  return (
    <DashboardClient
      userLabel={session.user.name || session.user.email || "User"}
      initialData={initialData}
    />
  );
}
