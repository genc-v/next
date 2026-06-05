export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="h-8 w-40 rounded-lg bg-gray-200" />
        <div className="h-4 w-64 rounded bg-gray-200" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gray-200" />
              <div className="space-y-2">
                <div className="h-3 w-20 rounded bg-gray-200" />
                <div className="h-7 w-10 rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content columns */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form card */}
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 lg:col-span-1">
          <div className="h-5 w-36 rounded bg-gray-200" />
          <div className="h-11 w-full rounded-lg bg-gray-200" />
          <div className="h-11 w-full rounded-lg bg-gray-200" />
        </div>

        {/* URL list card */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50/50 px-6 py-4">
            <div className="h-5 w-24 rounded bg-gray-200" />
            <div className="h-5 w-12 rounded-full bg-gray-200" />
          </div>
          <div className="space-y-3 p-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-full rounded-xl bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
