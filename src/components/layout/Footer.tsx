"use client";

import { useState } from "react";
import Link from "next/link";
import { ChefHat } from "lucide-react";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Recipes", href: "/explore" },
  { label: "AI Generator", href: "/ai/generator" },
  { label: "AI Analyzer", href: "/ai/analyzer" },
];

const supportLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
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
    if (!email.trim() || !email.includes("@")) {
      toast.warning("Please enter a valid email");
      return;
    }
    subscribeMutation.mutate();
  };

  return (
    <footer className="bg-neutral-900 text-white dark:bg-black dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <ChefHat className="h-7 w-7 text-primary-500" />
              <span className="text-xl font-bold">
                CookMate <span className="text-primary-500">AI</span>
              </span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Your AI-Powered Recipe Companion. Discover, cook, and share
              amazing recipes.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-primary-400 link-premium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="flex flex-col gap-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-primary-400 link-premium transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-sm text-neutral-400 mb-4">
              Subscribe to our newsletter
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 dark:bg-neutral-900 border border-neutral-700 text-white text-sm placeholder-neutral-500 outline-none focus:border-primary-500 transition-colors"
              />
              <Button
                size="md"
                className="w-full"
                onClick={handleSubscribe}
                isLoading={subscribeMutation.isPending}
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 text-center">
          <p className="text-sm text-neutral-400">
            &copy; {new Date().getFullYear()} CookMate AI. All rights reserved. Made with{" "}
            <span className="text-red-400">&#10084;</span>
          </p>
        </div>
      </div>
    </footer>
  );
}