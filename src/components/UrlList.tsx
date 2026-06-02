"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Trash2, ExternalLink, Heart, BarChart3 } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface ShortenedUrl {
  code: string;
  originalUrl: string;
  shortUrl?: string;
  clicks?: number;
  favorite?: boolean;
  createdAt: string;
}

interface UrlListProps {
  urls: ShortenedUrl[];
  onUrlDeleted: (code: string) => void;
  onFavoriteChanged?: (code: string, favorite: boolean) => void;
}

export default function UrlList({ urls, onUrlDeleted, onFavoriteChanged }: UrlListProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [favoriteLoadingCode, setFavoriteLoadingCode] = useState<string | null>(null);
  const { copyToClipboard } = useCopyToClipboard();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  function getShortUrl(url: ShortenedUrl) {
    return url.shortUrl || `${appUrl}/${url.code}`;
  }

  async function handleCopy(url: ShortenedUrl) {
    const copied = await copyToClipboard(getShortUrl(url));
    if (copied) {
      setCopiedCode(url.code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  }

  async function handleDelete(url: ShortenedUrl) {
    if (!confirm("Are you sure you want to delete this shortened URL?")) return;

    setDeletingCode(url.code);
    try {
      const res = await fetch(`/api/urls?code=${url.code}`, { method: "DELETE" });
      if (res.ok) onUrlDeleted(url.code);
    } catch (error) {
      console.error("Failed to delete URL:", error);
    } finally {
      setDeletingCode(null);
    }
  }

  async function handleFavorite(url: ShortenedUrl) {
    const nextFavorite = !url.favorite;
    setFavoriteLoadingCode(url.code);
    try {
      const res = await fetch("/api/urls", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: url.code, favorite: nextFavorite }),
      });
      if (res.ok) onFavoriteChanged?.(url.code, nextFavorite);
    } catch (error) {
      console.error("Failed to update favorite:", error);
    } finally {
      setFavoriteLoadingCode(null);
    }
  }

  if (urls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/50 py-12 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <ExternalLink size={20} />
        </div>
        <h3 className="text-sm font-medium text-gray-900">No links yet</h3>
        <p className="mt-1 max-w-sm text-sm text-gray-500">
          You haven&apos;t shortened any URLs. Use the form to create your first short link.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {urls.map((url) => {
        const shortLink = getShortUrl(url);
        return (
          <div
            key={url.code}
            className="group flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm sm:flex-row sm:items-center"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <a
                  href={shortLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
                >
                  {shortLink}
                  <ExternalLink size={12} className="text-blue-400" />
                </a>
              </div>
              <p className="mb-1 truncate text-sm text-gray-500" title={url.originalUrl}>
                {url.originalUrl}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>
                  {new Date(url.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="h-1 w-1 rounded-full bg-gray-300" />
                <span>{url.clicks || 0} clicks</span>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-gray-100 pt-3 sm:ml-4 sm:border-0 sm:pt-0">
              <Link
                href={`/urls/${url.code}`}
                className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-1.5 text-gray-400 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                title="View analytics"
              >
                <BarChart3 size={14} />
              </Link>
              <button
                onClick={() => handleFavorite(url)}
                disabled={favoriteLoadingCode === url.code}
                className={`flex items-center justify-center rounded-md border p-1.5 transition-colors ${
                  url.favorite
                    ? "border-rose-200 bg-rose-50 text-rose-600"
                    : "border-gray-200 bg-white text-gray-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                }`}
                title={url.favorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart size={14} fill={url.favorite ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => handleCopy(url)}
                className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                  copiedCode === url.code
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {copiedCode === url.code ? <Check size={14} /> : <Copy size={14} />}
                {copiedCode === url.code ? "Copied" : "Copy"}
              </button>
              <button
                onClick={() => handleDelete(url)}
                disabled={deletingCode === url.code}
                className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-1.5 text-gray-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                title="Delete link"
              >
                {deletingCode === url.code ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-red-600" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
