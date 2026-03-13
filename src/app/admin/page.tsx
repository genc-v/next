"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  urlCount: number;
  createdAt: string;
}

interface UrlOwner {
  _id: string;
  name: string;
  email: string;
}

interface UrlInfo {
  _id: string;
  code: string;
  originalUrl: string;
  userId: UrlOwner | string;
  createdAt: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type Tab = "users" | "urls";

const PER_PAGE = 10;

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("users");
  const [loading, setLoading] = useState(true);

  // Users state
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [usersMeta, setUsersMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: PER_PAGE,
    totalPages: 0,
  });
  const [usersSearch, setUsersSearch] = useState("");
  const [usersPage, setUsersPage] = useState(1);
  const [usersLoading, setUsersLoading] = useState(false);

  // URLs state
  const [urls, setUrls] = useState<UrlInfo[]>([]);
  const [urlsMeta, setUrlsMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: PER_PAGE,
    totalPages: 0,
  });
  const [urlsSearch, setUrlsSearch] = useState("");
  const [urlsPage, setUrlsPage] = useState(1);
  const [urlsLoading, setUrlsLoading] = useState(false);

  // Edit state
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  // Messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Debounce refs
  const usersDebounce = useRef<ReturnType<typeof setTimeout>>(undefined);
  const urlsDebounce = useRef<ReturnType<typeof setTimeout>>(undefined);

  // ── Fetch functions ──

  const fetchUsers = useCallback(
    async (page: number, search: string) => {
      setUsersLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: PER_PAGE.toString(),
        });
        if (search) params.set("search", search);

        const res = await fetch(`/api/admin/users?${params}`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setUsersMeta({
            total: data.total,
            page: data.page,
            limit: data.limit,
            totalPages: data.totalPages,
          });
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setUsersLoading(false);
      }
    },
    []
  );

  const fetchUrls = useCallback(
    async (page: number, search: string) => {
      setUrlsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: PER_PAGE.toString(),
        });
        if (search) params.set("search", search);

        const res = await fetch(`/api/admin/urls?${params}`);
        const data = await res.json();
        if (res.ok) {
          setUrls(data.urls);
          setUrlsMeta({
            total: data.total,
            page: data.page,
            limit: data.limit,
            totalPages: data.totalPages,
          });
        }
      } catch (err) {
        console.error("Failed to fetch URLs:", err);
      } finally {
        setUrlsLoading(false);
      }
    },
    []
  );

  // ── Initial load ──

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (status === "authenticated") {
      if (session?.user?.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      Promise.all([fetchUsers(1, ""), fetchUrls(1, "")]).then(() =>
        setLoading(false)
      );
    }
  }, [status, session, router, fetchUsers, fetchUrls]);

  // ── Refetch on page change ──

  useEffect(() => {
    if (!loading) fetchUsers(usersPage, usersSearch);
  }, [usersPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loading) fetchUrls(urlsPage, urlsSearch);
  }, [urlsPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Debounced search ──

  function handleUsersSearchChange(value: string) {
    setUsersSearch(value);
    clearTimeout(usersDebounce.current);
    usersDebounce.current = setTimeout(() => {
      setUsersPage(1);
      fetchUsers(1, value);
    }, 300);
  }

  function handleUrlsSearchChange(value: string) {
    setUrlsSearch(value);
    clearTimeout(urlsDebounce.current);
    urlsDebounce.current = setTimeout(() => {
      setUrlsPage(1);
      fetchUrls(1, value);
    }, 300);
  }

  // ── Messages ──

  function clearMessages() {
    setError("");
    setSuccess("");
  }

  function showSuccess(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  }

  // ── User CRUD ──

  function startEditing(user: UserInfo) {
    clearMessages();
    setEditingUser(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
    });
  }

  function cancelEditing() {
    setEditingUser(null);
    setEditForm({ name: "", email: "", password: "", role: "" });
    clearMessages();
  }

  async function handleUpdateUser(userId: string) {
    clearMessages();

    const updates: Record<string, string> = {};
    if (editForm.name) updates.name = editForm.name;
    if (editForm.email) updates.email = editForm.email;
    if (editForm.password) updates.password = editForm.password;
    if (editForm.role) updates.role = editForm.role;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update user");
        return;
      }

      showSuccess("User updated successfully");
      setEditingUser(null);
      await fetchUsers(usersPage, usersSearch);
    } catch {
      setError("Failed to update user");
    }
  }

  async function handleDeleteUser(userId: string, userName: string) {
    clearMessages();

    if (
      !confirm(
        `Delete user "${userName}" and all their URLs? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to delete user");
        return;
      }

      showSuccess("User deleted successfully");
      await fetchUsers(usersPage, usersSearch);
      // Also refresh URLs since that user's URLs are gone
      await fetchUrls(urlsPage, urlsSearch);
    } catch {
      setError("Failed to delete user");
    }
  }

  async function handleDeleteUrl(urlId: string) {
    clearMessages();

    if (!confirm("Delete this URL? This cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/urls?id=${urlId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete URL");
        return;
      }

      showSuccess("URL deleted successfully");
      await fetchUrls(urlsPage, urlsSearch);
      // Refresh user counts too
      await fetchUsers(usersPage, usersSearch);
    } catch {
      setError("Failed to delete URL");
    }
  }

  // ── Pagination helpers ──

  function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | "...")[] = [1];

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);
    return pages;
  }

  // ── Render ──

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage all users and URLs across the platform.
        </p>
      </div>

      {/* Status messages */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1">
        <button
          onClick={() => {
            setTab("users");
            clearMessages();
          }}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "users"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Users ({usersMeta.total})
        </button>
        <button
          onClick={() => {
            setTab("urls");
            clearMessages();
          }}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "urls"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          All URLs ({urlsMeta.total})
        </button>
      </div>

      {/* ═══════════ USERS TAB ═══════════ */}
      {tab === "users" && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={usersSearch}
              onChange={(e) => handleUsersSearchChange(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* List */}
          <div className="space-y-3">
            {usersLoading ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-500">Searching...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center">
                <p className="text-sm text-gray-500">
                  {usersSearch
                    ? `No users matching "${usersSearch}"`
                    : "No users found."}
                </p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  {editingUser === user._id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-medium text-gray-500">
                            Name
                          </label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                name: e.target.value,
                              }))
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">
                            Email
                          </label>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                email: e.target.value,
                              }))
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">
                            New Password (leave empty to keep current)
                          </label>
                          <input
                            type="password"
                            value={editForm.password}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                password: e.target.value,
                              }))
                            }
                            placeholder="Enter new password"
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500">
                            Role
                          </label>
                          <select
                            value={editForm.role}
                            onChange={(e) =>
                              setEditForm((f) => ({
                                ...f,
                                role: e.target.value,
                              }))
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateUser(user._id)}
                          className="rounded-md bg-black px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="rounded-md border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">
                          {user.urlCount} URLs &middot; Joined{" "}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        <button
                          onClick={() => startEditing(user)}
                          className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        {user._id !== session.user.id && (
                          <button
                            onClick={() =>
                              handleDeleteUser(user._id, user.name)
                            }
                            className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {usersMeta.totalPages > 1 && (
            <Pagination
              meta={usersMeta}
              onPageChange={setUsersPage}
              getPageNumbers={getPageNumbers}
            />
          )}
        </div>
      )}

      {/* ═══════════ URLS TAB ═══════════ */}
      {tab === "urls" && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={urlsSearch}
              onChange={(e) => handleUrlsSearchChange(e.target.value)}
              placeholder="Search by short code, URL, or owner..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* List */}
          <div className="space-y-3">
            {urlsLoading ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-500">Searching...</p>
              </div>
            ) : urls.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center">
                <p className="text-sm text-gray-500">
                  {urlsSearch
                    ? `No URLs matching "${urlsSearch}"`
                    : "No URLs found."}
                </p>
              </div>
            ) : (
              urls.map((url) => {
                const owner =
                  typeof url.userId === "object" ? url.userId : null;
                const appUrl =
                  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

                return (
                  <div
                    key={url._id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-black">
                        {appUrl}/{url.code}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {url.originalUrl}
                      </p>
                      <p className="text-xs text-gray-400">
                        By{" "}
                        {owner
                          ? `${owner.name} (${owner.email})`
                          : "Unknown"}{" "}
                        &middot;{" "}
                        {new Date(url.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handleDeleteUrl(url._id)}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {urlsMeta.totalPages > 1 && (
            <Pagination
              meta={urlsMeta}
              onPageChange={setUrlsPage}
              getPageNumbers={getPageNumbers}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ── Pagination Component ──

function Pagination({
  meta,
  onPageChange,
  getPageNumbers,
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  getPageNumbers: (current: number, total: number) => (number | "...")[];
}) {
  const pages = getPageNumbers(meta.page, meta.totalPages);
  const startItem = (meta.page - 1) * meta.limit + 1;
  const endItem = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-xs text-gray-500">
        Showing {startItem}-{endItem} of {meta.total}
      </p>

      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(meta.page - 1)}
          disabled={meta.page <= 1}
          className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="px-2 py-1.5 text-xs text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[2rem] rounded-md px-2.5 py-1.5 text-xs font-medium ${
                p === meta.page
                  ? "bg-black text-white"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(meta.page + 1)}
          disabled={meta.page >= meta.totalPages}
          className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
