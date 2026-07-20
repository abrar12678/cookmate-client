/* ──────────────────────────────────────────────
   CookMate AI — Shared Constants
   Hardcoded data, reusable CSS classes, option lists
   ────────────────────────────────────────────── */

// ─── Reusable CSS Classes ─────────────────────

export const SELECT_CLASS =
  "input-premium border border-neutral-300 dark:border-neutral-600 rounded-lg px-3 py-2.5 text-sm text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 outline-none cursor-pointer";

export const SELECT_CLASS_FULL =
  "input-premium w-full border border-neutral-300 dark:border-neutral-600 rounded-lg px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 outline-none cursor-pointer";

// ─── Option Lists ─────────────────────────────

export const CUISINE_OPTIONS = [
  "Italian",
  "Asian",
  "Indian",
  "American",
  "Mexican",
  "Thai",
  "Japanese",
  "Mediterranean",
] as const;

export const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"] as const;

export const DIETARY_OPTIONS = [
  "",
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Low-Carb",
  "Keto",
  "High-Protein",
] as const;

// ─── Landing Page Data ────────────────────────

export interface CuisineCategory {
  name: string;
  image: string;
}

export const CUISINE_CATEGORIES: CuisineCategory[] = [
  { name: "Italian", image: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&h=300&fit=crop" },
  { name: "Asian", image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=300&fit=crop" },
  { name: "Mexican", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop" },
  { name: "Indian", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop" },
  { name: "American", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
  { name: "Mediterranean", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop" },
  { name: "Thai", image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=300&fit=crop" },
  { name: "Japanese", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop" },
];

export interface Testimonial {
  comment: string;
  name: string;
  role: string;
  stars: number;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    comment:
      "CookMate AI completely changed how I plan my meals. I just type in what's in my fridge and get incredible recipe ideas I'd never think of on my own.",
    name: "Sarah Johnson",
    role: "Home Cook",
    stars: 5,
  },
  {
    comment:
      "As a food blogger, I use the AI analyzer all the time for quick nutritional breakdowns. It saves me hours of manual calculation every single week.",
    name: "Michael Chen",
    role: "Food Blogger",
    stars: 5,
  },
  {
    comment:
      "Between work and kids, I barely have time to cook. This app gives me quick, easy recipes that my whole family actually enjoys. A total lifesaver!",
    name: "Emily Rodriguez",
    role: "Busy Mom",
    stars: 5,
  },
];

export interface FAQ {
  question: string;
  answer: string;
}

export const FAQS: FAQ[] = [
  {
    question: "Is CookMate AI free?",
    answer:
      "Yes! CookMate AI offers a generous free tier that includes recipe browsing, AI recipe generation, and food analysis. Premium features like unlimited generations and advanced analytics are available on our paid plan.",
  },
  {
    question: "How does the AI recipe generator work?",
    answer:
      "Our AI analyzes the ingredients you provide, considers flavor chemistry and culinary techniques, then generates a complete recipe with ingredients, step-by-step instructions, cooking time, and nutritional information.",
  },
  {
    question: "Can I share my own recipes?",
    answer:
      "Absolutely. Once you create an account, you can add your own recipes with full details including ingredients, instructions, photos, and cuisine tags. Other users can view, rate, and save your recipes.",
  },
  {
    question: "How accurate is the food analyzer?",
    answer:
      "The food analyzer uses advanced vision AI trained on thousands of food images. It can identify most common dishes with high accuracy and provides estimated nutritional values. For best results, use clear, well-lit photos of single dishes.",
  },
  {
    question: "Do I need an account?",
    answer:
      "You can browse and explore recipes without an account. However, to generate AI recipes, analyze food photos, save favorites, and share your own recipes, you'll need to create a free account.",
  },
  {
    question: "Can I filter recipes by dietary needs?",
    answer:
      "Yes! Our search supports filtering by cuisine, difficulty, and dietary tags including Vegetarian, Vegan, Gluten-Free, Dairy-Free, Low-Carb, Keto, and High-Protein. Use the dietary filter on the Explore page to find recipes that match your needs.",
  },
];