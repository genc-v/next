import { BarChart3, Database, LockKeyhole, MousePointerClick } from "lucide-react";

const features = [
  {
    title: "Authentication",
    text: "Credentials and Google sign-in are handled through NextAuth with protected user and admin routes.",
    icon: LockKeyhole,
  },
  {
    title: "MongoDB data",
    text: "Users and contact messages are modeled with Mongoose, while each user owns their shortened URLs.",
    icon: Database,
  },
  {
    title: "Link workflow",
    text: "Logged-in users can create, copy, delete, and favorite URLs from a focused dashboard.",
    icon: MousePointerClick,
  },
  {
    title: "Reporting",
    text: "Click totals are stored on each URL and summarized from the database in the dashboard.",
    icon: BarChart3,
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          About the project
        </p>
        <div className="mt-4 grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-start">
          <div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-gray-900">
              A complete client-side web development project built around URL management.
            </h1>
            <p className="mt-5 text-gray-600">
              Shorty was built for the course &quot;Zhvillim i Ueb-it në Anën e
              Klientit&quot;. It combines a polished React interface with Next.js
              routing, authentication, MongoDB persistence, protected pages, and
              tested reusable components.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-5">
            <h2 className="text-sm font-semibold text-gray-900">Project scope</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Framework</dt>
                <dd className="font-medium text-gray-900">Next.js 16</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Database</dt>
                <dd className="font-medium text-gray-900">MongoDB</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Auth</dt>
                <dd className="font-medium text-gray-900">NextAuth</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-500">Styling</dt>
                <dd className="font-medium text-gray-900">Tailwind CSS</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article
              key={feature.title}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-800">
                <Icon size={20} />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{feature.text}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
