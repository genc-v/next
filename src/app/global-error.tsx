"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-gray-50 font-sans antialiased">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <span className="text-3xl font-bold text-red-600">!</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-red-800">
            Critical error
          </h1>
          <p className="mt-2 text-sm text-red-600">
            {error.message || "A critical error occurred."}
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded-md bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
