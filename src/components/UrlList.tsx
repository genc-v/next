"use client";

import { useState } from "react";
import { Copy, Check, Trash2, ExternalLink, Heart } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

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

interface UrlListProps {
  urls: ShortenedUrl[];
  onUrlDeleted: (id: string) => void;
  onFavoriteChanged?: (code: string, favorite: boolean) => void;
}

export default function UrlList({ urls, onUrlDeleted, onFavoriteChanged }: UrlListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [favoriteLoadingId, setFavoriteLoadingId] = useState<string | null>(null);
  const { copyToClipboard } = useCopyToClipboard();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  function getShortUrl(url: ShortenedUrl) {
    return url.shortUrl || `${appUrl}/${url.code}`;
  }

  function getId(url: ShortenedUrl) {
    return url.id || url._id || url.code;
  }

  async function handleCopy(url: ShortenedUrl) {
    const id = getId(url);
    const copied = await copyToClipboard(getShortUrl(url));
    if (copied) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  async function handleDelete(url: ShortenedUrl) {
    if (!confirm("Are you sure you want to delete this shortened URL?")) return;
    
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

  async function handleFavorite(url: ShortenedUrl) {
    const nextFavorite = !url.favorite;
    setFavoriteLoadingId(url.code);

    try {
      const res = await fetch("/api/urls", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: url.code, favorite: nextFavorite }),
      });

      if (res.ok) {
        onFavoriteChanged?.(url.code, nextFavorite);
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
    } finally {
      setFavoriteLoadingId(null);
    }
  }

  if (urls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-12 text-center bg-gray-50/50">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3 text-gray-400">
          <ExternalLink size={20} />
        </div>
        <h3 className="text-sm font-medium text-gray-900">No links yet</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-sm">
          You haven&apos;t shortened any URLs. Use the form to create your first short link.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {urls.map((url) => {
        const id = getId(url);
        const shortLink = getShortUrl(url);
        return (
          <div
            key={id}
            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <a 
                  href={shortLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1.5"
                >
                  {shortLink}
                  <ExternalLink size={12} className="text-blue-400" />
                </a>
              </div>
              <p className="truncate text-sm text-gray-500 mb-1" title={url.originalUrl}>
                {url.originalUrl}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{new Date(url.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                <span>ID: {url.code}</span>
                <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                <span>{url.clicks || 0} clicks</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:ml-4 border-t border-gray-100 sm:border-0 pt-3 sm:pt-0">
              <button
                onClick={() => handleFavorite(url)}
                disabled={favoriteLoadingId === url.code}
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
                  copiedId === id 
                    ? "border-green-200 bg-green-50 text-green-700" 
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {copiedId === id ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === id ? "Copied" : "Copy"}
              </button>
              <button
                onClick={() => handleDelete(url)}
                disabled={deletingId === id}
                className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-1.5 text-gray-400 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                title="Delete link"
              >
                {deletingId === id ? (
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
