"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { AdminRecipe, ApiResponse, Pagination } from "@/types";
import {
  Search,
  Trash2,
  Star,
  StarOff,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

export default function AdminRecipesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<
    ApiResponse<{ recipes: AdminRecipe[]; pagination: Pagination }>
  >({
    queryKey: ["admin-recipes", page, search],
    queryFn: async () => {
      const res = await api.get("/admin/recipes", {
        params: { page, limit: 10, search },
      });
      return res.data;
    },
  });

  const recipes = data?.data?.recipes || [];
  const pagination = data?.data?.pagination;

  const deleteRecipeMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/recipes/${id}`);
    },
    onSuccess: () => {
      toast.success("Recipe deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-recipes"] });
    },
    onError: () => toast.error("Failed to delete recipe"),
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/admin/recipes/${id}/featured`);
    },
    onSuccess: () => {
      toast.success("Recipe featured status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-recipes"] });
    },
    onError: () => toast.error("Failed to update recipe"),
  });

  return (
    <div className="page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            Recipes
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage all recipes on the platform
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
            placeholder="Search recipes..."
            className="input-premium w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 text-sm placeholder-neutral-400 outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-white dark:bg-neutral-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500">No recipes found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
            {recipes.map((recipe) => {
              const hasImage = recipe.image && recipe.image.trim() !== "";
              return (
                <div
                  key={recipe._id}
                  className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-700 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-32 sm:h-36">
                    {hasImage ? (
                      <Image
                        src={recipe.image}
                        alt={recipe.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-primary-400" />
                      </div>
                    )}
                    {recipe.featured && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" /> Featured
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">
                      <Clock className="h-3 w-3" /> {recipe.cookingTime}m
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/recipe/${recipe._id}`}
                          className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 hover:text-primary-500 transition-colors line-clamp-1"
                        >
                          {recipe.title}
                        </Link>
                        <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                          by {recipe.creatorName} · {recipe.cuisine} ·{" "}
                          {recipe.difficulty}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          {recipe.rating?.toFixed(1) || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            toggleFeaturedMutation.mutate(recipe._id)
                          }
                          disabled={toggleFeaturedMutation.isPending}
                          className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${
                            recipe.featured
                              ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                              : "text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:text-amber-500"
                          }`}
                          title={
                            recipe.featured ? "Unfeature" : "Make Featured"
                          }
                        >
                          <Star
                            className="h-4 w-4"
                            fill={recipe.featured ? "currentColor" : "none"}
                          />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete recipe "${recipe.title}"?`)) {
                              deleteRecipeMutation.mutate(recipe._id);
                            }
                          }}
                          disabled={deleteRecipeMutation.isPending}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                          title="Delete Recipe"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-neutral-500">
                Page {pagination.page} of {pagination.totalPages} (
                {pagination.total} total)
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
          )}
        </>
      )}
    </div>
  );
}
