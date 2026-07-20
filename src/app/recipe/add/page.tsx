"use client";

import AuthGuard from "@/components/layout/AuthGuard";
import RecipeForm from "@/components/recipe/RecipeForm";

export default function AddRecipePage() {
  return (
    <AuthGuard>
      <RecipeForm mode="create" />
    </AuthGuard>
  );
}