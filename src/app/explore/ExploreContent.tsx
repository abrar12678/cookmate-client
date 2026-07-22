"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useDebounce } from "@/lib/useDebounce";
import RecipeCard from "@/components/recipe/RecipeCard";
import RecipeCardSkeleton from "@/components/recipe/RecipeCardSkeleton";
import { Search } from "lucide-react";
import type { Recipe, PaginatedData, ApiResponse } from "@/types";
import { SELECT_CLASS, CUISINE_OPTIONS, DIFFICULTY_OPTIONS, DIETARY_OPTIONS } from "@/constants";

export default function ExploreContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial states from URL
  const initialSearch = searchParams.get("q") || searchParams.get("search") || "";
  const initialCuisine = searchParams.get("cuisine") || "";
  const initialDifficulty = searchParams.get("difficulty") || "";
  const initialDietary = searchParams.get("dietary") || "";
  const initialSortBy = searchParams.get("sortBy") || "newest";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(initialSearch);
  const [cuisine, setCuisine] = useState(initialCuisine);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [dietary, setDietary] = useState(initialDietary);
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [page, setPage] = useState(initialPage);

  // Debounce search input (400ms delay) to prevent excessive API calls
  const debouncedSearch = useDebounce(search, 400);

  // Helper to sync state to URL search params
  const updateUrlParams = useCallback(
    (newParams: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(newParams).forEach(([key, val]) => {
        if (val === undefined || val === "" || (key === "page" && Number(val) === 1)) {
          params.delete(key);
        } else {
          params.set(key, String(val));
        }
      });
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // Sync state changes to URL
  useEffect(() => {
    updateUrlParams({
      q: debouncedSearch || undefined,
      cuisine: cuisine || undefined,
      difficulty: difficulty || undefined,
      dietary: dietary || undefined,
      sortBy: sortBy !== "newest" ? sortBy : undefined,
      page: page > 1 ? page : undefined,
    });
  }, [debouncedSearch, cuisine, difficulty, dietary, sortBy, page, updateUrlParams]);

  // Query API with debounced search query & synced filters
  const { data, isLoading } = useQuery<ApiResponse<PaginatedData<Recipe>>>({
    queryKey: ["recipes", debouncedSearch, cuisine, difficulty, dietary, sortBy, page],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page,
        limit: 12,
        sortBy,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (cuisine) params.cuisine = cuisine;
      if (difficulty) params.difficulty = difficulty;
      if (dietary) params.dietary = dietary;

      const res = await api.get<ApiResponse<PaginatedData<Recipe>>>("/recipes", { params });
      return res.data;
    },
  });

  const recipes = data?.data?.recipes || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1 };

  const totalPages = pagination.totalPages || 1;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Explore Recipes</h1>

        {/* Filters */}
        <div className="flex flex-wrap items-end gap-3 mt-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search recipes..."
              className="input-premium w-full pl-10 pr-4 py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm dark:bg-neutral-800 dark:text-neutral-100 outline-none"
            />
          </div>

          <select
            value={cuisine}
            onChange={(e) => {
              setCuisine(e.target.value);
              setPage(1);
            }}
            className={SELECT_CLASS}
          >
            <option value="">All Cuisines</option>
            {CUISINE_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              setPage(1);
            }}
            className={SELECT_CLASS}
          >
            <option value="">All Difficulties</option>
            {DIFFICULTY_OPTIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={dietary}
            onChange={(e) => {
              setDietary(e.target.value);
              setPage(1);
            }}
            className={SELECT_CLASS}
          >
            <option value="">All Diets</option>
            {DIETARY_OPTIONS.slice(1).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className={SELECT_CLASS}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <RecipeCardSkeleton key={i} />)
            : recipes.map((recipe) => <RecipeCard key={recipe._id} recipe={recipe} />)}
        </div>

        {recipes.length === 0 && !isLoading && (
          <p className="text-center text-neutral-500 dark:text-neutral-400 mt-16 text-lg">
            No recipes found. Try adjusting your filters.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-premium px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed dark:text-neutral-200 cursor-pointer"
            >
              Previous
            </button>
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`btn-premium w-9 h-9 text-sm rounded-lg font-medium cursor-pointer ${
                  p === page
                    ? "bg-primary-500 text-white"
                    : "border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 dark:text-neutral-200"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-premium px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed dark:text-neutral-200 cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
