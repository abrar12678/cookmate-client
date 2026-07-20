import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PopularRecipes from "@/components/landing/PopularRecipes";
import HowItWorks from "@/components/landing/HowItWorks";
import CuisineCategories from "@/components/landing/CuisineCategories";
import StatsSection from "@/components/landing/StatsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import NewsletterSection from "@/components/landing/NewsletterSection";
import FAQSection from "@/components/landing/FAQSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PopularRecipes />
      <HowItWorks />
      <CuisineCategories />
      <StatsSection />
      <TestimonialsSection />
      <NewsletterSection />
      <FAQSection />
    </>
  );
}
