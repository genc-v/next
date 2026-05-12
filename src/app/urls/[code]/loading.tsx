export default function UrlDetailLoading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-6">
      <div className="h-4 w-24 rounded bg-gray-200" />

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="h-6 w-56 rounded bg-gray-200" />
            <div className="h-4 w-80 rounded bg-gray-200" />
            <div className="h-3 w-32 rounded bg-gray-200" />
          </div>
          <div className="flex gap-6">
            <div className="space-y-1 text-center">
              <div className="h-9 w-14 rounded bg-gray-200" />
              <div className="h-3 w-16 rounded bg-gray-200" />
            </div>
            <div className="space-y-1 text-center">
              <div className="h-9 w-14 rounded bg-gray-200" />
              <div className="h-3 w-20 rounded bg-gray-200" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <div className="mb-4 h-4 w-12 rounded bg-gray-200" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 rounded-md bg-gray-200" />
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-8 w-16 rounded-md bg-gray-200" />
          <div className="h-8 w-16 rounded-md bg-gray-200" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-white p-5 space-y-3">
            <div className="h-4 w-24 rounded bg-gray-200" />
            {[0, 1, 2].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-3 w-16 rounded bg-gray-200" />
                <div className="h-2 flex-1 rounded-full bg-gray-200" />
                <div className="h-3 w-12 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="h-4 w-28 rounded bg-gray-200" />
          <div className="h-3 w-16 rounded bg-gray-200" />
        </div>
        <div className="p-4 space-y-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-full rounded bg-gray-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
