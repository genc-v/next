"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Button from "@/components/Button";
import { useToast } from "@/components/ToastContext";

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>();
  const [success, setSuccess] = useState(false);
  const { showToast } = useToast();

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSuccess(true);
        reset();
      } else {
        showToast("Failed to send message. Please try again.");
      }
    } catch {
      showToast("An error occurred. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-16 pt-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Contact
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
          Get in touch
        </h1>
        <p className="mt-3 max-w-xl text-gray-600">
          Have a question about the project? Fill in the form and your message
          is saved directly to the database via a Next.js API route.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">About the form</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              This form is built with{" "}
              <span className="font-medium text-gray-900">React Hook Form</span>{" "}
              for client-side validation and submits to{" "}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                POST /api/contact
              </code>
              . Each submission is stored in MongoDB with a timestamp.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">Validation rules</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                Name is required
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                Valid email address required
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                Message must be at least 10 characters
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900">Course project</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Built for{" "}
              <em>Zhvillim i Ueb-it në Anën e Klientit</em>. This page
              demonstrates validated form submission with success and error
              state handling.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          {success ? (
            <div className="flex h-full flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <span className="text-2xl font-bold text-green-600">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Message sent
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Your message has been saved. Thanks for reaching out.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 text-sm font-medium text-gray-600 underline hover:text-gray-900"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Send a message
              </h2>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "Enter a valid email address",
                    },
                  })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters",
                    },
                  })}
                  rows={5}
                  className="mt-1 block w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Write your message..."
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5"
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
