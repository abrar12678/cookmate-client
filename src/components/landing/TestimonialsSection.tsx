import { MessageSquare, Star } from "lucide-react";
import { TESTIMONIALS } from "@/constants";

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100 text-center mb-4">
          What Our Users Say
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-center mb-12 max-w-xl mx-auto">
          Real stories from real cooks who love CookMate AI.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="card-premium border-l-4 border-primary-500 bg-neutral-50 dark:bg-neutral-800 p-6 rounded-r-xl flex flex-col"
            >
              <MessageSquare className="h-5 w-5 text-primary-300 mb-3" />
              <p className="text-neutral-600 dark:text-neutral-300 text-sm italic leading-relaxed flex-grow">
                &ldquo;{t.comment}&rdquo;
              </p>
              <div className="flex items-center gap-0.5 mt-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <div className="mt-3">
                <p className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
                  {t.name}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}