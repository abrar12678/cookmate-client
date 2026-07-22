import Link from "next/link";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="min-h-[65vh] bg-gradient-to-br from-primary-50 to-white dark:from-neutral-900 dark:to-neutral-800 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-800 dark:text-neutral-100 leading-tight">
            Discover, Cook &amp; Share Amazing Recipes with{" "}
            <span className="text-primary-500">AI</span>
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mt-6 leading-relaxed">
            Unleash your culinary creativity with our AI-powered recipe
            generator and food analyzer. Turn everyday ingredients into
            extraordinary meals.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/explore">
              <Button size="lg">Explore Recipes</Button>
            </Link>
            <Link href="/ai/generator">
              <Button variant="secondary" size="lg">
                AI Generator
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop"
            alt="Delicious food plating"
            className="rounded-2xl shadow-2xl w-full max-w-lg object-cover hover:scale-[1.02] transition-transform duration-700 ease-out"
          />
        </div>
      </div>
    </section>
  );
}