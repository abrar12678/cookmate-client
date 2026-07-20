"use client";

import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import Link from "next/link";
import AuthGuard from "@/components/layout/AuthGuard";
import Button from "@/components/ui/Button";
import { Plus, Trash2, BookOpen, Pencil, Clock } from "lucide-react";
import type { Recipe, ApiResponse, PaginatedData } from "@/types";

function ManageContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?._id;

  const { data, isLoading } = useQuery<
    ApiResponse<PaginatedData<Recipe>> | ApiResponse<Recipe[]>
  >({
    queryKey: ["myRecipes", userId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PaginatedData<Recipe>>>(
        `/recipes?createdBy=${userId}`,
      );
      return res.data;
    },
    enabled: !!userId,
  });

  const recipes: Recipe[] = data?.data
    ? Array.isArray(data.data)
      ? data.data
      : (data.data as PaginatedData<Recipe>).recipes || []
    : [];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/recipes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myRecipes"] });
      toast.success("Recipe deleted");
    },
    onError: () => {
      toast.error("Failed to delete recipe");
    },
  });

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pt-24">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-800 dark:text-neutral-100">
          My Recipes
        </h1>
        <Link href="/recipe/add" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-1.5" /> Add New Recipe
          </Button>
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-white dark:bg-neutral-800 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && recipes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center px-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-7 w-7 sm:h-9 sm:w-9 text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
            No recipes yet
          </h3>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm">
            You haven&apos;t added any recipes yet. Start sharing your culinary
            creations with the community!
          </p>
          <Link href="/recipe/add" className="mt-6">
            <Button>
              <Plus className="h-4 w-4 mr-1.5" /> Add Your First Recipe
            </Button>
          </Link>
        </div>
      )}

      {/* ═══ MOBILE CARD VIEW ═══ */}
      {!isLoading && recipes.length > 0 && (
        <div className="md:hidden space-y-3">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-4 flex gap-3"
            >
              {/* Image */}
              {recipe.image ? (
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-20 h-20 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5 text-neutral-400" />
                </div>
              )}
              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/recipe/${recipe._id}`}
                  className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 hover:text-primary-500 transition-colors line-clamp-1"
                >
                  {recipe.title}
                </Link>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                  <span>{recipe.cuisine}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      recipe.difficulty === "Easy"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : recipe.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {recipe.difficulty}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Clock className="h-3 w-3" /> {recipe.cookingTime}m
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 mt-1">
                  {formatDate(recipe.createdAt)}
                </p>
              </div>
              {/* Actions */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <Link
                  href={`/recipe/${recipe._id}/edit`}
                  className="p-2 rounded-lg text-neutral-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(recipe._id, recipe.title)}
                  className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ DESKTOP TABLE VIEW ═══ */}
      {!isLoading && recipes.length > 0 && (
        <div className="hidden md:block overflow-x-auto bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                  Image
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                  Cuisine
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                  Difficulty
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                  Date
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
              {recipes.map((recipe) => (
                <tr
                  key={recipe._id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    {recipe.image ? (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-neutral-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/recipe/${recipe._id}`}
                      className="font-medium text-neutral-800 dark:text-neutral-100 text-sm hover:text-primary-500 transition-colors"
                    >
                      {recipe.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">
                      {recipe.cuisine}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        recipe.difficulty === "Easy"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : recipe.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {recipe.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {formatDate(recipe.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/recipe/${recipe._id}`}
                        className="text-sm text-primary-500 hover:underline font-medium"
                      >
                        View
                      </Link>
                      <Link
                        href={`/recipe/${recipe._id}/edit`}
                        className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-300 hover:underline font-medium"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(recipe._id, recipe.title)}
                        className="flex items-center gap-1 text-sm text-red-500 hover:underline font-medium cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ManagePage() {
  return (
    <AuthGuard>
      <ManageContent />
    </AuthGuard>
  );
}
