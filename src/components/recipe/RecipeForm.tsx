"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Plus, Trash2, Upload, Loader2 } from "lucide-react";
import type { Recipe, Ingredient, Difficulty } from "@/types";
import { SELECT_CLASS_FULL, CUISINE_OPTIONS, DIFFICULTY_OPTIONS } from "@/constants";

interface RecipeFormProps {
  mode: "create" | "edit";
  initialData?: Recipe;
  recipeId?: string;
}

export default function RecipeForm({ mode, initialData, recipeId }: RecipeFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = mode === "edit" && initialData;

  const [form, setForm] = useState({
    title: initialData?.title || "",
    shortDescription: initialData?.shortDescription || "",
    fullDescription: initialData?.fullDescription || "",
    cuisine: initialData?.cuisine || "Italian",
    difficulty: (initialData?.difficulty || "Easy") as Difficulty,
    cookingTime: initialData ? String(initialData.cookingTime) : "",
    servings: initialData ? String(initialData.servings) : "",
    image: initialData?.image || "",
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initialData?.ingredients?.length ? initialData.ingredients : [{ name: "", qty: "", unit: "" }]
  );
  const [instructions, setInstructions] = useState<string[]>(
    initialData?.instructions?.length ? initialData.instructions : [""]
  );
  const [isUploading, setIsUploading] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    setIngredients((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addIngredient = () =>
    setIngredients((prev) => [...prev, { name: "", qty: "", unit: "" }]);

  const removeIngredient = (index: number) =>
    setIngredients((prev) => prev.filter((_, i) => i !== index));

  const addInstruction = () => setInstructions((prev) => [...prev, ""]);

  const removeInstruction = (index: number) =>
    setInstructions((prev) => prev.filter((_, i) => i !== index));

  const updateInstruction = (index: number, value: string) => {
    setInstructions((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setIsUploading(true);
      try {
        const res = await api.post("/upload", { base64 });
        setForm((prev) => ({ ...prev, image: res.data.data.url }));
        toast.success("Image uploaded!");
      } catch {
        toast.error("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post("/recipes", {
        ...form,
        cookingTime: Number(form.cookingTime),
        servings: Number(form.servings),
        ingredients,
        instructions,
      });
    },
    onSuccess: () => {
      toast.success("Recipe created successfully!");
      router.push("/recipe/manage");
    },
    onError: () => {
      toast.error("Failed to create recipe");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      await api.put(`/recipes/${recipeId}`, {
        ...form,
        cookingTime: Number(form.cookingTime),
        servings: Number(form.servings),
        ingredients,
        instructions,
      });
    },
    onSuccess: () => {
      toast.success("Recipe updated successfully!");
      router.push("/recipe/manage");
    },
    onError: () => {
      toast.error("Failed to update recipe");
    },
  });

  const activeMutation = mode === "create" ? createMutation : updateMutation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.shortDescription || !form.fullDescription) {
      toast.warning("Please fill in all required fields");
      return;
    }
    const validIngredients = ingredients.filter((i) => i.name.trim());
    const validInstructions = instructions.filter((s) => s.trim());
    if (validIngredients.length === 0) {
      toast.warning("Add at least one ingredient");
      return;
    }
    if (validInstructions.length === 0) {
      toast.warning("Add at least one instruction step");
      return;
    }
    activeMutation.mutate();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
        {isEditMode ? "Edit Recipe" : "Add New Recipe"}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Title"
              placeholder="e.g., Spaghetti Carbonara"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Short Description
            </label>
            <input
              type="text"
              placeholder="A brief one-liner about the recipe"
              value={form.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              className="input-premium mt-1.5 w-full border border-neutral-300 dark:border-neutral-600 rounded-xl px-4 py-2.5 text-sm text-neutral-800 dark:text-neutral-100 bg-white dark:bg-neutral-800 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Full Description
            </label>
            <textarea
              rows={4}
              placeholder="Detailed description of the recipe, its origin, and what makes it special"
              value={form.fullDescription}
              onChange={(e) => updateField("fullDescription", e.target.value)}
              className="input-premium mt-1.5 w-full border border-neutral-300 dark:border-neutral-600 rounded-xl px-4 py-2.5 text-sm text-neutral-800 dark:text-neutral-100 bg-white dark:bg-neutral-800 outline-none resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Cuisine
            </label>
            <select
              value={form.cuisine}
              onChange={(e) => updateField("cuisine", e.target.value)}
              className={`${SELECT_CLASS_FULL} mt-1.5`}
            >
              {CUISINE_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Difficulty
            </label>
            <select
              value={form.difficulty}
              onChange={(e) => updateField("difficulty", e.target.value)}
              className={`${SELECT_CLASS_FULL} mt-1.5`}
            >
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Input
              label="Cooking Time"
              type="number"
              placeholder="30"
              value={form.cookingTime}
              onChange={(e) => updateField("cookingTime", e.target.value)}
            />
            <span className="text-xs text-neutral-400 mt-1 block">in minutes</span>
          </div>
          <div>
            <Input
              label="Servings"
              type="number"
              placeholder="4"
              value={form.servings}
              onChange={(e) => updateField("servings", e.target.value)}
            />
            <span className="text-xs text-neutral-400 mt-1 block">number of people</span>
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
              Ingredients
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addIngredient}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Ingredient
            </Button>
          </div>
          <div className="space-y-3">
            {ingredients.map((ing, i) => (
              <div key={i} className="grid grid-cols-3 gap-3 items-end">
                <Input
                  placeholder="Name (e.g., Chicken)"
                  value={ing.name}
                  onChange={(e) => updateIngredient(i, "name", e.target.value)}
                />
                <Input
                  placeholder="Qty (e.g., 500)"
                  value={ing.qty}
                  onChange={(e) => updateIngredient(i, "qty", e.target.value)}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Unit (e.g., grams)"
                    value={ing.unit}
                    onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(i)}
                      className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
              Instructions
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addInstruction}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Step
            </Button>
          </div>
          <div className="space-y-3">
            {instructions.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="bg-primary-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-2">
                  {i + 1}
                </span>
                <textarea
                  rows={2}
                  placeholder={`Step ${i + 1}`}
                  value={step}
                  onChange={(e) => updateInstruction(i, e.target.value)}
                  className="input-premium flex-1 border border-neutral-300 dark:border-neutral-600 rounded-xl px-4 py-2.5 text-sm text-neutral-800 dark:text-neutral-100 bg-white dark:bg-neutral-800 outline-none resize-none"
                />
                {instructions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInstruction(i)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors shrink-0 mt-2 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div>
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
            Recipe Image
          </h2>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-1.5" />
              )}
              {isUploading ? "Uploading..." : "Upload Image"}
            </Button>
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700"
              />
            )}
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          isLoading={activeMutation.isPending || isUploading}
          className="w-full sm:w-auto"
          size="lg"
        >
          {isEditMode ? "Update Recipe" : "Create Recipe"}
        </Button>
      </form>
    </div>
  );
}