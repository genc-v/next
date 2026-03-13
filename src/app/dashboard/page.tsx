"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import UrlForm from "@/components/UrlForm";
import UrlList from "@/components/UrlList";

interface ShortenedUrl {
  _id?: string;
  id?: string;
  code: string;
  originalUrl: string;
  shortUrl?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUrls = useCallback(async () => {
    try {
      const res = await fetch("/api/urls");
      const data = await res.json();
      if (res.ok) {
        setUrls(data.urls);
      }
    } catch (error) {
      console.error("Failed to fetch URLs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (status === "authenticated") {
      fetchUrls();
    }
  }, [status, router, fetchUrls]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  function handleUrlCreated(url: ShortenedUrl) {
    setUrls((prev) => [url, ...prev]);
  }

  function handleUrlDeleted(id: string) {
    setUrls((prev) => prev.filter((u) => (u.id || u._id) !== id));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {session.user?.name || session.user?.email}. Create and manage
          your shortened URLs.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Shorten a URL
        </h2>
        <UrlForm onUrlCreated={handleUrlCreated} />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Your URLs ({urls.length})
        </h2>
        <UrlList urls={urls} onUrlDeleted={handleUrlDeleted} />
      </div>
    </div>
  );
}
