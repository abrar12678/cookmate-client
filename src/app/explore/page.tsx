import type { Metadata } from "next";
import { Suspense } from "react";
import ExploreContent from "./ExploreContent";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const cuisine = typeof sp.cuisine === "string" ? sp.cuisine : "";
  const q = typeof sp.q === "string" ? sp.q : "";

  if (cuisine) {
    return {
      title: `${cuisine} Recipes \u2014 Explore`,
      description: `Browse delicious ${cuisine} recipes filtered by difficulty, dietary needs, and more on CookMate AI.`,
    };
  }

  if (q) {
    return {
      title: `Search: ${q} \u2014 Explore Recipes`,
      description: `Search results for "${q}" across thousands of community recipes on CookMate AI.`,
    };
  }

  return {
    title: "Explore Recipes",
    description: "Browse thousands of community recipes filtered by cuisine, difficulty, and dietary needs. Find your next favorite meal on CookMate AI.",
  };
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
