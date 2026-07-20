"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import AuthGuard from "@/components/layout/AuthGuard";
import Button from "@/components/ui/Button";
import {
  ChefHat,
  Plus,
  X,
  Loader2,
  RefreshCw,
  Save,
  CheckCircle,
  Send,
  MessageSquare,
  User,
  Bot,
} from "lucide-react";
import type { GeneratedRecipe, ApiResponse, Ingredient } from "@/types";
import { CUISINE_OPTIONS } from "@/constants";

type OutputLength = "brief" | "detailed" | "comprehensive";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const lengthOptions: Array<{
  value: OutputLength;
  label: string;
  desc: string;
}> = [
  { value: "brief", label: "Brief", desc: "Quick overview" },
  { value: "detailed", label: "Detailed", desc: "Full instructions" },
  { value: "comprehensive", label: "Comprehensive", desc: "Exhaustive guide" },
];

interface NutritionCard {
  label: string;
  value: string;
  color: string;
}

const SUGGESTED_FOLLOWUPS = [
  "Can I substitute an ingredient?",
  "Make it vegetarian",
  "Reduce cooking time",
];

function GeneratorContent() {
  const router = useRouter();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [outputLength, setOutputLength] = useState<OutputLength>("detailed");
  const [result, setResult] = useState<GeneratedRecipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [followUpInput, setFollowUpInput] = useState("");
  const followUpRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const addIngredient = () => {
    const trimmed = inputVal.trim();
    if (trimmed && !ingredients.includes(trimmed) && ingredients.length < 15) {
      setIngredients((prev) => [...prev, trimmed]);
      setInputVal("");
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const buildUserPrompt = (): string => {
    let prompt = `Ingredients: ${ingredients.join(", ")}`;
    if (cuisine) prompt += ` | Cuisine: ${cuisine}`;
    prompt += ` | Length: ${outputLength}`;
    return prompt;
  };

  const addUserMessage = (content: string) => {
    setChatMessages((prev) => [...prev, { role: "user", content }]);
  };

  const addAssistantMessage = (recipe: GeneratedRecipe) => {
    setChatMessages((prev) => [
      ...prev,
      { role: "assistant", content: JSON.stringify(recipe) },
    ]);
  };

  const generateMutation = useMutation<
    ApiResponse<{ recipe: GeneratedRecipe }>,
    Error,
    void
  >({
    mutationFn: async () => {
      const body: Record<string, unknown> = {
        ingredients,
        outputLength,
      };
      if (cuisine) body.cuisine = cuisine;
      const res = await api.post<ApiResponse<{ recipe: GeneratedRecipe }>>(
        "/ai/generate-recipe",
        body,
      );
      return res.data;
    },
    onMutate: () => {
      setIsGenerating(true);
      setResult(null);
      addUserMessage(buildUserPrompt());
    },
    onSuccess: (data) => {
      const recipe = data.data.recipe;
      setResult(recipe);
      addAssistantMessage(recipe);
      setIsGenerating(false);
    },
    onError: () => {
      toast.error("Failed to generate recipe");
      setChatMessages((prev) => prev.slice(0, -1));
      setIsGenerating(false);
    },
  });

  const followUpMutation = useMutation<
    ApiResponse<{ recipe: GeneratedRecipe }>,
    Error,
    string
  >({
    mutationFn: async (question: string) => {
      const body: Record<string, unknown> = {
        ingredients,
        outputLength,
        messages: chatMessages,
        followUp: question,
      };
      if (cuisine) body.cuisine = cuisine;
      const res = await api.post<ApiResponse<{ recipe: GeneratedRecipe }>>(
        "/ai/generate-recipe",
        body,
      );
      return res.data;
    },
    onMutate: (question) => {
      setIsGenerating(true);
      setResult(null);
      setChatMessages((prev) => [...prev, { role: "user", content: question }]);
      setFollowUpInput("");
    },
    onSuccess: (data) => {
      const recipe = data.data.recipe;
      setResult(recipe);
      addAssistantMessage(recipe);
      setIsGenerating(false);
    },
    onError: () => {
      toast.error("Failed to process follow-up");
      setChatMessages((prev) => prev.slice(0, -1));
      setIsGenerating(false);
    },
  });

  const handleFollowUpSubmit = () => {
    const question = followUpInput.trim();
    if (!question) return;
    followUpMutation.mutate(question);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setFollowUpInput(suggestion);
    followUpMutation.mutate(suggestion);
  };

  const parseTitleFromMessage = (content: string): string => {
    try {
      const parsed = JSON.parse(content) as GeneratedRecipe;
      return parsed.title || "Recipe";
    } catch {
      return "Recipe";
    }
  };

  const visibleChatHistory = [...chatMessages]
    .reverse()
    .reduce<
      Array<{ role: "user" | "assistant"; content: string; index: number }>
    >((acc, msg, revIdx) => {
      const realIdx = chatMessages.length - 1 - revIdx;
      if (msg.role === "user") {
        acc.push({ role: msg.role, content: msg.content, index: realIdx });
      } else if (acc.length > 0 && acc[acc.length - 1].role === "user") {
        acc.push({ role: msg.role, content: msg.content, index: realIdx });
      }
      return acc;
    }, [])
    .slice(0, 10);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!result) return;
      await api.post("/recipes", {
        title: result.title,
        shortDescription: result.shortDescription || "",
        fullDescription: result.shortDescription || "",
        cuisine: result.cuisine || "",
        difficulty: result.difficulty || "Medium",
        cookingTime: Number(result.cookingTime) || 30,
        servings: 4,
        ingredients: result.ingredients,
        instructions: result.instructions,
        image: "",
      });
    },
    onSuccess: () => {
      toast.success("Recipe saved to your collection!");
      router.push("/recipe/manage");
    },
    onError: () => {
      toast.error("Failed to save recipe");
    },
  });

  const nutritionCards: NutritionCard[] = result?.nutrition
    ? [
        {
          label: "Calories",
          value: result.nutrition.calories,
          color: "text-primary-500",
        },
        {
          label: "Protein",
          value: result.nutrition.protein,
          color: "text-secondary-500",
        },
        {
          label: "Carbs",
          value: result.nutrition.carbs,
          color: "text-yellow-600 dark:text-yellow-400",
        },
        {
          label: "Fat",
          value: result.nutrition.fat,
          color: "text-neutral-600 dark:text-neutral-300",
        },
      ]
    : [];

  const showFollowUpSection =
    (result && !isGenerating) || chatMessages.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT COLUMN — Input Form + Chat History */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <ChefHat className="h-7 w-7 text-primary-500" />
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
              AI Recipe Generator
            </h1>
          </div>

          {/* Ingredient Input */}
          <div className="mb-5">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 block">
              Ingredients
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addIngredient();
                  }
                }}
                placeholder="e.g., chicken, garlic, rice..."
                className="input-premium flex-1 border border-neutral-300 dark:border-neutral-600 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 outline-none"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addIngredient}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium"
                  >
                    {ing}
                    <button
                      onClick={() => removeIngredient(i)}
                      className="cursor-pointer hover:text-primary-900 dark:hover:text-primary-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-neutral-400 mt-1">
              {ingredients.length}/15 ingredients
            </p>
          </div>

          {/* Cuisine Select */}
          <div className="mb-5">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 block">
              Cuisine (Optional)
            </label>
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="input-premium w-full border border-neutral-300 dark:border-neutral-600 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 outline-none cursor-pointer"
            >
              {["", ...CUISINE_OPTIONS].map((c) => (
                <option key={c} value={c}>
                  {c || "Any Cuisine"}
                </option>
              ))}
            </select>
          </div>

          {/* Output Length */}
          <div className="mb-8">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
              Output Length
            </label>
            <div className="grid grid-cols-3 gap-3">
              {lengthOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setOutputLength(opt.value)}
                  className={`btn-premium border rounded-lg p-3 text-center cursor-pointer ${
                    outputLength === opt.value
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500"
                      : "border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500"
                  }`}
                >
                  <span
                    className={`text-sm font-medium block ${
                      outputLength === opt.value
                        ? "text-primary-700 dark:text-primary-300"
                        : "text-neutral-700 dark:text-neutral-200"
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={() => generateMutation.mutate()}
            isLoading={isGenerating && !followUpMutation.isPending}
            disabled={ingredients.length === 0 || isGenerating}
            className="w-full"
            size="lg"
          >
            <ChefHat className="h-5 w-5 mr-2" />
            Generate Recipe
          </Button>

          {/* Chat History Panel */}
          {chatMessages.length > 0 && (
            <div className="mt-2 border border-neutral-200 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-800/50 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                <MessageSquare className="h-4 w-4 text-primary-500" />
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Conversation History
                </span>
                <span className="ml-auto text-xs text-neutral-400">
                  {Math.floor(chatMessages.length / 2)} exchange
                  {chatMessages.length > 2 ? "s" : ""}
                </span>
              </div>
              <div className="max-h-[360px] overflow-y-auto px-4 py-3 space-y-3">
                {visibleChatHistory.map((entry, idx) => {
                  if (entry.role === "user") {
                    const nextEntry = visibleChatHistory[idx + 1];
                    return (
                      <div key={entry.index}>
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 shrink-0">
                            <User className="h-3.5 w-3.5 text-neutral-400" />
                          </div>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed truncate">
                            {entry.content}
                          </p>
                        </div>
                        {nextEntry && nextEntry.role === "assistant" && (
                          <div className="flex items-start gap-2 mt-1.5 ml-0.5">
                            <div className="mt-0.5 shrink-0">
                              <Bot className="h-3.5 w-3.5 text-primary-400" />
                            </div>
                            <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                              {parseTitleFromMessage(nextEntry.content)}
                            </p>
                          </div>
                        )}
                        {idx < visibleChatHistory.length - 1 && (
                          <div className="border-b border-neutral-100 dark:border-neutral-700/50 mt-3" />
                        )}
                      </div>
                    );
                  }
                  return null;
                })}
                <div ref={chatEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — Result + Follow-up */}
        <div>
          {!result && !isGenerating && chatMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                <ChefHat className="h-9 w-9 text-primary-300 dark:text-primary-600" />
              </div>
              <p className="text-neutral-400 dark:text-neutral-500 text-lg">
                Your AI-generated recipe will appear here...
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <Loader2 className="h-10 w-10 text-primary-500 animate-spin mb-4" />
              <p className="text-neutral-500 dark:text-neutral-400">
                {followUpMutation.isPending
                  ? "Refining your recipe..."
                  : "Crafting the perfect recipe for you..."}
              </p>
            </div>
          )}

          {result && !isGenerating && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                  {result.title}
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.cuisine && (
                    <span className="bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 px-3 py-1 rounded-full text-xs font-medium">
                      {result.cuisine}
                    </span>
                  )}
                  {result.difficulty && (
                    <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-xs font-medium">
                      {result.difficulty}
                    </span>
                  )}
                  {result.cookingTime && (
                    <span className="bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 px-3 py-1 rounded-full text-xs font-medium">
                      {result.cookingTime} min
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
                  Ingredients
                </h3>
                <ul className="space-y-1.5">
                  {result.ingredients?.map((item: Ingredient, i: number) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300"
                    >
                      <CheckCircle className="h-4 w-4 text-secondary-500 shrink-0" />
                      {item.qty} {item.unit} {item.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
                  Instructions
                </h3>
                <ol className="space-y-2">
                  {result.instructions?.map((step: string, i: number) => (
                    <li key={i} className="flex gap-3">
                      <span className="bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>

              {nutritionCards.length > 0 && (
                <div>
                  <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
                    Nutrition (per serving)
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {nutritionCards.map((n) => (
                      <div
                        key={n.label}
                        className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3 text-center"
                      >
                        <p className={`text-lg font-bold ${n.color}`}>
                          {n.value}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {n.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => generateMutation.mutate()}
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-4 w-4 mr-1.5" /> Regenerate
                </Button>
                <Button
                  onClick={() => saveMutation.mutate()}
                  isLoading={saveMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-1.5" /> Save to My Recipes
                </Button>
              </div>

              {/* Suggested Follow-ups */}
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                  Suggested follow-ups
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_FOLLOWUPS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      disabled={isGenerating}
                      className="btn-premium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-full text-sm cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Follow-up Input */}
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl p-4 bg-white dark:bg-neutral-800/50">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                  Ask a follow-up question about this recipe...
                </label>
                <div className="flex gap-2">
                  <input
                    ref={followUpRef}
                    type="text"
                    value={followUpInput}
                    onChange={(e) => setFollowUpInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleFollowUpSubmit();
                      }
                    }}
                    placeholder="e.g., Can I use tofu instead of chicken?"
                    disabled={isGenerating}
                    className="input-premium flex-1 border border-neutral-300 dark:border-neutral-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <Button
                    onClick={handleFollowUpSubmit}
                    disabled={!followUpInput.trim() || isGenerating}
                    isLoading={followUpMutation.isPending}
                    size="md"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Follow-up input visible even when loading from follow-up if we had a previous chat */}
          {showFollowUpSection && !result && isGenerating && (
            <div className="mt-6">
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl p-4 bg-white dark:bg-neutral-800/50 opacity-50">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                  Ask a follow-up question about this recipe...
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={followUpInput}
                    onChange={(e) => setFollowUpInput(e.target.value)}
                    placeholder="e.g., Can I use tofu instead of chicken?"
                    disabled
                    className="input-premium flex-1 border border-neutral-300 dark:border-neutral-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 outline-none"
                  />
                  <Button disabled size="md">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <AuthGuard>
      <GeneratorContent />
    </AuthGuard>
  );
}
