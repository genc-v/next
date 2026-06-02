import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Click from "@/models/Click";
import { parseUA } from "@/lib/utils";

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
  "urls",
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
  let lookupFailed = false;

  try {
    await dbConnect();

    const headersList = await headers();
    const ua = headersList.get("user-agent") || "";
    const referrer = headersList.get("referer") || "";
    const ip = (headersList.get("x-forwarded-for") || "").split(",")[0].trim();
    const { device, os, browser } = parseUA(ua);

    await User.findOneAndUpdate(
      { "links.code": code },
      { $inc: { "links.$.clicks": 1 } }
    );

    const user = await User.findOne(
      { "links.code": code },
      { _id: 1, "links.$": 1 }
    );

    originalUrl = user?.links?.[0]?.originalUrl;

    if (user && originalUrl) {
      Click.create({
        urlCode: code,
        userId: user._id,
        timestamp: new Date(),
        referrer,
        device,
        os,
        browser,
        ip,
      }).catch((err) => console.error("Click record failed:", err));
    }
  } catch (error) {
    console.error("Short-code redirect failed:", error);
    lookupFailed = true;
  }

  if (!originalUrl) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center">
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {lookupFailed ? "Redirect unavailable" : "Short link not found"}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            {lookupFailed
              ? "We could not check this short URL."
              : `No link exists for /${code}`}
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {lookupFailed
              ? "The database lookup failed. Check the deployment environment variables and MongoDB connection, then try again."
              : "This code is not saved in the current database, or it may have been deleted."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Go home
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Open dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  redirect(originalUrl);
}
