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
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PIE_COLORS = ["#E85D04", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4"];

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

  const formattedCuisineData =
    stats?.topCuisines?.map((c) => ({
      name: c._id || "Other",
      count: c.count,
    })) || [];

  const formattedUsersData =
    stats?.usersPerDay?.map((d) => ({
      date: new Date(d._id).toLocaleDateString("en-US", {
        weekday: "short",
        month: "numeric",
        day: "numeric",
      }),
      users: d.count,
    })) || [];

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
          {/* Stat Cards */}
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

          {/* Interactive Recharts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Registrations Bar Chart */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-neutral-100 dark:border-neutral-700">
              <h2 className="text-base sm:text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                User Registrations (Last 7 Days)
              </h2>
              {formattedUsersData.length === 0 ? (
                <p className="text-neutral-400 text-sm py-12 text-center">
                  No registration data available
                </p>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formattedUsersData}>
                      <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          borderColor: "#374151",
                          color: "#F9FAFB",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Top Cuisines Pie Chart */}
            <div className="bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-neutral-100 dark:border-neutral-700">
              <h2 className="text-base sm:text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-primary-500" />
                Top Cuisines Breakdown
              </h2>
              {formattedCuisineData.length === 0 ? (
                <p className="text-neutral-400 text-sm py-12 text-center">
                  No cuisine data available
                </p>
              ) : (
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={formattedCuisineData}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }: { name?: string; percent?: number }) =>
                          `${name || "Other"} (${((percent || 0) * 100).toFixed(0)}%)`
                        }
                      >
                        {formattedCuisineData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          borderColor: "#374151",
                          color: "#F9FAFB",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
