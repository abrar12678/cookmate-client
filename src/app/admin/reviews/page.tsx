"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { AdminReview, ApiResponse, Pagination } from "@/types";
import { Trash2, ChevronLeft, ChevronRight, Star, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<ApiResponse<{ reviews: AdminReview[]; pagination: Pagination }>>({
    queryKey: ["admin-reviews", page],
    queryFn: async () => {
      const res = await api.get("/admin/reviews", { params: { page, limit: 10 } });
      return res.data;
    },
  });

  const reviews = data?.data?.reviews || [];
  const pagination = data?.data?.pagination;

  const deleteReviewMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/reviews/${id}`);
    },
    onSuccess: () => {
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
    onError: () => toast.error("Failed to delete review"),
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300 dark:text-neutral-600"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Reviews</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          Moderate and manage user reviews
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-white dark:bg-neutral-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="h-12 w-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500">No reviews found</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white dark:bg-neutral-800 rounded-2xl p-5 shadow-sm border border-neutral-100 dark:border-neutral-700 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-500/20 flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400 shrink-0">
                        {review.userName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{review.userName}</p>
                        <p className="text-xs text-neutral-400">
                          on{" "}
                          <Link href={`/recipe/${review.recipeId}`} className="text-primary-500 hover:underline">
                            {review.recipeTitle}
                          </Link>
                        </p>
                      </div>
                    </div>
                    <div className="mb-2">{renderStars(review.rating)}</div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2">
                      {review.review}
                    </p>
                    <p className="text-xs text-neutral-400 mt-2">
                      {new Date(review.createdAt).toLocaleDateString()} at {new Date(review.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Delete this review?")) {
                        deleteReviewMutation.mutate(review._id);
                      }
                    }}
                    disabled={deleteReviewMutation.isPending}
                    className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 shrink-0 cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
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