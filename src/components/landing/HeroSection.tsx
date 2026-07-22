"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Sparkles, ChevronDown, Clock, Star } from "lucide-react";

const HERO_SLIDES = [
  {
    id: 1,
    title: "Creamy Garlic Parmesan Pasta",
    cuisine: "Italian",
    time: "25 min",
    rating: "4.9",
    calories: "520 kcal",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=600&h=450&fit=crop",
    badge: "🔥 Top Trending",
  },
  {
    id: 2,
    title: "Authentic Tonkotsu Ramen",
    cuisine: "Japanese",
    time: "40 min",
    rating: "5.0",
    calories: "680 kcal",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=450&fit=crop",
    badge: "✨ AI Chef Special",
  },
  {
    id: 3,
    title: "Fresh Grilled Salmon Bowl",
    cuisine: "Healthy",
    time: "20 min",
    rating: "4.8",
    calories: "440 kcal",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=450&fit=crop",
    badge: "🥗 Low Calorie Choice",
  },
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-switch slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = HERO_SLIDES[activeSlide];

  const scrollToNext = () => {
    const nextSection = document.getElementById("features");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-[65vh] min-h-[520px] max-h-[720px] bg-gradient-to-br from-primary-50/80 via-white to-orange-50/40 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 flex flex-col justify-between overflow-hidden border-b border-neutral-100 dark:border-neutral-800">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Column: Text & CTA */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 text-xs font-semibold mb-4 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered Recipe Generation &amp; Analysis</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-tight">
            Discover, Cook &amp; Share Amazing Recipes with{" "}
            <span className="bg-gradient-to-r from-primary-500 to-amber-500 bg-clip-text text-transparent">
              AI Magic
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-4 leading-relaxed max-w-xl">
            Turn pantry ingredients into chef-quality dishes. Generate custom recipes, analyze meal nutrition from photos, and explore thousands of community favorites.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6">
            <Link href="/explore">
              <Button size="lg" className="shadow-lg shadow-primary-500/25 cursor-pointer">
                Explore Recipes
              </Button>
            </Link>
            <Link href="/ai/generator">
              <Button variant="outline" size="lg" className="cursor-pointer">
                <Sparkles className="h-4 w-4 mr-2 text-primary-500" />
                AI Generator
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Interactive Dish Slider / Card */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md bg-white dark:bg-neutral-800/90 rounded-2xl p-3 sm:p-4 shadow-xl border border-neutral-200/80 dark:border-neutral-700/80 backdrop-blur-md transition-all duration-500">
            {/* Top Badge */}
            <div className="absolute top-6 left-6 z-10 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <span>{current.badge}</span>
            </div>

            {/* Dish Image */}
            <div className="relative h-48 sm:h-56 w-full rounded-xl overflow-hidden mb-3">
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Dish Info */}
            <div className="px-1">
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                <span className="font-semibold text-primary-500 uppercase tracking-wider">
                  {current.cuisine}
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                    {current.time}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-neutral-800 dark:text-neutral-200">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {current.rating}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100 truncate">
                {current.title}
              </h3>
            </div>

            {/* Interactive Slider Dots/Tabs */}
            <div className="flex justify-center items-center gap-2 mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-700">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeSlide
                      ? "w-8 bg-primary-500"
                      : "w-2.5 bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Flow / Scroll Down Indicator */}
      <div className="w-full pb-3 flex justify-center items-center">
        <button
          onClick={scrollToNext}
          className="flex flex-col items-center text-xs font-medium text-neutral-400 hover:text-primary-500 transition-colors cursor-pointer group"
        >
          <span className="mb-1 opacity-80 group-hover:opacity-100">Scroll to Explore</span>
          <ChevronDown className="h-4 w-4 animate-bounce text-primary-500" />
        </button>
      </div>
    </section>
  );
}