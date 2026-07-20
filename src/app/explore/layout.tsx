import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Recipes",
  description: "Browse thousands of community recipes filtered by cuisine, difficulty, and dietary needs. Find your next favorite meal.",
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
