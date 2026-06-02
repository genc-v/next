export default function FavoritesLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-6">
      {/* Header card */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="h-3 w-20 rounded bg-gray-200" />
        <div className="mt-2 h-8 w-40 rounded-lg bg-gray-200" />
        <div className="mt-2 h-4 w-72 rounded bg-gray-200" />
      </div>

      {/* URL list */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-16 w-full rounded-xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}
