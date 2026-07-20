"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { AdminNewsletter, ApiResponse, Pagination } from "@/types";
import { Search, Trash2, ChevronLeft, ChevronRight, Mail, Download } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminNewslettersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<ApiResponse<{ newsletters: AdminNewsletter[]; pagination: Pagination }>>({
    queryKey: ["admin-newsletters", page, search],
    queryFn: async () => {
      const res = await api.get("/admin/newsletters", { params: { page, limit: 10, search } });
      return res.data;
    },
  });

  const newsletters = data?.data?.newsletters || [];
  const pagination = data?.data?.pagination;

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/newsletters/${id}`);
    },
    onSuccess: () => {
      toast.success("Subscription deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-newsletters"] });
    },
    onError: () => toast.error("Failed to delete"),
  });

  const exportEmails = () => {
    const emails = newsletters.map((n) => n.email).join("\n");
    const blob = new Blob([emails], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-emails.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Emails exported");
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Newsletters</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Manage newsletter subscribers
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search emails..."
              className="input-premium w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 text-sm placeholder-neutral-400 outline-none"
            />
          </div>
          <button
            onClick={exportEmails}
            className="btn-premium flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 shrink-0 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-white dark:bg-neutral-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : newsletters.length === 0 ? (
        <div className="text-center py-16">
          <Mail className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500">No subscribers found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden">
          <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
            {newsletters.map((sub) => (
              <div
                key={sub._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{sub.email}</p>
                    <p className="text-xs text-neutral-400">{new Date(sub.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Remove ${sub.email}?`)) deleteMutation.mutate(sub._id);
                  }}
                  disabled={deleteMutation.isPending}
                  className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 dark:border-neutral-700">
              <p className="text-sm text-neutral-500">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-premium p-2 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="btn-premium p-2 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}