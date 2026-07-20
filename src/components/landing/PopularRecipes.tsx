"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import RecipeCard from "@/components/recipe/RecipeCard";
import RecipeCardSkeleton from "@/components/recipe/RecipeCardSkeleton";
import type { Recipe, ApiResponse, PaginatedData } from "@/types";

export default function PopularRecipes() {
  const { data, isLoading } = useQuery<ApiResponse<{ recipes: Recipe[] }>>({
    queryKey: ["popularRecipes"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes/popular?limit=4`
      );
      const json: ApiResponse<{ recipes: Recipe[] }> = await res.json();
      return json;
    },
  });

  const recipes = data?.data?.recipes || [];

  return (
    <section className="py-20 bg-neutral-50 dark:bg-neutral-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100 text-center mb-12">
          Popular Recipes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))
            : recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/explore"
            className="text-primary-500 font-semibold hover:underline text-lg"
          >
            View All Recipes →
          </Link>
        </div>
      </div>
    </section>
  );
}