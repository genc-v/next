const faqs = [
  {
    q: "What can a normal user do?",
    a: "A logged-in user can shorten URLs, copy short links, mark important URLs as favorites, review click counts, and update their profile name.",
  },
  {
    q: "What can an admin do?",
    a: "Admins can access the Admin Panel, search users and URLs, update user details and roles, and remove users or URLs when needed.",
  },
  {
    q: "How are favorites stored?",
    a: "Favorites are stored directly on each shortened URL inside the logged-in user's MongoDB record, so the Favorites page only shows that user's saved links.",
  },
  {
    q: "How are clicks counted?",
    a: "Each redirect increments the click counter for the matching shortened URL. The dashboard total is calculated from those stored values.",
  },
  {
    q: "Which pages demonstrate static generation?",
    a: "The Products listing and Product Details pages use static generation with ISR. Product Details also uses getStaticPaths for dynamic routes.",
  },
];

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Help center
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
          Frequently asked questions
        </h1>
        <p className="mt-4 max-w-2xl text-gray-600">
          Quick answers for the main user, admin, favorites, and data-fetching
          flows included in the project.
        </p>
      </section>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <article
            key={faq.q}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-base font-semibold text-gray-900">{faq.q}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{faq.a}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
