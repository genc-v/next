"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import UrlForm from "@/components/UrlForm";
import UrlList from "@/components/UrlList";
import { Link as LinkIcon, BarChart3, Heart } from "lucide-react";

interface ShortenedUrl {
  _id?: string;
  id?: string;
  code: string;
  originalUrl: string;
  shortUrl?: string;
  clicks?: number;
  favorite?: boolean;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [stats, setStats] = useState({ totalUrls: 0, totalClicks: 0, favoriteCount: 0 });
  const [loading, setLoading] = useState(true);

  const fetchUrls = useCallback(async () => {
    try {
      const res = await fetch("/api/urls");
      const data = await res.json();
      if (res.ok) {
        setUrls(data.urls);
        setStats({
          totalUrls: data.totalUrls ?? data.urls.length,
          totalClicks: data.totalClicks ?? 0,
          favoriteCount: data.favoriteCount ?? 0,
        });
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
          <p className="text-sm text-gray-500 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  function handleUrlCreated(url: ShortenedUrl) {
    setUrls((prev) => [url, ...prev]);
    setStats((prev) => ({ ...prev, totalUrls: prev.totalUrls + 1 }));
  }

  function handleUrlDeleted(id: string) {
    const deleted = urls.find((u) => (u.id || u._id || u.code) === id);
    setUrls((prev) => prev.filter((u) => (u.id || u._id || u.code) !== id));
    setStats((current) => ({
      ...current,
      totalUrls: Math.max(0, current.totalUrls - 1),
      totalClicks: Math.max(0, current.totalClicks - (deleted?.clicks || 0)),
      favoriteCount: Math.max(0, current.favoriteCount - (deleted?.favorite ? 1 : 0)),
    }));
  }

  function handleUrlFavoriteChanged(code: string, favorite: boolean) {
    setUrls((prev) => prev.map((url) => (url.code === code ? { ...url, favorite } : url)));
    setStats((prev) => ({
      ...prev,
      favoriteCount: Math.max(0, prev.favoriteCount + (favorite ? 1 : -1)),
    }));
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, <span className="font-semibold text-gray-700">{session.user?.name || session.user?.email}</span>. Manage your shortened links.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <LinkIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Links</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUrls}</p>
            </div>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <BarChart3 size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClicks}</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <Heart size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Favorite Links</p>
              <p className="text-2xl font-bold text-gray-900">{stats.favoriteCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* URL Creation Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Shorten a new URL
            </h2>
            <UrlForm onUrlCreated={handleUrlCreated} />
          </div>
        </div>

        {/* URLs List */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Your URLs
              </h2>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                {urls.length} items
              </span>
            </div>
            <div className="p-6">
              <UrlList
                urls={urls}
                onUrlDeleted={handleUrlDeleted}
                onFavoriteChanged={handleUrlFavoriteChanged}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
