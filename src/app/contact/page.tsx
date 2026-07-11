export const dynamic = "force-dynamic"; // SSR — rendered fresh on every request

import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16 pt-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Contact
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
          Get in touch
        </h1>
        <p className="mt-3 max-w-xl text-gray-600">
          Have a question about the project? Fill in the form and your message
          is saved directly to the database via a Next.js API route.
        </p>
      </div>

      <ContactForm />
    </div>
  );
}
