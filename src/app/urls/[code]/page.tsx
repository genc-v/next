"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, BarChart3, Clock } from "lucide-react";

interface UrlDetail {
  code: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  favorite: boolean;
  createdAt: string;
}

interface ClickEvent {
  _id: string;
  timestamp: string;
  device: string;
  os: string;
  browser: string;
  referrer: string;
}

interface ClickStats {
  clicks: ClickEvent[];
  total: number;
  totalAll: number;
  byDevice: Record<string, number>;
  byOS: Record<string, number>;
  byBrowser: Record<string, number>;
}

interface Filters {
  device: string;
  os: string;
  browser: string;
  from: string;
  to: string;
}

function BreakdownBar({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 truncate text-sm text-gray-600">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div className="h-2 rounded-full bg-black transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-16 shrink-0 text-right text-xs text-gray-500">
        {value} <span className="text-gray-400">({pct}%)</span>
      </span>
    </div>
  );
}

const INITIAL_FILTERS: Filters = { device: "all", os: "all", browser: "all", from: "", to: "" };

export default function UrlDetailPage() {
  const { code } = useParams<{ code: string }>();
  const { status } = useSession();
  const router = useRouter();

  const [urlDetail, setUrlDetail] = useState<UrlDetail | null>(null);
  const [stats, setStats] = useState<ClickStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);

  const fetchData = useCallback(
    async (f: Filters) => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ code, ...f });
        const [urlRes, clicksRes] = await Promise.all([
          fetch(`/api/urls/${code}`),
          fetch(`/api/clicks?${params}`),
        ]);

        if (!urlRes.ok) {
          const d = await urlRes.json();
          setError(d.error || "URL not found");
          return;
        }

        const [urlData, clicksData] = await Promise.all([
          urlRes.json(),
          clicksRes.json(),
        ]);

        setUrlDetail(urlData);
        setStats(clicksData);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    },
    [code]
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (status === "authenticated") {
      fetchData(INITIAL_FILTERS);
    }
  }, [status, router, fetchData]);

  function applyFilters() {
    fetchData(filters);
  }

  function resetFilters() {
    setFilters(INITIAL_FILTERS);
    fetchData(INITIAL_FILTERS);
  }

  if (status === "loading" || (loading && !urlDetail)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-600">{error}</p>
        <Link href="/dashboard" className="text-sm text-gray-600 underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  if (!urlDetail || !stats) return null;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={14} />
          Dashboard
        </Link>
      </div>

      {/* URL summary */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Short URL
            </p>
            <a
              href={urlDetail.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-lg font-bold text-blue-600 hover:underline"
            >
              {urlDetail.shortUrl}
              <ExternalLink size={14} />
            </a>
            <p className="mt-1 truncate text-sm text-gray-500">{urlDetail.originalUrl}</p>
            <p className="mt-2 text-xs text-gray-400">
              Created{" "}
              {new Date(urlDetail.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex gap-6 shrink-0">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{urlDetail.clicks}</p>
              <p className="text-xs text-gray-500">Total clicks</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">{stats.totalAll}</p>
              <p className="text-xs text-gray-500">Tracked events</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Filter</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Device</label>
            <select
              value={filters.device}
              onChange={(e) => setFilters((f) => ({ ...f, device: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="all">All</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">OS</label>
            <select
              value={filters.os}
              onChange={(e) => setFilters((f) => ({ ...f, os: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="all">All</option>
              <option value="Windows">Windows</option>
              <option value="macOS">macOS</option>
              <option value="Android">Android</option>
              <option value="iOS">iOS</option>
              <option value="Linux">Linux</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Browser</label>
            <select
              value={filters.browser}
              onChange={(e) => setFilters((f) => ({ ...f, browser: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="all">All</option>
              <option value="Chrome">Chrome</option>
              <option value="Firefox">Firefox</option>
              <option value="Safari">Safari</option>
              <option value="Edge">Edge</option>
              <option value="Opera">Opera</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">From</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">To</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
              className="w-full rounded-md border border-gray-300 px-2.5 py-1.5 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={applyFilters}
            className="rounded-md bg-black px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Apply
          </button>
          <button
            onClick={resetFilters}
            className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Breakdown stats */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Device</h3>
          <div className="space-y-3">
            {Object.entries(stats.byDevice)
              .sort((a, b) => b[1] - a[1])
              .map(([k, v]) => (
                <BreakdownBar key={k} label={k} value={v} total={stats.total} />
              ))}
            {Object.keys(stats.byDevice).length === 0 && (
              <p className="text-xs text-gray-400">No data yet</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Operating System</h3>
          <div className="space-y-3">
            {Object.entries(stats.byOS)
              .sort((a, b) => b[1] - a[1])
              .map(([k, v]) => (
                <BreakdownBar key={k} label={k} value={v} total={stats.total} />
              ))}
            {Object.keys(stats.byOS).length === 0 && (
              <p className="text-xs text-gray-400">No data yet</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Browser</h3>
          <div className="space-y-3">
            {Object.entries(stats.byBrowser)
              .sort((a, b) => b[1] - a[1])
              .map(([k, v]) => (
                <BreakdownBar key={k} label={k} value={v} total={stats.total} />
              ))}
            {Object.keys(stats.byBrowser).length === 0 && (
              <p className="text-xs text-gray-400">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent clicks table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <Clock size={15} className="text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-900">Click History</h3>
          </div>
          <span className="text-xs text-gray-500">{stats.total} results</span>
        </div>

        {stats.clicks.length === 0 ? (
          <div className="py-10 text-center">
            <BarChart3 size={24} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-gray-400">No clicks match the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
                  <th className="px-5 py-3 text-left font-medium">Time</th>
                  <th className="px-4 py-3 text-left font-medium">Device</th>
                  <th className="px-4 py-3 text-left font-medium">OS</th>
                  <th className="px-4 py-3 text-left font-medium">Browser</th>
                  <th className="px-4 py-3 text-left font-medium">Referrer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.clicks.map((click) => (
                  <tr key={click._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-5 py-3 text-gray-600">
                      {new Date(click.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-600">{click.device}</td>
                    <td className="px-4 py-3 text-gray-600">{click.os}</td>
                    <td className="px-4 py-3 text-gray-600">{click.browser}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-gray-500">
                      {click.referrer || <span className="text-gray-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
