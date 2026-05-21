"use client";

import { useState } from "react";
import UrlForm from "@/components/UrlForm";
import UrlList from "@/components/UrlList";
import { Link as LinkIcon, BarChart3, Heart } from "lucide-react";
import type { SerializedLink, UserLinkSummary } from "@/lib/user-links";

type DashboardClientProps = {
  userLabel: string;
  initialData: UserLinkSummary;
};

type CreatedLink = Omit<SerializedLink, "updatedAt"> & {
  updatedAt?: string;
};

export default function DashboardClient({ userLabel, initialData }: DashboardClientProps) {
  const [urls, setUrls] = useState<SerializedLink[]>(initialData.urls);
  const [stats, setStats] = useState({
    totalUrls: initialData.totalUrls,
    totalClicks: initialData.totalClicks,
    favoriteCount: initialData.favoriteCount,
  });

  function handleUrlCreated(url: CreatedLink) {
    setUrls((prev) => [{ ...url, updatedAt: url.updatedAt || url.createdAt }, ...prev]);
    setStats((prev) => ({ ...prev, totalUrls: prev.totalUrls + 1 }));
  }

  function handleUrlDeleted(id: string) {
    const deleted = urls.find((url) => url.code === id);
    setUrls((prev) => prev.filter((url) => url.code !== id));
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
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, <span className="font-semibold text-gray-700">{userLabel}</span>.
            Manage your shortened links.
          </p>
        </div>
      </div>

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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Shorten a new URL
            </h2>
            <UrlForm onUrlCreated={handleUrlCreated} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/50 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Your URLs</h2>
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
