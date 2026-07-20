"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import Link from "next/link";
import AuthGuard from "@/components/layout/AuthGuard";
import RecipeCard from "@/components/recipe/RecipeCard";
import { Heart } from "lucide-react";
import type { Favorite, ApiResponse } from "@/types";

function FavoritesContent() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery<ApiResponse<{ favorites: Favorite[] }>>({
    queryKey: ["favorites", user?._id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ favorites: Favorite[] }>>("/recipes/favorites");
      return res.data;
    },
    enabled: !!user?._id,
  });

  const favorites = data?.data?.favorites || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">
      <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">My Favorites</h1>

      {isLoading && (
        <p className="text-neutral-500 dark:text-neutral-400 text-center py-16">Loading...</p>
      )}

      {!isLoading && favorites.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-primary-50 dark:bg-primary-500/10 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-9 w-9 text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
            No favorites yet
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm">
            Start exploring recipes and click the heart icon to save your favorites here.
          </p>
          <Link href="/explore" className="mt-6">
            <button className="bg-primary-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-600 transition-colors">
              Explore Recipes
            </button>
          </Link>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {favorites
            .filter((fav) => fav.recipe)
            .map((fav) => (
              <RecipeCard key={fav._id} recipe={fav.recipe!} />
            ))}
        </div>
      )}
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <AuthGuard>
      <FavoritesContent />
    </AuthGuard>
  );
}