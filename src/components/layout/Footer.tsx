"use client";

import { useState } from "react";
import Link from "next/link";
import { ChefHat, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/utils";

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
      toast.success("Subscribed to newsletter successfully!");
      setEmail("");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to subscribe to newsletter"));
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.warning("Please enter a valid email address");
      return;
    }
    subscribeMutation.mutate();
  };

  return (
    <footer className="bg-neutral-900 text-white dark:bg-black dark:text-white border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Column 1: Brand & Social Links */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <ChefHat className="h-7 w-7 text-primary-500" />
              <span className="text-xl font-bold">
                CookMate <span className="text-primary-500">AI</span>
              </span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              Your AI-Powered Recipe Companion. Discover recipes, generate custom culinary creations, and analyze food photos.
            </p>

            {/* Social Links with inline SVGs */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-3">
                Connect With Us
              </p>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-primary-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
                  aria-label="GitHub"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-primary-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
                  aria-label="Twitter / X"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-primary-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-primary-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support & Legal */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info & Newsletter */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-2">
              Contact &amp; Newsletter
            </h4>

            {/* Direct Contact Info */}
            <div className="space-y-2 text-xs text-neutral-400 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                <span>support@cookmateai.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                <span>+1 (555) 234-5678</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                <span>San Francisco, CA 94105, USA</span>
              </div>
            </div>

            {/* Newsletter Subscription Form */}
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-white text-sm placeholder-neutral-500 outline-none focus:border-primary-500 transition-colors pr-10"
                />
              </div>
              <Button
                type="submit"
                size="md"
                className="w-full cursor-pointer font-medium"
                isLoading={subscribeMutation.isPending}
              >
                <Send className="h-4 w-4 mr-1.5" />
                Subscribe Now
              </Button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} CookMate AI Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <Link href="/privacy" className="hover:text-neutral-400">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-neutral-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}