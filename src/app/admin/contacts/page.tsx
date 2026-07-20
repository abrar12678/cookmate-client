"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { AdminContact, ApiResponse, Pagination } from "@/types";
import { Trash2, ChevronLeft, ChevronRight, MessageSquare, Mail, User } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminContactsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading } = useQuery<ApiResponse<{ contacts: AdminContact[]; pagination: Pagination }>>({
    queryKey: ["admin-contacts", page],
    queryFn: async () => {
      const res = await api.get("/admin/contacts", { params: { page, limit: 10 } });
      return res.data;
    },
  });

  const contacts = data?.data?.contacts || [];
  const pagination = data?.data?.pagination;

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/contacts/${id}`);
    },
    onSuccess: () => {
      toast.success("Contact deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
    },
    onError: () => toast.error("Failed to delete"),
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Contact Messages</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          View and manage messages from the contact form
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-white dark:bg-neutral-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500">No contact messages</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div
                  className="flex items-start justify-between p-5 cursor-pointer"
                  onClick={() => setExpanded(expanded === contact._id ? null : contact._id)}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="h-5 w-5 text-cyan-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{contact.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Mail className="h-3 w-3 text-neutral-400" />
                        <p className="text-xs text-neutral-400 truncate">{contact.email}</p>
                      </div>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mt-1.5">{contact.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <span className="text-xs text-neutral-400 hidden sm:block">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete this message?")) deleteMutation.mutate(contact._id);
                      }}
                      disabled={deleteMutation.isPending}
                      className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {expanded === contact._id && (
                  <div className="px-5 pb-5 pt-0">
                    <div className="ml-13 pl-0 sm:pl-[52px]">
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-700/50 rounded-xl p-4">
                        {contact.message}
                      </p>
                      <p className="text-xs text-neutral-400 mt-2 sm:hidden">
                        {new Date(contact.createdAt).toLocaleDateString()} at {new Date(contact.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}