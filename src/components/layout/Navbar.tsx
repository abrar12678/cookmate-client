"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  ChefHat,
  Menu,
  X,
  User,
  LogOut,
  Plus,
  BookOpen,
  Sparkles,
  ScanSearch,
  Heart,
  Sun,
  Moon,
  ShieldCheck,
  LayoutDashboard,
  Users,
  BookMarked,
  MessageSquare,
  Mail,
  Newspaper,
} from "lucide-react";
import Button from "@/components/ui/Button";

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// USER-ONLY links — admin এগুলো পাবে না
const userLinks = [
  { label: "AI Generator", href: "/ai/generator", icon: Sparkles },
  { label: "AI Analyzer", href: "/ai/analyzer", icon: ScanSearch },
  { label: "Add Recipe", href: "/recipe/add", icon: Plus },
  { label: "My Recipes", href: "/recipe/manage", icon: BookOpen },
  { label: "Favorites", href: "/favorites", icon: Heart },
  { label: "Profile", href: "/profile", icon: User },
];

// ADMIN-ONLY links — user এগুলো পাবে না
const adminLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Recipes", href: "/admin/recipes", icon: BookMarked },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { label: "Contacts", href: "/admin/contacts", icon: Mail },
  { label: "Newsletters", href: "/admin/newsletters", icon: Newspaper },
  { label: "Profile", href: "/profile", icon: User },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logoutFn } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  // ← KEY SEPARATION: admin শুধু adminLinks, user শুধু userLinks দেখবে
  const navLinks = isAdmin ? adminLinks : userLinks;

  const handleLogout = () => {
    setDropdownOpen(false);
    logoutFn();
    router.push("/");
  };

  const closeMobile = () => setMobileOpen(false);

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname?.startsWith(href + "/");

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <ChefHat className="h-7 w-7 text-primary-500" />
              <span className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
                CookMate <span className="text-primary-500">AI</span>
              </span>
            </Link>

            {/* Desktop — Public Links */}
            <div className="hidden md:flex items-center gap-1">
              {publicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`link-premium px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-primary-500 font-semibold bg-primary-50 dark:bg-primary-500/10"
                      : "text-neutral-600 dark:text-neutral-300 hover:text-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-500/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop — Right side */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {!user ? (
                <>
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Register</Button>
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-9 h-9 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold hover:bg-primary-600 transition-colors cursor-pointer"
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </button>

                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 py-2 z-50">
                        {/* User info + role badge */}
                        <div className="px-4 py-2.5 border-b border-neutral-100 dark:border-neutral-700">
                          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                            {user.name}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {user.email}
                          </p>
                          <span
                            className={`inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              isAdmin
                                ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
                                : "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400"
                            }`}
                          >
                            {isAdmin ? "Admin" : "User"}
                          </span>
                        </div>
                        {/* Role-separated nav links */}
                        {navLinks.map((link) => {
                          const Icon = link.icon;
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={() => setDropdownOpen(false)}
                              className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                                isActive(link.href)
                                  ? isAdmin
                                    ? "text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-500/10"
                                    : "text-primary-500 font-semibold bg-primary-50 dark:bg-primary-500/10"
                                  : "text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              {link.label}
                            </Link>
                          );
                        })}
                        <div className="my-1 border-t border-neutral-100 dark:border-neutral-700" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile Slide-in */}
      <div
        className={`fixed inset-y-0 right-0 w-72 bg-white dark:bg-neutral-900 shadow-2xl z-50 transform transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700">
          <span className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
            Menu
          </span>
          <button
            onClick={closeMobile}
            className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col p-4 gap-1 overflow-y-auto max-h-[calc(100vh-64px)]">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-primary-500 font-semibold bg-primary-50 dark:bg-primary-500/10"
                  : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <div className="my-2 border-t border-neutral-100 dark:border-neutral-700" />
              <div className="px-4 py-2">
                <span
                  className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    isAdmin
                      ? "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400"
                      : "bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400"
                  }`}
                >
                  {isAdmin ? "Admin Panel" : "My Account"}
                </span>
              </div>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive(link.href)
                        ? isAdmin
                          ? "text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:hover:bg-amber-500/10"
                          : "text-primary-500 font-semibold bg-primary-50 dark:bg-primary-500/10"
                        : "text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${isActive(link.href) ? (isAdmin ? "text-amber-500" : "text-primary-500") : "text-primary-500"}`}
                    />
                    {link.label}
                  </Link>
                );
              })}

              <div className="my-2 border-t border-neutral-100 dark:border-neutral-700" />
              <div className="px-4 py-2 mb-2">
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                  {user.name}
                </p>
                <p className="text-xs text-neutral-400">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  closeMobile();
                  handleLogout();
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="my-3 border-t border-neutral-100 dark:border-neutral-700" />
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={closeMobile}>
                  <Button variant="outline" size="md" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={closeMobile}>
                  <Button size="md" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
