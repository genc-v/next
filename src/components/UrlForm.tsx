"use client";

import { useState } from "react";
import { Link2, Loader2, Sparkles } from "lucide-react";

interface ShortenedUrl {
  id?: string;
  code: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

interface UrlFormProps {
  onUrlCreated: (url: ShortenedUrl) => void;
}

export default function UrlForm({ onUrlCreated }: UrlFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/urls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      onUrlCreated(data.url);
      setUrl("");
    } catch {
      setError("Failed to shorten URL. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Link2 size={18} className="text-gray-400" />
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/very/long/url..."
          required
          className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
      </div>
      
      {error && (
        <p className="text-sm font-medium text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
          {error}
        </p>
      )}
      
      <button
        type="submit"
        disabled={loading || !url.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Shortening...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Shorten Link
          </>
        )}
      </button>
      
    </form>
  );
}
