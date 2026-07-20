import Link from "next/link";
import Image from "next/image";
import { Clock, Star, ChefHat } from "lucide-react";

interface RecipeCardProps {
  recipe: {
    _id: string;
    title: string;
    shortDescription: string;
    image: string;
    difficulty: string;
    cookingTime: number;
    rating: number;
    cuisine: string;
  };
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { _id, title, shortDescription, image, difficulty, cookingTime, rating, cuisine } = recipe;
  const hasImage = image && image.trim() !== "";

  return (
    <div className="card-premium group bg-white dark:bg-neutral-800 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full border border-transparent hover:border-primary-200 dark:hover:border-primary-800/50">
      <div className="relative w-full aspect-video overflow-hidden">
        {hasImage ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 flex items-center justify-center">
            <ChefHat className="h-10 w-10 text-primary-400 dark:text-primary-600" />
          </div>
        )}
        <span className="absolute top-3 left-3 bg-primary-500/90 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
          {difficulty}
        </span>
        <span className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full shadow-sm">
          <Clock className="h-3 w-3" /> {cookingTime} min
        </span>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs text-secondary-500 dark:text-secondary-400 font-semibold uppercase tracking-wide">{cuisine}</span>
        <h3 className="font-bold text-neutral-800 dark:text-neutral-100 mt-1 line-clamp-1 group-hover:text-primary-500 transition-colors duration-200">{title}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 flex-grow leading-relaxed">{shortDescription}</p>
        <div className="flex items-center gap-1 mt-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">{rating.toFixed(1)}</span>
        </div>
        <Link
          href={`/recipe/${_id}`}
          className="btn-premium w-full text-center border border-neutral-300 dark:border-neutral-600 rounded-xl py-2.5 text-sm font-semibold hover:bg-primary-500 hover:text-white hover:border-primary-500 mt-3 dark:text-neutral-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}