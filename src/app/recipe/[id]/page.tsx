import type { Metadata } from "next";
import RecipeDetailClient from "./RecipeDetailClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_URL}/recipes/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) return { title: "Recipe Not Found" };
    const json = await res.json();
    const recipe = json?.data?.recipe;
    if (!recipe) return { title: "Recipe Not Found" };

    return {
      title: recipe.title,
      description: (recipe.description || recipe.fullDescription || "").substring(0, 160),
      openGraph: {
        title: recipe.title,
        description: (recipe.description || recipe.fullDescription || "").substring(0, 160),
        images: recipe.image ? [{ url: recipe.image, width: 800, height: 450 }] : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: recipe.title,
        description: (recipe.description || recipe.fullDescription || "").substring(0, 160),
      },
    };
  } catch {
    return { title: "Recipe" };
  }
}

export default function RecipeDetailPage() {
  return <RecipeDetailClient />;
}
