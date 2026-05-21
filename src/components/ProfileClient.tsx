"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Button from "@/components/Button";

type ProfileForm = {
  name: string;
};

type ProfileClientProps = {
  initialUser: {
    name: string;
    email: string;
    role: string;
  };
};

export default function ProfileClient({ initialUser }: ProfileClientProps) {
  const { update } = useSession();
  const [displayName, setDisplayName] = useState(initialUser.name);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    defaultValues: { name: initialUser.name },
  });

  async function onSubmit(data: ProfileForm) {
    setMessage("");
    setError("");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const payload = await res.json();

    if (!res.ok) {
      setError(payload.error || "Profile update failed");
      return;
    }

    setDisplayName(payload.user.name);
    await update({ name: payload.user.name });
    setMessage("Profile updated successfully.");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Account
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Profile settings
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Update the profile name shown in the app. Email and role are managed by
          authentication and admin settings.
        </p>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-500">Signed in as</p>
          <p className="mt-1 font-semibold text-gray-900">{displayName}</p>
          <p className="mt-1 text-sm text-gray-600">{initialUser.email}</p>
          <p className="mt-2 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
            {initialUser.role}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" },
              })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          {message && <p className="text-sm text-green-700">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Saving..." : "Save profile"}
          </Button>
        </form>
      </section>
    </div>
  );
}
