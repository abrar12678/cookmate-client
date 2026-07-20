/* ──────────────────────────────────────────────
   CookMate AI — Shared TypeScript Types
   All API response shapes & domain models
   ────────────────────────────────────────────── */

// ─── Domain Models ───────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  role?: "user" | "admin";
  createdAt?: string;
}

export interface Ingredient {
  name: string;
  qty: string;
  unit: string;
}

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Recipe {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  cuisine: string;
  difficulty: Difficulty;
  cookingTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  dietaryTags?: string[];
  rating: number;
  reviewCount: number;
  createdBy: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  recipeId: string;
  userId: string;
  userName: string;
  rating: number;
  review: string;
  createdAt: string;
}

export interface Favorite {
  _id: string;
  recipeId: string;
  userId: string;
  recipe?: Recipe;
  createdAt: string;
}

// ─── API Response Wrappers ───────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedData<T> {
  recipes: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Auth ────────────────────────────────────

export interface AuthData {
  user: User;
  token: string;
}

// ─── AI ──────────────────────────────────────

export interface NutritionInfo {
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
}

export interface GeneratedRecipe {
  title: string;
  shortDescription?: string;
  cuisine?: string;
  difficulty?: string;
  cookingTime?: number;
  ingredients: Ingredient[];
  instructions: string[];
  nutrition?: NutritionInfo;
}

export interface FoodAnalysis {
  dishName: string;
  cuisine?: string;
  ingredients: string[];
  nutrition: NutritionInfo;
  suggestions: string[];
}

// ─── Stats ───────────────────────────────────

export interface SiteStats {
  recipes: number;
  users: number;
  reviews: number;
  cuisines: number;
}

// ─── Admin ────────────────────────────────────

export interface AdminDashboardStats {
  totalUsers: number;
  totalRecipes: number;
  totalReviews: number;
  totalNewsletters: number;
  totalContacts: number;
  recentUsers: number;
  recentRecipes: number;
  avgRating: number;
  topCuisines: { _id: string; count: number }[];
  usersPerDay: { _id: string; count: number }[];
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
  recipeCount?: number;
  reviewCount?: number;
}

export interface AdminRecipe {
  _id: string;
  title: string;
  shortDescription: string;
  cuisine: string;
  difficulty: string;
  cookingTime: number;
  rating: number;
  image: string;
  featured: boolean;
  createdBy: string;
  creatorName: string;
  createdAt: string;
}

export interface AdminReview {
  _id: string;
  recipeId: string;
  userId: string;
  userName: string;
  recipeTitle: string;
  rating: number;
  review: string;
  createdAt: string;
}

export interface AdminNewsletter {
  _id: string;
  email: string;
  createdAt: string;
}

export interface AdminContact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}