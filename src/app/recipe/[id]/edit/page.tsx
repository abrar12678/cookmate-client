"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import AuthGuard from "@/components/layout/AuthGuard";
import RecipeForm from "@/components/recipe/RecipeForm";
import type { Recipe, ApiResponse } from "@/types";

function EditRecipeWrapper() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data, isLoading } = useQuery<ApiResponse<{ recipe: Recipe }>>({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ recipe: Recipe }>>(`/recipes/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-neutral-500 dark:text-neutral-400 text-center py-16">
          Loading recipe...
        </p>
      </div>
    );
  }

  const recipe = data?.data?.recipe;

  if (recipe && user) {
    const isOwner = user._id === recipe.createdBy;
    const isAdmin = user.role === "admin";
    if (!isOwner && !isAdmin) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Access Denied
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            You do not have permission to edit this recipe.
          </p>
          <Link
            href={`/recipe/${id}`}
            className="inline-block bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition"
          >
            Back to Recipe
          </Link>
        </div>
      );
    }
  }

  return (
    <RecipeForm
      mode="edit"
      initialData={recipe}
      recipeId={id}
    />
  );
}

export default function EditRecipePage() {
  return (
    <AuthGuard>
      <EditRecipeWrapper />
    </AuthGuard>
  );
}