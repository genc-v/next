import { Link2, BarChart3, Shield, LockKeyhole, Database, MousePointerClick } from "lucide-react";

const stack = [
  {
    name: "Next.js 16",
    detail: "App Router, Server Components, API Routes, Middleware",
  },
  {
    name: "MongoDB",
    detail: "Mongoose ODM, 3 data models: User, Click, ContactMessage",
  },
  {
    name: "NextAuth v5",
    detail: "JWT sessions, Google OAuth, credentials, role-based access",
  },
  {
    name: "Tailwind CSS v4",
    detail: "Utility-first styling, responsive across mobile, tablet, desktop",
  },
  {
    name: "React Hook Form",
    detail: "Validated forms with error and success feedback",
  },
  {
    name: "TypeScript",
    detail: "Full type safety across components, models, and API routes",
  },
];

const userCapabilities = [
  "Create shortened URLs with a single click",
  "Copy short links to clipboard",
  "Mark important URLs as favorites",
  "View click analytics per link — device, OS, browser, referrer",
  "Filter analytics by time range, device type, and more",
  "Update profile name from the settings page",
];

const adminCapabilities = [
  "View and search all registered users",
  "Edit user name, email, password, and role",
  "Delete any user and all their associated links",
  "View and search all shortened URLs platform-wide",
  "Delete any URL from the admin panel",
  "Paginated results with live search",
];

const highlights = [
  {
    icon: Link2,
    title: "URL Shortening",
    description:
      "7-character alphanumeric short codes generated with nanoid. Collision-safe with a uniqueness check loop.",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    description:
      "Each redirect records a Click document with device, OS, browser, referrer, IP, and timestamp.",
  },
  {
    icon: MousePointerClick,
    title: "Filterable Events",
    description:
      "The analytics page supports filtering by device, OS, browser, and date range with live API queries.",
  },
  {
    icon: Database,
    title: "MongoDB Models",
    description:
      "User (with embedded links), Click (per-visit events), and ContactMessage — three distinct schemas.",
  },
  {
    icon: Shield,
    title: "Role Middleware",
    description:
      "NextAuth middleware protects all authenticated routes. Admins are redirected to dashboard if role check fails.",
  },
  {
    icon: LockKeyhole,
    title: "Secure Auth",
    description:
      "Passwords hashed with bcrypt (cost 12). Google OAuth creates or links accounts automatically.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 pb-16">
      <section className="pt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          About the project
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          A full-stack URL shortener built for the web development course.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-gray-600">
          Shorty is the project for <em>Zhvillim i Ueb-it në Anën e Klientit</em>. It combines
          a clean React interface with Next.js routing, NextAuth authentication,
          MongoDB persistence, click analytics, and a fully functional admin panel.
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Tech stack</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <p className="font-semibold text-gray-900">{item.name}</p>
              <p className="mt-1 text-sm text-gray-600">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Technical highlights
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div
                key={h.title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{h.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {h.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          What you can do
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100">
                <span className="text-xs font-bold text-gray-600">U</span>
              </div>
              <h3 className="font-semibold text-gray-900">Regular user</h3>
            </div>
            <ul className="space-y-2">
              {userCapabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                  {cap}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-800">
                <span className="text-xs font-bold text-white">A</span>
              </div>
              <h3 className="font-semibold text-gray-900">Admin</h3>
            </div>
            <ul className="space-y-2">
              {adminCapabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-800" />
                  {cap}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
