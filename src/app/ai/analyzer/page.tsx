"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { toast } from "react-toastify";
import AuthGuard from "@/components/layout/AuthGuard";
import Button from "@/components/ui/Button";
import {
  Loader2,
  Search,
  Lightbulb,
  Send,
  MessageSquare,
  Bot,
  User,
  UtensilsCrossed,
} from "lucide-react";
import type { FoodAnalysis, ApiResponse } from "@/types";

const COLORS = ["#2D6A4F", "#E85D04", "#1B1B1B"];

interface ChartDatum {
  name: string;
  value: number;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  dishName?: string;
}

const SUGGESTED_PROMPTS = [
  "Is this dish healthy?",
  "Suggest a side dish",
  "How to make it healthier?",
];

const EXAMPLE_DESCRIPTIONS = [
  "Chicken Biryani with raita and salad",
  "Margherita pizza with mozzarella cheese",
  "Grilled salmon with roasted vegetables",
  "Chicken Tikka Masala with naan bread",
];

function NutritionDonut({
  data,
  colors,
}: {
  data: ChartDatum[];
  colors: string[];
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) return null;

  const segments = data.map((item, i) => {
    const previousTotal = data.slice(0, i).reduce((sum, d) => sum + d.value, 0);
    const start = (previousTotal / total) * 100;
    const percent = (item.value / total) * 100;
    return `${colors[i % colors.length]} ${start.toFixed(1)}% ${(start + percent).toFixed(1)}%`;
  });

  return (
    <div className="relative w-[200px] h-[200px] shrink-0">
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `conic-gradient(${segments.join(", ")})`,
          WebkitMask: "radial-gradient(circle, transparent 60px, black 61px)",
          mask: "radial-gradient(circle, transparent 60px, black 61px)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-neutral-600 dark:text-neutral-300">
          {total}g
        </span>
      </div>
    </div>
  );
}

function truncate(str: string, max: number) {
  if (str.length <= max) return str;
  return str.slice(0, max).trimEnd() + "…";
}

