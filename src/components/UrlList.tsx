"use client";

import { useState } from "react";

interface ShortenedUrl {
  _id?: string;
  id?: string;
  code: string;
  originalUrl: string;
  shortUrl?: string;
  createdAt: string;
}

interface UrlListProps {
  urls: ShortenedUrl[];
  onUrlDeleted: (id: string) => void;
}

export default function UrlList({ urls, onUrlDeleted }: UrlListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  function getShortUrl(url: ShortenedUrl) {
    return url.shortUrl || `${appUrl}/${url.code}`;
  }

  function getId(url: ShortenedUrl) {
    return url.id || url._id || url.code;
  }

  async function handleCopy(url: ShortenedUrl) {
    const id = getId(url);
    await navigator.clipboard.writeText(getShortUrl(url));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleDelete(url: ShortenedUrl) {
    const id = getId(url);
    setDeletingId(id);

    try {
      const res = await fetch(`/api/urls?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        onUrlDeleted(id);
      }
    } catch (error) {
      console.error("Failed to delete URL:", error);
    } finally {
      setDeletingId(null);
    }
  }

  if (urls.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">
          No shortened URLs yet. Create your first one above.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {urls.map((url) => {
        const id = getId(url);
        return (
          <div
            key={id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-black">
                {getShortUrl(url)}
              </p>
              <p className="truncate text-sm text-gray-500">
                {url.originalUrl}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(url.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="ml-4 flex items-center gap-2">
              <button
                onClick={() => handleCopy(url)}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                {copiedId === id ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={() => handleDelete(url)}
                disabled={deletingId === id}
                className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {deletingId === id ? "..." : "Delete"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
