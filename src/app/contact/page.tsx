"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Mail, MapPin, MessageSquare } from "lucide-react";
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
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast("Message sent successfully.");
        reset();
      } else {
        showToast("Failed to send message.");
      }
    } catch {
      showToast("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <section className="grid gap-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-[0.9fr_1.1fr] md:p-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Contact
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900">
            Send a project message
          </h1>
          <p className="mt-4 text-gray-600">
            This form uses React Hook Form validation and stores messages in
            MongoDB through a Next.js API route.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex gap-3 rounded-lg bg-gray-50 p-4">
              <Mail className="mt-0.5 text-gray-500" size={18} />
              <div>
                <p className="text-sm font-medium text-gray-900">Email workflow</p>
                <p className="mt-1 text-sm text-gray-600">Validated submission with success and error feedback.</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg bg-gray-50 p-4">
              <MessageSquare className="mt-0.5 text-gray-500" size={18} />
              <div>
                <p className="text-sm font-medium text-gray-900">Stored messages</p>
                <p className="mt-1 text-sm text-gray-600">Each message is saved with name, email, message, and timestamp.</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg bg-gray-50 p-4">
              <MapPin className="mt-0.5 text-gray-500" size={18} />
              <div>
                <p className="text-sm font-medium text-gray-900">Course project</p>
                <p className="mt-1 text-sm text-gray-600">Built for client-side web development coursework.</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-lg border border-gray-200 bg-gray-50 p-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              {...register("name", { required: "Name is required" })}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Your name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              {...register("message", {
                required: "Message is required",
                minLength: { value: 10, message: "Message must be at least 10 characters" },
              })}
              rows={6}
              className="mt-1 block w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Write your message..."
            />
            {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full py-2.5">
            {loading ? "Sending..." : "Send message"}
          </Button>
        </form>
      </section>
    </div>
  );
}
