import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import AuthProvider from "@/context/AuthContext";
import ThemeProvider from "@/context/ThemeContext";
import { ToastContainer } from "react-toastify";
import LayoutShell from "@/components/layout/LayoutShell";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CookMate AI — Your AI-Powered Recipe Companion",
    template: "%s | CookMate AI",
  },
  description:
    "Discover, cook, and share amazing recipes powered by AI. Generate recipes from ingredients, analyze food photos for nutrition, and explore thousands of community recipes.",
  keywords: [
    "recipe",
    "AI recipe generator",
    "food analyzer",
    "cooking",
    "meal planning",
    "nutrition",
    "community recipes",
  ],
  authors: [{ name: "CookMate AI" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CookMate AI",
    title: "CookMate AI — Your AI-Powered Recipe Companion",
    description:
      "Discover, cook, and share amazing recipes powered by AI. Generate recipes from ingredients, analyze food photos for nutrition.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CookMate AI — Your AI-Powered Recipe Companion",
    description:
      "Discover, cook, and share amazing recipes powered by AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 transition-colors duration-200`}>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
            <LayoutShell>{children}</LayoutShell>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
        <ToastContainer position="top-right" autoClose={3000} theme="light" />
      </body>
    </html>
  );
}