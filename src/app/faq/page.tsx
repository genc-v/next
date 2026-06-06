const groups = [
  {
    category: "General",
    items: [
      {
        q: "What is Shorty?",
        a: "Shorty is a URL shortener and click analytics platform. You paste a long URL, get a short link, share it, and then see detailed analytics on who clicked it — device type, operating system, browser, and referrer.",
      },
      {
        q: "Do I need an account to use it?",
        a: "You need an account to create and manage short links. The short links themselves are publicly accessible to anyone with the URL — no login required to click them.",
      },
      {
        q: "Is it free?",
        a: "Yes, the platform is open and free as a course project. All features are available to registered users.",
      },
    ],
  },
  {
    category: "Links & Shortening",
    items: [
      {
        q: "How long are the short codes?",
        a: "Short codes are 7 characters, generated from a base-62 alphanumeric alphabet (0–9, A–Z, a–z) using nanoid. Uniqueness is guaranteed with a collision check before saving.",
      },
      {
        q: "Can I delete a shortened URL?",
        a: "Yes. Every link in your dashboard has a delete button. Once deleted, the short URL stops working immediately and the click data is no longer accessible.",
      },
      {
        q: "What happens if I shorten the same URL twice?",
        a: "Each submission generates a new short code. There is no deduplication, so two submissions of the same destination URL will produce two separate short links.",
      },
      {
        q: "What URLs are accepted?",
        a: "Any URL that starts with http:// or https:// is accepted. The URL is validated before shortening and an error is shown if the format is invalid.",
      },
    ],
  },
  {
    category: "Analytics",
    items: [
      {
        q: "What data is tracked when someone clicks a short link?",
        a: "Every redirect records: timestamp, device type (desktop/mobile/tablet), operating system (Windows, macOS, Android, iOS, Linux), browser (Chrome, Firefox, Safari, Edge), referrer URL, and IP address.",
      },
      {
        q: "How do I filter the analytics?",
        a: "Open any link's analytics page by clicking the chart icon in your dashboard. From there you can filter clicks by device, OS, browser, and date range, then press Apply to update the results.",
      },
      {
        q: "Does the total click count on the dashboard match the analytics page?",
        a: "The dashboard shows the raw click counter embedded on the link. The analytics page shows the count of tracked Click events. These align after the new tracking system is in place — older links clicked before tracking was added may show a small discrepancy.",
      },
    ],
  },
  {
    category: "Account & Admin",
    items: [
      {
        q: "How do I become an admin?",
        a: "Admin role is assigned either through the seed script or by an existing admin editing your account from the Admin Panel. You cannot self-assign the admin role.",
      },
      {
        q: "What can admins do that regular users cannot?",
        a: "Admins have access to the Admin Panel where they can view all users and all links across the platform, edit user details and roles, delete any user (which removes all their links), and delete any URL.",
      },
      {
        q: "Can I change my email address?",
        a: "Users can update their display name from the Profile page. Email changes are handled by admins from the Admin Panel. Google-authenticated accounts have their email set by Google.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-12 pb-16">
      <section className="pt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Help center
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
          Frequently asked questions
        </h1>
        <p className="mt-4 text-gray-600">
          Everything you need to know about accounts, short links, analytics, and
          admin tools.
        </p>
      </section>

      {groups.map((group) => (
        <section key={group.category}>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            {group.category}
          </h2>
          <div className="space-y-2">
            {group.items.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-medium text-gray-900 hover:text-black">
                  <span>{item.q}</span>
                  <span className="shrink-0 text-gray-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="border-t border-gray-100 px-5 pb-5 pt-4 text-sm leading-relaxed text-gray-600">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
