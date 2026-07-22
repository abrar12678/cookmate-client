"use client";

import { useQuery } from "@tanstack/react-query";
import { BookOpen, Users, Star, Globe } from "lucide-react";
import api from "@/lib/axios";
import type { SiteStats, ApiResponse } from "@/types";

const defaultStats = [
  { icon: BookOpen, value: "0", label: "Recipes" },
  { icon: Users, value: "0", label: "Users" },
  { icon: Star, value: "0", label: "Reviews" },
  { icon: Globe, value: "50+", label: "Cuisines" },
];

interface StatItem {
  icon: typeof BookOpen;
  value: string;
  label: string;
}

export default function StatsSection() {
  const { data } = useQuery<ApiResponse<SiteStats>>({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<SiteStats>>("/stats");
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });

  const stats: StatItem[] = data?.data
    ? [
        {
          icon: BookOpen,
          value: (data.data.recipes || 0).toLocaleString() + "+",
          label: "Recipes",
        },
        {
          icon: Users,
          value: (data.data.users || 0).toLocaleString() + "+",
          label: "Users",
        },
        {
          icon: Star,
          value: (data.data.reviews || 0).toLocaleString() + "+",
          label: "Reviews",
        },
        {
          icon: Globe,
          value: (data.data.cuisines || 50) + "+",
          label: "Cuisines",
        },
      ]
    : defaultStats;

  return (
    <section className="py-16 bg-primary-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto px-4 text-center stagger-children">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex flex-col items-center icon-bounce">
              <Icon className="h-8 w-8 text-white/80 mb-3" />
              <span className="text-white text-4xl font-bold">
                {stat.value}
              </span>
              <span className="text-primary-100 text-sm mt-1">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}