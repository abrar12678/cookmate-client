import Image from "next/image";
import { Brain, Users, Heart } from "lucide-react";

const differentiators = [
  {
    icon: Brain,
    title: "AI-First Approach",
    description:
      "Every feature is powered by intelligent AI models that reason about ingredients, flavor pairings, and nutritional science to deliver results you can actually cook with confidence.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Our growing community of home cooks and food enthusiasts share authentic recipes, honest reviews, and cooking tips that make every meal better than the last.",
  },
  {
    icon: Heart,
    title: "Free Forever",
    description:
      "Core features like recipe browsing, AI generation, and food analysis are and always will be free. We believe great cooking tools should be accessible to everyone.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-100">
          About <span className="text-primary-500">CookMate AI</span>
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed">
          We are on a mission to revolutionize home cooking by combining
          artificial intelligence with the timeless joy of preparing and sharing
          great food.
        </p>
      </div>

      {/* Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-16">
        <div>
          <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
            Our Mission
          </h2>
          <h3 className="text-xl font-semibold text-primary-500 mb-4">
            Empowering Home Cooks
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
            We believe everyone can be a great cook. Our AI removes the
            guesswork from meal planning by generating creative recipes from
            whatever ingredients you already have at home, reducing food waste
            and saving you money.
          </p>
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
            Whether you are a beginner learning to boil an egg or an experienced
            cook looking for fresh inspiration, CookMate AI adapts to your skill
            level and dietary preferences to deliver personalized culinary
            guidance.
          </p>
          <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Founded in 2024 by a team of food lovers and engineers, we started
            with a simple question: what if your kitchen could think? That idea
            became CookMate AI — your intelligent companion for every meal.
          </p>
        </div>
        <div className="relative w-full h-[450px]">
          <Image
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=450&fit=crop"
            alt="Chef preparing a dish"
            fill
            className="rounded-2xl object-cover shadow-lg"
          />
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 text-center mb-4">
          What Makes Us Different
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-center max-w-xl mx-auto mb-12">
          Three core principles guide everything we build at CookMate AI.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {differentiators.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-500/10 mb-5">
                  <Icon className="h-7 w-7 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}