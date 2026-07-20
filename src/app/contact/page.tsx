"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Mail, MapPin, Clock, Send } from "lucide-react";

const contactInfo = [
  { icon: Mail, title: "Email", detail: "support@cookmateai.com", sub: "We reply within 24 hours" },
  { icon: MapPin, title: "Location", detail: "San Francisco, CA", sub: "United States" },
  { icon: Clock, title: "Working Hours", detail: "Mon - Fri, 9AM - 6PM PST", sub: "Weekend support coming soon" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const contactMutation = useMutation({
    mutationFn: async () => {
      await api.post("/contact", form);
    },
    onSuccess: () => {
      toast.success("Message sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to send message";
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.warning("Please fill in all required fields");
      return;
    }
    contactMutation.mutate();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-100">Get In Touch</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-3 max-w-lg mx-auto">
          Have a question, suggestion, or just want to say hello? We would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Name"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            icon={<Mail className="h-4 w-4" />}
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />
          <Input
            label="Subject"
            placeholder="What is this about?"
            value={form.subject}
            onChange={(e) => update("subject", e.target.value)}
          />
          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 block">
              Message
            </label>
            <textarea
              rows={5}
              placeholder="Tell us more..."
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              className="input-premium w-full border border-neutral-300 dark:border-neutral-600 rounded-lg px-4 py-2.5 text-sm dark:bg-neutral-800 dark:text-neutral-100 outline-none resize-none"
            />
          </div>
          <Button type="submit" size="lg" className="w-full sm:w-auto" isLoading={contactMutation.isPending}>
            <Send className="h-4 w-4 mr-1.5" />
            Send Message
          </Button>
        </form>

        <div className="space-y-5">
          {contactInfo.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-neutral-50 dark:bg-neutral-800 p-6 rounded-xl flex items-start gap-4"
              >
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-500/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-800 dark:text-neutral-100">{item.title}</h3>
                  <p className="text-neutral-700 dark:text-neutral-200 text-sm mt-0.5">{item.detail}</p>
                  <p className="text-neutral-400 text-xs mt-0.5">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}