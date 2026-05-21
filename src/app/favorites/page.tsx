import { redirect } from "next/navigation";
import FavoritesClient from "@/components/FavoritesClient";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { getUserLinkSummary } from "@/lib/user-links";

export default async function FavoritesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  await dbConnect();
  const initialData = await getUserLinkSummary(session.user.id, { favoriteOnly: true });

  return <FavoritesClient initialUrls={initialData.urls} />;
}
