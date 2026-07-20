"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Star,
  Mail,
  MessageSquare,
  ChevronLeft,
  ChefHat,
  Menu,
  X,
} from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Recipes", href: "/admin/recipes", icon: BookOpen },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Newsletters", href: "/admin/newsletters", icon: Mail },
  { label: "Contacts", href: "/admin/contacts", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // Close drawer on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDrawerOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const navContent = (
    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
      {sidebarLinks.map((link) => {
        const Icon = link.icon;
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setDrawerOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* ═══ DESKTOP SIDEBAR ═══ */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 fixed inset-y-0 left-0 z-40">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-neutral-200 dark:border-neutral-700">
          <ChefHat className="h-7 w-7 text-primary-500" />
          <span className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
            CookMate <span className="text-primary-500">Admin</span>
          </span>
        </div>
        {navContent}
        <div className="px-3 py-4 border-t border-neutral-200 dark:border-neutral-700">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* ═══ MOBILE HEADER BAR ═══ */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-30 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-primary-500" />
          <span className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
            Admin Panel
          </span>
        </div>
        {/* Active page indicator */}
        <div className="ml-auto">
          <span className="text-xs text-neutral-400">
            {sidebarLinks.find(
              (l) =>
                (l.href === "/admin" && pathname === "/admin") ||
                (l.href !== "/admin" && pathname.startsWith(l.href)),
            )?.label || "Dashboard"}
          </span>
        </div>
      </div>

      {/* ═══ MOBILE DRAWER ═══ */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-white dark:bg-neutral-800 shadow-2xl z-50 transform transition-transform duration-300 ease-out lg:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-primary-500" />
            <span className="text-base font-bold text-neutral-800 dark:text-neutral-100">
              Admin Menu
            </span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {navContent}
        <div className="px-3 py-4 border-t border-neutral-200 dark:border-neutral-700">
          <Link
            href="/"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Site
          </Link>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="lg:ml-64">
        {/* Spacer for: navbar (64px) + mobile header (~56px) on mobile, 0 on desktop */}
        <div className="h-[120px] lg:h-0" />
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
