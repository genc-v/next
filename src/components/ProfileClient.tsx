"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Button from "@/components/Button";

type NameForm = {
  name: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ProfileClientProps = {
  initialUser: {
    name: string;
    email: string;
    role: string;
    hasPassword: boolean;
  };
};

export default function ProfileClient({ initialUser }: ProfileClientProps) {
  const { update } = useSession();
  const [displayName, setDisplayName] = useState(initialUser.name);

  const [nameMessage, setNameMessage] = useState("");
  const [nameError, setNameError] = useState("");

  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");

  const nameForm = useForm<NameForm>({
    defaultValues: { name: initialUser.name },
  });

  const pwForm = useForm<PasswordForm>();

  async function onNameSubmit(data: NameForm) {
    setNameMessage("");
    setNameError("");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.name }),
    });
    const payload = await res.json();

    if (!res.ok) {
      setNameError(payload.error || "Update failed");
      return;
    }

    setDisplayName(payload.user.name);
    await update({ name: payload.user.name });
    setNameMessage("Name updated successfully.");
  }

  async function onPasswordSubmit(data: PasswordForm) {
    setPwMessage("");
    setPwError("");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    });
    const payload = await res.json();

    if (!res.ok) {
      setPwError(payload.error || "Password change failed");
      return;
    }

    pwForm.reset();
    setPwMessage("Password changed successfully.");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Account
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
          Profile settings
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your display name and password. Email and role are controlled
          by authentication and admin settings.
        </p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Account</h2>
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-xs text-gray-500">Signed in as</p>
          <p className="mt-1 font-semibold text-gray-900">{displayName}</p>
          <p className="mt-0.5 text-sm text-gray-600">{initialUser.email}</p>
          <span className="mt-2 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
            {initialUser.role}
          </span>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Display name</h2>
        <form onSubmit={nameForm.handleSubmit(onNameSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              {...nameForm.register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" },
              })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            {nameForm.formState.errors.name && (
              <p className="mt-1 text-xs text-red-600">
                {nameForm.formState.errors.name.message}
              </p>
            )}
          </div>

          {nameMessage && <p className="text-sm text-green-700">{nameMessage}</p>}
          {nameError && <p className="text-sm text-red-600">{nameError}</p>}

          <Button
            type="submit"
            disabled={nameForm.formState.isSubmitting}
            className="w-full sm:w-auto"
          >
            {nameForm.formState.isSubmitting ? "Saving..." : "Save name"}
          </Button>
        </form>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-gray-900">Change password</h2>

        {!initialUser.hasPassword ? (
          <p className="text-sm text-gray-500">
            Password change is not available for accounts signed in with Google.
          </p>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-500">
              Enter your current password to set a new one.
            </p>
            <form
              onSubmit={pwForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  {...pwForm.register("currentPassword", {
                    required: "Current password is required",
                  })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
                {pwForm.formState.errors.currentPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {pwForm.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  {...pwForm.register("newPassword", {
                    required: "New password is required",
                    minLength: { value: 6, message: "Must be at least 6 characters" },
                  })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
                {pwForm.formState.errors.newPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {pwForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...pwForm.register("confirmPassword", {
                    required: "Please confirm your new password",
                    validate: (val) =>
                      val === pwForm.getValues("newPassword") ||
                      "Passwords do not match",
                  })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
                {pwForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">
                    {pwForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {pwMessage && <p className="text-sm text-green-700">{pwMessage}</p>}
              {pwError && <p className="text-sm text-red-600">{pwError}</p>}

              <Button
                type="submit"
                disabled={pwForm.formState.isSubmitting}
                className="w-full sm:w-auto"
              >
                {pwForm.formState.isSubmitting ? "Changing..." : "Change password"}
              </Button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
