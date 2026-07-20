"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import AuthGuard from "@/components/layout/AuthGuard";
import RecipeForm from "@/components/recipe/RecipeForm";
import type { Recipe, ApiResponse } from "@/types";

function EditRecipeWrapper() {
  const { id } = useParams<{ id: string }>();

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

  return (
    <RecipeForm
      mode="edit"
      initialData={data?.data?.recipe}
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