"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Sparkles, ChevronDown, Clock, Star, ChevronLeft, ChevronRight, Flame } from "lucide-react";

const HERO_SLIDES = [
  {
    id: 1,
    title: "Creamy Garlic Fettuccine Alfredo",
    cuisine: "Italian",
    time: "25 min",
    rating: "4.9",
    calories: "520 kcal",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80",
    badge: "🔥 Trending #1",
  },
  {
    id: 2,
    title: "Authentic Tonkotsu Ramen",
    cuisine: "Japanese",
    time: "40 min",
    rating: "5.0",
    calories: "680 kcal",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
    badge: "✨ AI Chef Choice",
  },
  {
    id: 3,
    title: "Fresh Grilled Salmon Bowl",
    cuisine: "Healthy",
    time: "20 min",
    rating: "4.8",
    calories: "440 kcal",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
    badge: "🥗 High Protein",
  },
  {
    id: 4,
    title: "Smokey Artisanal Cheeseburger",
    cuisine: "American",
    time: "15 min",
    rating: "4.9",
    calories: "720 kcal",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    badge: "🍔 Fan Favorite",
  },
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  }, []);

  // Auto-switch slide every 4 seconds unless user hovers
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  const current = HERO_SLIDES[activeSlide];

  const scrollToNext = () => {
    const nextSection = document.getElementById("features");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[65vh] max-h-[750px] bg-gradient-to-br from-primary-50/90 via-white to-amber-50/50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 flex flex-col justify-between overflow-hidden border-b border-neutral-200/60 dark:border-neutral-800">
      {/* Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Column: Heading & CTAs */}
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-100/90 dark:bg-primary-950/70 text-primary-600 dark:text-primary-400 text-xs font-semibold shadow-sm animate-pulse">
            <Sparkles className="h-3.5 w-3.5 text-primary-500" />
            <span>AI Culinary Magic &amp; Smart Food Analysis</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-neutral-50 leading-tight tracking-tight">
            Discover, Cook &amp; Share Amazing Recipes with{" "}
            <span className="bg-gradient-to-r from-primary-500 via-amber-500 to-primary-600 bg-clip-text text-transparent">
              AI Power
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-xl">
            Transform pantry ingredients into gourmet meals. Generate customized step-by-step recipes, analyze dish nutrition instantly from photos, and explore community creations.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link href="/explore">
              <Button size="lg" className="shadow-lg shadow-primary-500/25 cursor-pointer font-semibold">
                Explore Recipes
              </Button>
            </Link>
            <Link href="/ai/generator">
              <Button variant="outline" size="lg" className="cursor-pointer font-semibold">
                <Sparkles className="h-4 w-4 mr-2 text-primary-500" />
                AI Recipe Builder
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Premium Interactive Card & Slider */}
        <div
          className="lg:col-span-5 relative flex justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative w-full max-w-md bg-white/90 dark:bg-neutral-800/90 rounded-3xl p-4 shadow-2xl border border-neutral-200/80 dark:border-neutral-700/80 backdrop-blur-xl transition-all duration-500 group">
            {/* Top Badge */}
            <div className="absolute top-7 left-7 z-20 bg-neutral-900/80 dark:bg-neutral-900/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/10">
              <span>{current.badge}</span>
            </div>

            {/* Next / Prev Floating Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-200 flex items-center justify-center shadow-lg border border-neutral-200 dark:border-neutral-700 hover:scale-110 transition-all opacity-80 hover:opacity-100 cursor-pointer"
              aria-label="Previous recipe"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-200 flex items-center justify-center shadow-lg border border-neutral-200 dark:border-neutral-700 hover:scale-110 transition-all opacity-80 hover:opacity-100 cursor-pointer"
              aria-label="Next recipe"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Featured Image Container */}
            <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden mb-4 bg-neutral-100 dark:bg-neutral-900">
              <img
                key={current.id}
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary-400 bg-primary-950/70 px-2 py-0.5 rounded">
                  {current.cuisine} Cuisine
                </span>
                <h3 className="text-base sm:text-lg font-bold mt-1 text-white line-clamp-1 drop-shadow">
                  {current.title}
                </h3>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-between px-2 text-xs text-neutral-600 dark:text-neutral-300">
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 text-primary-500" />
                <span>{current.time}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                <span>{current.calories}</span>
              </div>
              <div className="flex items-center gap-1 font-bold text-neutral-800 dark:text-neutral-100">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{current.rating}</span>
              </div>
            </div>

            {/* Thumbnail Navigation Tabs */}
            <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-700/80">
              {HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(idx)}
                  className={`relative h-12 rounded-xl overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                    idx === activeSlide
                      ? "border-primary-500 ring-2 ring-primary-500/30 scale-105"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Flow / Scroll Down Indicator */}
      <div className="w-full pb-3 flex justify-center items-center z-10">
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