"use client";

import { useState } from "react";

interface ShortenedUrl {
  id: string;
  code: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/very/long/url/that/needs/shortening"
          required
          className="flex-1 rounded-md border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
