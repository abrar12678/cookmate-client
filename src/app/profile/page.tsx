"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import AuthGuard from "@/components/layout/AuthGuard";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Save } from "lucide-react";
import type { ApiResponse, User } from "@/types";

function ProfileContent() {
  const { user, __triggerRefresh } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState((user as User | null)?.bio || "");

  const updateMutation = useMutation<ApiResponse<{ user: User }>, Error, void>({
    mutationFn: async () => {
      const res = await api.put<ApiResponse<{ user: User }>>("/auth/profile", { name, bio });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      // Re-fetch user data via the auth context
      api.get("/auth/me").then((res) => {
        const userData = (res.data as ApiResponse<{ user: User }>).data?.user;
        if (userData) {
          __triggerRefresh(userData);
        }
      }).catch(() => {});
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update profile";
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.warning("Name is required");
      return;
    }
    updateMutation.mutate();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">
      <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">My Profile</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <Input
          label="Name"
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div>
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            Email
          </label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="input-premium w-full rounded-lg border border-neutral-300 dark:border-neutral-600 px-4 py-2.5 text-sm text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-800 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            Bio
          </label>
          <textarea
            rows={4}
            maxLength={500}
            placeholder="Tell us about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="input-premium w-full border border-neutral-300 dark:border-neutral-600 rounded-lg px-4 py-2.5 text-sm dark:bg-neutral-800 dark:text-neutral-100 outline-none resize-none"
          />
          <p className="text-xs text-neutral-400 mt-1">{bio.length}/500 characters</p>
        </div>

        <Button type="submit" size="lg" isLoading={updateMutation.isPending}>
          <Save className="h-4 w-4 mr-1.5" />
          Save Changes
        </Button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}