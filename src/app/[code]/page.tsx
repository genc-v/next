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

  let originalUrl: string | undefined;

  try {
    await dbConnect();
    const user = await User.findOneAndUpdate(
      { "links.code": code },
      { $inc: { "links.$.clicks": 1 } },
      { new: true, projection: { "links.$": 1 } }
    );
    originalUrl = user?.links?.[0]?.originalUrl;
  } catch (error) {
    console.error("Short-code redirect failed:", error);
    redirect("/");
  }

  if (!originalUrl) {
    redirect("/");
  }

  redirect(originalUrl);
}
