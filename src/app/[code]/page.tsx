import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";

const reservedPaths = new Set([
  "about",
  "admin",
  "api",
  "auth",
  "contact",
  "dashboard",
  "faq",
  "favorites",
  "profile",
  "products",
  "_next",
]);

export default async function ShortCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  if (reservedPaths.has(code)) {
    redirect("/");
  }

  await dbConnect();

  const user = await User.findOneAndUpdate(
    { "links.code": code },
    { $inc: { "links.$.clicks": 1 } },
    { new: true, projection: { "links.$": 1 } }
  );

  const link = user?.links?.[0];

  if (!link?.originalUrl) {
    redirect("/");
  }

  redirect(link.originalUrl);
}