function AnalyzerContent() {
  const followUpRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const currentFollowUpRef = useRef<string>("");

  const [foodInput, setFoodInput] = useState("");
  const [result, setResult] = useState<FoodAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [followUp, setFollowUp] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, result]);

  const analyzeMutation = useMutation<
    ApiResponse<{ analysis: FoodAnalysis }>,
    Error,
    { foodDescription: string; messages?: ChatMessage[]; followUp?: string }
  >({
    mutationFn: async (payload) => {
      const res = await api.post<ApiResponse<{ analysis: FoodAnalysis }>>(
        "/ai/analyze-food",
        payload,
      );
      return res.data;
    },
    onMutate: () => {
      setIsAnalyzing(true);
      if (!currentFollowUpRef.current) setResult(null);
    },
    onSuccess: (data) => {
      const analysis = data.data.analysis;
      setResult(analysis);
      setIsAnalyzing(false);

      const question = currentFollowUpRef.current;

      setChatMessages((prev) => {
        if (question) {
          return [
            ...prev,
            { role: "user", content: question },
            {
              role: "assistant",
              content: JSON.stringify(analysis),
              dishName: analysis.dishName,
            },
          ];
        }
        return [
          ...prev,
          { role: "user", content: foodInput },
          {
            role: "assistant",
            content: JSON.stringify(analysis),
            dishName: analysis.dishName,
          },
        ];
      });

      currentFollowUpRef.current = "";
      setFollowUp("");
    },
    onError: (error) => {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to analyze food";
      toast.error(msg);
      setIsAnalyzing(false);
    },
  });

  const handleAnalyze = () => {
    const trimmed = foodInput.trim();
    if (!trimmed) return;
    currentFollowUpRef.current = "";
    analyzeMutation.mutate({ foodDescription: trimmed });
  };

  const handleFollowUp = (question?: string) => {
    const q = question || followUp.trim();
    if (!q || !foodInput.trim()) return;
    currentFollowUpRef.current = q;
    setFollowUp("");
    analyzeMutation.mutate({
      foodDescription: foodInput.trim(),
      messages: chatMessages,
      followUp: q,
    });
  };

  const handleFollowUpSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleFollowUp();
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setFollowUp(prompt);
    handleFollowUp(prompt);
  };

  const handleExampleClick = (desc: string) => {
    setFoodInput(desc);
    setResult(null);
    setFollowUp("");
    setChatMessages([]);
  };

  const chartData: ChartDatum[] = result?.nutrition
    ? [
        { name: "Protein", value: parseInt(result.nutrition.protein) || 0 },
        { name: "Carbs", value: parseInt(result.nutrition.carbs) || 0 },
        { name: "Fat", value: parseInt(result.nutrition.fat) || 0 },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT — Text Input + Chat History */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-7 w-7 text-primary-500" />
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
              AI Food Analyzer
            </h1>
          </div>

          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Describe any food or dish and AI will analyze its nutrition,
            ingredients, and provide dietary suggestions.
          </p>

          {/* Food Description Input */}
          <div>
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 block">
              Describe the food
            </label>
            <textarea
              value={foodInput}
              onChange={(e) => setFoodInput(e.target.value)}
              placeholder="e.g., Chicken Biryani with raita, grilled chicken, basmati rice, saffron, yogurt, fried onions..."
              rows={4}
              className="input-premium w-full border border-neutral-300 dark:border-neutral-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 outline-none resize-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            />
          </div>

          {/* Example suggestions */}
          {!result && !isAnalyzing && (
            <div>
              <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-2">
                Try an example:
              </p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_DESCRIPTIONS.map((desc) => (
                  <button
                    key={desc}
                    type="button"
                    onClick={() => handleExampleClick(desc)}
                    className="btn-premium inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
                  >
                    <UtensilsCrossed className="h-3 w-3" />
                    {desc}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleAnalyze}
            isLoading={isAnalyzing}
            disabled={isAnalyzing || !foodInput.trim()}
            className="w-full"
            size="lg"
          >
            <Search className="h-5 w-5 mr-2" />
            Analyze Food
          </Button>

          {/* Chat History Panel */}
          {chatMessages.length > 0 && (
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-700">
                <MessageSquare className="h-4 w-4 text-primary-500" />
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Conversation History
                </h3>
                <span className="ml-auto text-xs text-neutral-400 dark:text-neutral-500">
                  {chatMessages.filter((m) => m.role === "user").length}{" "}
                  {chatMessages.filter((m) => m.role === "user").length === 1
                    ? "exchange"
                    : "exchanges"}
                </span>
              </div>
              <div className="max-h-[320px] overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
                {[...chatMessages].reverse().map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-neutral-50/50 dark:bg-neutral-800/30"
                        : "bg-white dark:bg-neutral-900"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.role === "user"
                          ? "bg-primary-100 dark:bg-primary-900/40"
                          : "bg-secondary-100 dark:bg-secondary-900/40"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                      ) : (
                        <Bot className="h-3.5 w-3.5 text-secondary-600 dark:text-secondary-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-0.5">
                        {msg.role === "user" ? "You" : "AI"}
                      </p>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-snug">
                        {msg.role === "user"
                          ? truncate(msg.content, 80)
                          : msg.dishName
                            ? `Analysis: ${msg.dishName}`
                            : "Analysis result"}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — Results + Follow-up */}
        <div className="space-y-6">
          {!result && !isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                <Search className="h-9 w-9 text-primary-300 dark:text-primary-600" />
              </div>
              <p className="text-neutral-400 dark:text-neutral-500 text-lg">
                Describe a food to see analysis
              </p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2 max-w-xs">
                Type a dish name with details like ingredients, cooking method,
                or cuisine for better analysis.
              </p>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
              <Loader2 className="h-10 w-10 text-primary-500 animate-spin mb-4" />
              <p className="text-neutral-500 dark:text-neutral-400">
                {chatMessages.length > 0
                  ? "Thinking about your follow-up..."
                  : "Analyzing your food description..."}
              </p>
            </div>
          )}

          {result && !isAnalyzing && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                  {result.dishName}
                </h2>
                {result.cuisine && (
                  <span className="inline-block bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 px-3 py-1 rounded-full text-xs font-medium mt-2">
                    {result.cuisine}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
                  Identified Ingredients
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.ingredients?.map((ing: string, i: number) => (
                    <span
                      key={i}
                      className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nutrition Chart */}
              {chartData.some((d) => d.value > 0) && (
                <div>
                  <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 mb-3">
                    Nutrition Breakdown (g)
                  </h3>
                  <div className="flex items-center gap-6">
                    <NutritionDonut data={chartData} colors={COLORS} />
                    <div className="space-y-3">
                      {chartData.map((item, i) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-3"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[i] }}
                          />
                          <div>
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                              {item.name}
                            </p>
                            <p className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
                              {item.value}g
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.nutrition?.calories && (
                    <div className="mt-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {result.nutrition.calories}
                      </p>
                      <p className="text-xs text-primary-500 dark:text-primary-400">
                        Estimated Calories
                      </p>
                    </div>
                  )}
                </div>
              )}

              {result.suggestions?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
                    Suggestions
                  </h3>
                  <ul className="space-y-2">
                    {result.suggestions.map((s: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-300"
                      >
                        <Lightbulb className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-neutral-200 dark:border-neutral-700" />

              {/* Suggested Follow-up Prompts */}
              <div>
                <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 mb-3 text-sm">
                  Quick questions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSuggestedPrompt(prompt)}
                      disabled={isAnalyzing}
                      className="btn-premium inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Lightbulb className="h-3 w-3" />
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Follow-up Input */}
              <form
                onSubmit={handleFollowUpSubmit}
                className="flex items-center gap-2"
              >
                <input
                  ref={followUpRef}
                  type="text"
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  placeholder="Ask a follow-up about this food..."
                  disabled={isAnalyzing}
                  className="input-premium flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none disabled:opacity-50"
                />
                <Button
                  type="submit"
                  disabled={!followUp.trim() || isAnalyzing}
                  isLoading={isAnalyzing}
                  className="shrink-0"
                  size="md"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AnalyzerPage() {
  return (
    <AuthGuard>
      <AnalyzerContent />
    </AuthGuard>
  );
}
