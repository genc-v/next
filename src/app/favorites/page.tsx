"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UrlList from "@/components/UrlList";

type FavoriteUrl = {
  _id?: string;
  id?: string;
  code: string;
  originalUrl: string;
  shortUrl?: string;
  clicks?: number;
  favorite?: boolean;
  createdAt: string;
};

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [urls, setUrls] = useState<FavoriteUrl[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/urls?favorite=true")
        .then((res) => res.json())
        .then((data) => setUrls(data.urls || []))
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  function handleUrlDeleted(id: string) {
    setUrls((prev) => prev.filter((url) => (url.id || url._id || url.code) !== id));
  }

  function handleFavoriteChanged(code: string, favorite: boolean) {
    if (!favorite) {
      setUrls((prev) => prev.filter((url) => url.code !== code));
      return;
    }

    setUrls((prev) => prev.map((url) => (url.code === code ? { ...url, favorite } : url)));
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
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Saved links
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Favorite URLs
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Mark important shortened URLs from the dashboard and review them here.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Back to dashboard
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <UrlList
          urls={urls}
          onUrlDeleted={handleUrlDeleted}
          onFavoriteChanged={handleFavoriteChanged}
        />
      </div>
    </div>
  );
}
