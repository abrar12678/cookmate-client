"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const subscribeMutation = useMutation({
    mutationFn: async () => {
      await api.post("/newsletter/subscribe", { email });
    },
    onSuccess: () => {
      toast.success("Subscribed successfully!");
      setEmail("");
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to subscribe";
      toast.error(msg);
    },
  });

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes("@")) return;
    subscribeMutation.mutate();
  };

  return (
    <section className="py-20 bg-accent dark:bg-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">
          Stay Updated
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 mb-8 max-w-md mx-auto">
          Get the latest recipes, AI cooking tips, and exclusive content
          delivered to your inbox.
        </p>

        <div className="flex max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input-premium flex-1 px-4 py-2.5 border border-neutral-300 dark:border-neutral-600 border-r-0 bg-white dark:bg-neutral-700 rounded-l-xl text-neutral-800 dark:text-neutral-100 text-sm placeholder-neutral-400 outline-none"
          />
          <Button
            onClick={handleSubscribe}
            isLoading={subscribeMutation.isPending}
            className="rounded-l-none rounded-r-lg"
          >
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  );
}