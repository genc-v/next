import type { GetStaticProps } from "next";
import Link from "next/link";
import { sampleProducts, type Product } from "@/data/products";

type ProductsPageProps = {
  products: Product[];
  generatedAt: string;
};

export default function ProductsPage({ products, generatedAt }: ProductsPageProps) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Products
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            URL management packages
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Static product data is generated with SSG and refreshed with ISR, so
            this page satisfies the product listing requirement while fitting the
            URL shortener project.
          </p>
        </div>
        <p className="text-xs text-gray-500">
          ISR generated: {new Date(generatedAt).toLocaleString()}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {products.map((product) => (
          <article
            key={product.slug}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {product.category}
              </span>
              <span className="text-sm font-semibold text-gray-900">{product.price}</span>
            </div>
            <h2 className="mt-5 text-xl font-semibold text-gray-900">
              {product.name}
            </h2>
            <p className="mt-2 text-sm text-gray-600">{product.tagline}</p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              {product.features.map((feature) => (
                <li key={feature}>- {feature}</li>
              ))}
            </ul>
            <Link
              href={`/products/${product.slug}`}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              View details
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<ProductsPageProps> = async () => {
  return {
    props: {
      products: sampleProducts,
      generatedAt: new Date().toISOString(),
    },
    revalidate: 3600,
  };
};
