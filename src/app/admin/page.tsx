"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { AdminDashboardStats, ApiResponse } from "@/types";
import {
  Users,
  BookOpen,
  Star,
  Mail,
  MessageSquare,
  TrendingUp,
  ChefHat,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery<ApiResponse<AdminDashboardStats>>({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await api.get("/admin/dashboard");
      return res.data;
    },
  });

  const stats = data?.data;

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      recent: stats?.recentUsers,
      recentLabel: "new this week",
    },
    {
      label: "Total Recipes",
      value: stats?.totalRecipes || 0,
      icon: BookOpen,
      color: "from-emerald-500 to-emerald-600",
      recent: stats?.recentRecipes,
      recentLabel: "new this week",
    },
    {
      label: "Total Reviews",
      value: stats?.totalReviews || 0,
      icon: Star,
      color: "from-amber-500 to-amber-600",
    },
    {
      label: "Avg Rating",
      value: stats?.avgRating || 0,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      suffix: "/5",
    },
    {
      label: "Newsletters",
      value: stats?.totalNewsletters || 0,
      icon: Mail,
      color: "from-pink-500 to-pink-600",
    },
    {
      label: "Contacts",
      value: stats?.totalContacts || 0,
      icon: MessageSquare,
      color: "from-cyan-500 to-cyan-600",
    },
  ];

  return (
    <div className="page-enter">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-100">
          Dashboard
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Overview of your platform performance
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-28 sm:h-32 bg-white dark:bg-neutral-800 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && stats && (
        <>
          {/* Stat Cards — 2 cols on mobile, 3 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-neutral-100 dark:border-neutral-700"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">
                        {card.label}
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold text-neutral-800 dark:text-neutral-100 mt-1 sm:mt-2">
                        {typeof card.value === "number" && card.value % 1 !== 0
                          ? card.value.toFixed(1)
                          : card.value}
                        {card.suffix && (
                          <span className="text-sm sm:text-lg text-neutral-400">
                            {card.suffix}
                          </span>
                        )}
                      </p>
                      {card.recent !== undefined && (
                        <p className="text-[10px] sm:text-xs text-emerald-500 mt-0.5 sm:mt-1 font-medium">
                          +{card.recent} {card.recentLabel}
                        </p>
                      )}
                    </div>
                    <div
                      className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg shrink-0`}
                    >
                      <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Top Cuisines */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-neutral-100 dark:border-neutral-700">
              <h2 className="text-base sm:text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-3 sm:mb-4 flex items-center gap-2">
                <ChefHat className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500" />
                Top Cuisines
              </h2>
              {stats.topCuisines.length === 0 ? (
                <p className="text-neutral-400 text-sm py-4">
                  No data available
                </p>
              ) : (
                <div className="space-y-3">
                  {stats.topCuisines.map((cuisine, idx) => {
                    const maxCount = stats.topCuisines[0]?.count || 1;
                    const percentage = (cuisine.count / maxCount) * 100;
                    const colors = [
                      "bg-primary-500",
                      "bg-emerald-500",
                      "bg-amber-500",
                      "bg-purple-500",
                      "bg-pink-500",
                      "bg-cyan-500",
                    ];
                    return (
                      <div key={cuisine._id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 truncate mr-2">
                            {cuisine._id || "Unknown"}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-100 shrink-0">
                            {cuisine.count}
                          </span>
                        </div>
                        <div className="h-2 sm:h-2.5 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${colors[idx % colors.length]} transition-all duration-1000 ease-out`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Users Per Day */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-neutral-100 dark:border-neutral-700">
              <h2 className="text-base sm:text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-3 sm:mb-4 flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                <span className="hidden sm:inline">
                  User Registrations (Last 7 Days)
                </span>
                <span className="sm:hidden">Registrations (7d)</span>
              </h2>
              {stats.usersPerDay.length === 0 ? (
                <p className="text-neutral-400 text-sm py-4">
                  No registrations in the last 7 days
                </p>
              ) : (
                <div className="space-y-3">
                  {stats.usersPerDay.map((day) => {
                    const maxCount = Math.max(
                      ...stats.usersPerDay.map((d) => d.count),
                      1,
                    );
                    const percentage = (day.count / maxCount) * 100;
                    const dateStr = new Date(day._id).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      },
                    );
                    return (
                      <div key={day._id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                            {dateStr}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-100">
                            {day.count}
                          </span>
                        </div>
                        <div className="h-2 sm:h-2.5 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
