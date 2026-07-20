import { ChefHat, ScanLine, Users } from "lucide-react";

const features = [
  {
    icon: ChefHat,
    title: "AI Recipe Generator",
    description:
      "Generate unique recipes based on ingredients you have at home. Our AI analyzes flavor pairings and creates restaurant-quality meals from your pantry staples.",
  },
  {
    icon: ScanLine,
    title: "Smart Food Analyzer",
    description:
      "Upload a food photo and get instant nutritional analysis. Identify dishes, estimate calories, protein, carbs, and fat with remarkable accuracy.",
  },
  {
    icon: Users,
    title: "Community Recipes",
    description:
      "Share your favorite recipes with a growing community of food lovers. Discover authentic dishes from home cooks around the world.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100">
            Why Choose CookMate AI?
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">
            Powerful tools that transform the way you cook, explore, and share
            recipes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card-premium bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl p-8"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-500/10 mb-5 icon-bounce">
                  <Icon className="h-7 w-7 text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}