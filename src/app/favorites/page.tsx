"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Favorite = {
  _id: string;
  productSlug: string;
  productName: string;
  createdAt: string;
};

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/favorites")
        .then((res) => res.json())
        .then((data) => setFavorites(data.favorites || []))
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  async function removeFavorite(productSlug: string) {
    await fetch(`/api/favorites?productSlug=${encodeURIComponent(productSlug)}`, {
      method: "DELETE",
    });
    setFavorites((items) => items.filter((item) => item.productSlug !== productSlug));
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-gray-500">Loading favorites...</p>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
        <p className="mt-1 text-sm text-gray-600">
          Products saved by the logged-in user.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
          <p className="text-sm text-gray-600">No favorites saved yet.</p>
          <Link
            href="/products"
            className="mt-4 inline-flex rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((favorite) => (
            <div
              key={favorite._id}
              className="flex flex-col justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center"
            >
              <div>
                <Link
                  href={`/products/${favorite.productSlug}`}
                  className="font-semibold text-gray-900 hover:underline"
                >
                  {favorite.productName}
                </Link>
                <p className="mt-1 text-xs text-gray-500">
                  Saved {new Date(favorite.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => removeFavorite(favorite.productSlug)}
                className="rounded-md border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
