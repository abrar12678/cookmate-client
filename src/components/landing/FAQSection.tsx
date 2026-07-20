"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQS } from "@/constants";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white dark:bg-neutral-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100 text-center mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-center mb-12">
          Everything you need to know about CookMate AI.
        </p>

        <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {FAQS.map((faq, index) => (
            <div key={index} className="py-4">
              <button
                onClick={() => toggle(index)}
                className="flex items-center justify-between w-full text-left cursor-pointer group"
              >
                <span className="font-medium text-neutral-800 dark:text-neutral-100 pr-4 group-hover:text-primary-500 transition-colors duration-200">
                  {faq.question}
                </span>
                <div className="shrink-0 w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-primary-50 dark:group-hover:bg-primary-500/10 transition-all duration-200">
                  {openIndex === index ? (
                    <Minus className="h-4 w-4 text-primary-500" />
                  ) : (
                    <Plus className="h-4 w-4 text-neutral-400 group-hover:text-primary-500 transition-colors duration-200" />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <p className="pb-4 pt-2 text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed animate-fade-in-up">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}