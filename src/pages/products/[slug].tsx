import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { sampleProducts, type Product } from "@/data/products";

type ProductDetailsProps = {
  product: Product;
};

export default function ProductDetailsPage({ product }: ProductDetailsProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-black">
        Back to products
      </Link>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
              {product.category}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-3 text-gray-600">{product.description}</p>
          </div>
          <div className="rounded-md bg-gray-100 px-4 py-3 text-center">
            <p className="text-xs text-gray-500">Price</p>
            <p className="text-lg font-bold text-gray-900">{product.price}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-900">Included features</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {product.features.map((feature) => (
              <li
                key={feature}
                className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 rounded-md bg-gray-50 p-4 text-sm text-gray-600">
          Favorites are managed from your shortened URLs in the dashboard.
        </div>
      </section>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: sampleProducts.map((product) => ({ params: { slug: product.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ProductDetailsProps> = async (context) => {
  const slug = context.params?.slug as string;
  const product = sampleProducts.find((item) => item.slug === slug);

  if (!product) {
    return { notFound: true };
  }

  return {
    props: { product },
    revalidate: 3600,
  };
};
