import Link from "next/link";
import {
  Link2,
  BarChart3,
  Heart,
  Shield,
  LockKeyhole,
  MousePointerClick,
} from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Instant URL Shortening",
    description:
      "Paste any long URL and get a clean, shareable short link in one click. No setup, no configuration.",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    description:
      "Every redirect is tracked. See total clicks, filter by time range, and understand your link performance.",
  },
  {
    icon: MousePointerClick,
    title: "Device & OS Breakdown",
    description:
      "Know exactly where your clicks come from — mobile or desktop, Windows or iOS, Chrome or Safari.",
  },
  {
    icon: Heart,
    title: "Favorites",
    description:
      "Star your most important links and find them instantly in the Favorites page, separate from the rest.",
  },
  {
    icon: Shield,
    title: "Admin Panel",
    description:
      "Admins can search, edit, and delete any user or link across the entire platform with full pagination.",
  },
  {
    icon: LockKeyhole,
    title: "Secure Authentication",
    description:
      "Sign in with email and password or continue with Google. Sessions are JWT-based and role-protected.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Sign up with an email and password, or use Google. Your account is ready to use immediately.",
  },
  {
    number: "02",
    title: "Paste and shorten",
    description:
      "Paste any URL into the dashboard. A short link is generated instantly and added to your list.",
  },
  {
    number: "03",
    title: "Share and track",
    description:
      "Copy the short link and share it anywhere. Open the analytics page to watch clicks roll in.",
  },
];

export default function Home() {
  return (
    <div className="space-y-24 pb-16">
      <section className="pt-8 text-center md:pt-14">
        <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-500">
          URL Shortener &amp; Analytics Platform
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Short links,{" "}
          <span className="text-gray-400">deep insights.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-gray-600">
          Create short URLs in seconds. Track every click with device, OS,
          browser, and referrer analytics — all from one clean dashboard.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/auth/signup"
            className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Get started free
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Open dashboard
          </Link>
        </div>

        <div className="mx-auto mt-12 max-w-lg">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
              </div>
            </div>
            <div className="space-y-3 p-5">
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
                  Original URL
                </p>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 font-mono text-xs text-gray-500">
                  https://example.com/blog/articles/how-to-track-url-clicks-with-analytics
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-xs text-gray-400">shortened to</span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-gray-400">
                  Short URL
                </p>
                <div className="rounded-lg bg-black px-3 py-2.5 font-mono text-xs text-white">
                  localhost:3000/xK7m2pQ
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Everything you need
          </h2>
          <p className="mt-3 text-gray-600">
            A complete URL management platform built with Next.js, MongoDB, and
            NextAuth.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            How it works
          </h2>
          <p className="mt-3 text-gray-600">
            From a long URL to a tracked short link in three steps.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-200 bg-white text-sm font-bold text-gray-400">
                {step.number}
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Ready to shorten your first link?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-gray-600">
          Create a free account and start shortening URLs with full click
          analytics in under a minute.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/auth/signup"
            className="rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Create free account
          </Link>
          <Link
            href="/about"
            className="rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Learn more
          </Link>
        </div>
      </section>
    </div>
  );
}
