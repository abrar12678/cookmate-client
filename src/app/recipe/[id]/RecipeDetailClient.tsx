"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import type {
  Recipe,
  Review,
  ApiResponse,
  Ingredient,
} from "@/types";
import {
  ArrowLeft,
  Clock,
  Users,
  Star,
  ChefHat,
  CheckCircle,
  Heart,
  Edit,
} from "lucide-react";
import Image from "next/image";

export default function RecipeDetailClient() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const { data, isLoading } = useQuery<ApiResponse<{ recipe: Recipe }>>({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ recipe: Recipe }>>(`/recipes/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const { data: reviewsData } = useQuery<ApiResponse<{ reviews: Review[] }>>({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ reviews: Review[] }>>(`/recipes/${id}/reviews`);
      return res.data;
    },
    enabled: !!id,
  });

  const { data: favData } = useQuery<ApiResponse<{ isFavorite: boolean }>>({
    queryKey: ["favCheck", id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ isFavorite: boolean }>>(`/recipes/${id}/favorite`);
      return res.data;
    },
    enabled: !!id && !!user,
  });

  const recipe = data?.data?.recipe;
  const reviews = reviewsData?.data?.reviews || [];
  const isFavorite = favData?.data?.isFavorite ?? false;

  const toggleFavMutation = useMutation({
    mutationFn: async () => {
      if (isFavorite) {
        await api.delete(`/recipes/${id}/favorite`);
      } else {
        await api.post(`/recipes/${id}/favorite`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favCheck", id] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      if (isFavorite) {
        toast.info("Removed from favorites", { autoClose: 2000 });
      } else {
        toast.success("Added to favorites!", { autoClose: 2000 });
      }
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update favorite";
      toast.error(message);
    },
  });

  const rateMutation = useMutation({
    mutationFn: async () => {
      await api.post(`/recipes/${id}/rate`, { rating: userRating, review });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", id] });
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      setUserRating(0);
      setReview("");
      toast.success("Rating submitted!");
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to submit rating";
      toast.error(message);
    },
  });

  const isOwner = user && recipe && user._id === recipe.createdBy;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="h-4 w-40 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="w-full aspect-video bg-neutral-200 dark:bg-neutral-700 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
            <div className="h-7 w-20 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 text-center">
        <p className="text-neutral-500 dark:text-neutral-400 text-lg">Recipe not found.</p>
        <Link href="/explore" className="text-primary-500 font-medium mt-2 inline-block">Back to Explore</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/explore" className="inline-flex items-center gap-1.5 text-primary-500 hover:underline text-sm font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </Link>
        {isOwner && (
          <Link href={`/recipe/${id}/edit`} className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-primary-500">
            <Edit className="h-4 w-4" /> Edit Recipe
          </Link>
        )}
      </div>

      {/* Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="relative">
          <Image src={recipe.image} alt={recipe.title} width={800} height={450} className="rounded-2xl w-full aspect-video object-cover" priority />
          {user && (
            <button
              onClick={() => toggleFavMutation.mutate()}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-neutral-400"}`} />
            </button>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">{recipe.title}</h1>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-secondary-100 dark:bg-secondary-500/20 text-secondary-700 dark:text-secondary-300 px-3 py-1 rounded-full text-sm font-medium">{recipe.cuisine}</span>
            <span className="bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium">{recipe.difficulty}</span>
          </div>
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <Clock className="h-5 w-5 text-primary-500" />
              <span className="text-sm">{recipe.cookingTime} min</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <Users className="h-5 w-5 text-primary-500" />
              <span className="text-sm">{recipe.servings} servings</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{recipe.rating?.toFixed(1)} ({recipe.reviewCount} reviews)</span>
            </div>
          </div>
          <p className="text-neutral-600 dark:text-neutral-300 mt-6 leading-relaxed">{recipe.fullDescription}</p>
        </div>
      </div>

      {/* Ingredients & Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-12">
        <div>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-5 flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary-500" /> Ingredients
          </h2>
          <ul className="space-y-3">
            {recipe.ingredients?.map((item: Ingredient, i: number) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-secondary-500 shrink-0" />
                <span className="text-neutral-700 dark:text-neutral-200 text-sm">
                  <span className="font-medium">{item.qty} {item.unit}</span> {item.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-5">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions?.map((step: string, i: number) => (
              <li key={i} className="flex gap-3">
                <span className="bg-primary-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Rating Section */}
      {user && (
        <div className="mt-16 border-t border-neutral-200 dark:border-neutral-700 pt-10">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Rate & Review</h2>
          <div className="max-w-lg">
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="cursor-pointer"
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      star <= (hoverRating || userRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-neutral-300 dark:text-neutral-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              placeholder="Write a review (optional)..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="input-premium w-full border border-neutral-300 dark:border-neutral-600 rounded-lg px-4 py-2.5 text-sm dark:bg-neutral-800 dark:text-neutral-100 outline-none resize-none mb-3"
            />
            <button
              onClick={() => rateMutation.mutate()}
              disabled={userRating === 0 || rateMutation.isPending}
              className="btn-premium bg-primary-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {rateMutation.isPending ? "Submitting..." : "Submit Rating"}
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="mt-12 border-t border-neutral-200 dark:border-neutral-700 pt-10">
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">Reviews ({reviews.length})</h2>
          <div className="space-y-4 max-w-2xl">
            {reviews.map((r: Review) => (
              <div key={r._id} className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400">
                    {r.userName?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{r.userName}</p>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`h-3 w-3 ${s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300 dark:text-neutral-600"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                {r.review && <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">{r.review}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}