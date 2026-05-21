import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div className="space-y-12">
      <section className="grid min-h-[62vh] items-center gap-10 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Next.js URL Shortener
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Shorten, organize, and manage links from one dashboard.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-gray-600">
            Create short, memorable URLs, save important links as favorites, and
            use admin tools for user and link management.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={session?.user ? "/dashboard" : "/auth/signup"}
              className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              {session?.user ? "Open dashboard" : "Get started"}
            </Link>
            <Link
              href="/about"
              className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View project
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="space-y-3">
            {["Create short URLs", "Review saved links", "Track real clicks", "Manage admin data"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/about" className="rounded-lg border border-gray-200 bg-white p-5 hover:border-gray-300">
          <h2 className="font-semibold text-gray-900">About</h2>
          <p className="mt-2 text-sm text-gray-600">Project description and feature summary.</p>
        </Link>
        <Link href="/contact" className="rounded-lg border border-gray-200 bg-white p-5 hover:border-gray-300">
          <h2 className="font-semibold text-gray-900">Contact</h2>
          <p className="mt-2 text-sm text-gray-600">Validated contact form stored in MongoDB.</p>
        </Link>
        <Link href="/faq" className="rounded-lg border border-gray-200 bg-white p-5 hover:border-gray-300">
          <h2 className="font-semibold text-gray-900">FAQ</h2>
          <p className="mt-2 text-sm text-gray-600">Answers about accounts, links, and favorites.</p>
        </Link>
      </div>
    </div>
  );
}
