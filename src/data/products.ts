export type Product = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  category: string;
  features: string[];
};

export const sampleProducts: Product[] = [
  {
    slug: "starter-links",
    name: "Starter Links",
    tagline: "Simple short links for personal projects.",
    description:
      "A lightweight plan for students, portfolios, and small campaigns that need memorable short URLs without advanced reporting.",
    price: "Free",
    category: "Personal",
    features: ["Unlimited redirects", "Basic dashboard", "Google sign-in"],
  },
  {
    slug: "campaign-suite",
    name: "Campaign Suite",
    tagline: "Organize launch links and track activity.",
    description:
      "Designed for teams that publish many links and need a cleaner workflow for reviewing, sharing, and managing campaign URLs.",
    price: "$12/mo",
    category: "Teams",
    features: ["Team-ready dashboard", "Admin moderation", "Priority support"],
  },
  {
    slug: "analytics-pro",
    name: "Analytics Pro",
    tagline: "Sharper insight for high-volume links.",
    description:
      "A reporting-focused package for users who need quick visibility into link performance and operational activity.",
    price: "$24/mo",
    category: "Analytics",
    features: ["Live statistics", "Export-ready reports", "Advanced filters"],
  },
];
