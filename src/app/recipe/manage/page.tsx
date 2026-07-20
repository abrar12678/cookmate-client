"use client";

import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import Link from "next/link";
import AuthGuard from "@/components/layout/AuthGuard";
import Button from "@/components/ui/Button";
import { Plus, Trash2, BookOpen, Pencil } from "lucide-react";
import type { Recipe, ApiResponse, PaginatedData } from "@/types";

function ManageContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?._id;

  const { data, isLoading } = useQuery<ApiResponse<PaginatedData<Recipe>> | ApiResponse<Recipe[]>>({
    queryKey: ["myRecipes", userId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<PaginatedData<Recipe>>>(`/recipes?createdBy=${userId}`);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">My Recipes</h1>
        <Link href="/recipe/add">
          <Button>
            <Plus className="h-4 w-4 mr-1.5" /> Add New Recipe
          </Button>
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="text-neutral-500 dark:text-neutral-400 text-center py-16">Loading...</p>
      )}

      {/* Empty State */}
      {!isLoading && recipes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-9 w-9 text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
            No recipes yet
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm">
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

      {/* Table */}
      {!isLoading && recipes.length > 0 && (
        <div className="overflow-x-auto bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                  Image
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase hidden sm:table-cell">
                  Cuisine
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase hidden md:table-cell">
                  Difficulty
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase hidden lg:table-cell">
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
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-700 rounded flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-neutral-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-neutral-800 dark:text-neutral-100 text-sm">
                      {recipe.title}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">
                      {recipe.cuisine}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
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
                  <td className="px-4 py-3 hidden lg:table-cell">
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
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(recipe._id, recipe.title)}
                        className="flex items-center gap-1 text-sm text-red-500 hover:underline font-medium cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
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