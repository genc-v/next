export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-6 pb-12">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
        <div className="h-3 w-16 rounded bg-gray-200" />
        <div className="mt-2 h-8 w-48 rounded-lg bg-gray-200" />
        <div className="mt-2 h-4 w-80 rounded bg-gray-200" />
      </div>

      {/* Account info */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 h-4 w-20 rounded bg-gray-200" />
        <div className="rounded-lg bg-gray-50 p-4 space-y-2">
          <div className="h-3 w-16 rounded bg-gray-200" />
          <div className="h-5 w-32 rounded bg-gray-200" />
          <div className="h-4 w-48 rounded bg-gray-200" />
          <div className="mt-1 h-6 w-14 rounded-full bg-gray-200" />
        </div>
      </div>

      {/* Name form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="h-4 w-28 rounded bg-gray-200" />
        <div>
          <div className="h-4 w-12 rounded bg-gray-200" />
          <div className="mt-1 h-10 w-full rounded-lg bg-gray-200" />
        </div>
        <div className="h-9 w-28 rounded-md bg-gray-200" />
      </div>

      {/* Password form */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="h-4 w-36 rounded bg-gray-200" />
        <div className="h-4 w-56 rounded bg-gray-200" />
        {[0, 1, 2].map((i) => (
          <div key={i}>
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="mt-1 h-10 w-full rounded-lg bg-gray-200" />
          </div>
        ))}
        <div className="h-9 w-36 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}
