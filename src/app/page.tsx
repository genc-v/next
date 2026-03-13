import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900">
        Shorten your URLs
      </h1>
      <p className="mt-4 max-w-md text-lg text-gray-600">
        Create short, memorable links in seconds. Track and manage all your
        shortened URLs in one place.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/auth/signup"
          className="rounded-md bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
        >
          Get Started
        </Link>
        <Link
          href="/auth/signin"
          className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
