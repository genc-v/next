"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { useToast } from "@/components/ToastContext";

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();
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
        showToast("Message sent successfully!");
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
    <div className="max-w-md mx-auto mt-10">
      <Card title="Contact Us">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              {...register("name", { required: "Name is required" })} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-black focus:ring-black"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email"
              {...register("email", { required: "Email is required" })} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-black focus:ring-black"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea 
              {...register("message", { required: "Message is required" })} 
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-black focus:ring-black"
            ></textarea>
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
