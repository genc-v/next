import Card from "@/components/Card";

export default function FAQPage() {
  const faqs = [
    { q: "Is it free to use?", a: "Yes, this URL shortener is completely free for standard use." },
    { q: "Do the links expire?", a: "Currently, no. Links remain active as long as the account is active." },
    { q: "Can I customize the alias?", a: "Not at the moment, links are generated automatically." },
  ];

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
      {faqs.map((faq, i) => (
        <Card key={i} title={faq.q}>
          <p className="text-gray-600">{faq.a}</p>
        </Card>
      ))}
    </div>
  );
}
