"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { AdminUser, ApiResponse, Pagination } from "@/types";
import {
  Search,
  UserCheck,
  UserX,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Calendar,
  BookOpen,
  Star,
} from "lucide-react";
import { toast } from "react-toastify";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<
    ApiResponse<{ users: AdminUser[]; pagination: Pagination }>
  >({
    queryKey: ["admin-users", page, search],
    queryFn: async () => {
      const res = await api.get("/admin/users", {
        params: { page, limit: 10, search },
      });
      return res.data;
    },
  });

  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination;

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      await api.patch(`/admin/users/${id}/role`, { role });
    },
    onSuccess: (_, variables) => {
      toast.success(`User role updated to ${variables.role}`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Failed to update user role"),
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;
    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-neutral-100 dark:border-neutral-700">
        <p className="text-xs sm:text-sm text-neutral-500">
          Page {pagination.page} of {pagination.totalPages} ({pagination.total}{" "}
          total)
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() =>
              setPage((p) => Math.min(pagination.totalPages, p + 1))
            }
            disabled={page === pagination.totalPages}
            className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            Users
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage user accounts and roles
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search users..."
            className="input-premium w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 text-sm placeholder-neutral-400 outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-white dark:bg-neutral-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16">
          <Shield className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500">No users found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden">
          {/* ═══ MOBILE CARD VIEW ═══ */}
          <div className="md:hidden divide-y divide-neutral-100 dark:divide-neutral-700">
            {users.map((user) => (
              <div key={user._id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400 shrink-0">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-neutral-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      user.role === "admin"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                        : "bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    {user.role === "admin" ? (
                      <Shield className="h-3 w-3 mr-0.5" />
                    ) : null}
                    {user.role || "user"}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> {user.recipeCount || 0}{" "}
                    recipes
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" /> {user.reviewCount || 0} reviews
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />{" "}
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-50 dark:border-neutral-700/50">
                  {user.role !== "admin" ? (
                    <button
                      onClick={() =>
                        updateRoleMutation.mutate({
                          id: user._id,
                          role: "admin",
                        })
                      }
                      disabled={updateRoleMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors cursor-pointer"
                    >
                      <UserCheck className="h-3.5 w-3.5" /> Make Admin
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        updateRoleMutation.mutate({
                          id: user._id,
                          role: "user",
                        })
                      }
                      disabled={updateRoleMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-amber-600 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors cursor-pointer"
                    >
                      <UserX className="h-3.5 w-3.5" /> Remove Admin
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Delete user "${user.name}"? This will also delete all their recipes, reviews, and favorites.`,
                        )
                      ) {
                        deleteUserMutation.mutate(user._id);
                      }
                    }}
                    disabled={deleteUserMutation.isPending}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ═══ DESKTOP TABLE VIEW ═══ */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-700">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                            {user.name}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                            : "bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                        }`}
                      >
                        {user.role === "admin" ? (
                          <Shield className="h-3 w-3 mr-1" />
                        ) : null}
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        <span>{user.recipeCount || 0} recipes</span>
                        <span className="mx-1.5">·</span>
                        <span>{user.reviewCount || 0} reviews</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.role !== "admin" ? (
                          <button
                            onClick={() =>
                              updateRoleMutation.mutate({
                                id: user._id,
                                role: "admin",
                              })
                            }
                            disabled={updateRoleMutation.isPending}
                            className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all duration-200 cursor-pointer"
                            title="Make Admin"
                          >
                            <UserCheck className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              updateRoleMutation.mutate({
                                id: user._id,
                                role: "user",
                              })
                            }
                            disabled={updateRoleMutation.isPending}
                            className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all duration-200 cursor-pointer"
                            title="Remove Admin"
                          >
                            <UserX className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Delete user "${user.name}"? This will also delete all their recipes, reviews, and favorites.`,
                              )
                            ) {
                              deleteUserMutation.mutate(user._id);
                            }
                          }}
                          disabled={deleteUserMutation.isPending}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {renderPagination()}
        </div>
      )}
    </div>
  );
}
