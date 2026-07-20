export default function HowItWorks() {
  const steps = [
    {
      num: 1,
      title: "Browse or Generate",
      description:
        "Explore thousands of recipes or let our AI create one based on your ingredients.",
    },
    {
      num: 2,
      title: "Cook & Enjoy",
      description:
        "Follow step-by-step instructions with precise measurements and cooking times.",
    },
    {
      num: 3,
      title: "Share & Rate",
      description:
        "Share your experience, rate recipes, and help others discover great dishes.",
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100">
            How It Works
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-4 max-w-xl mx-auto">
            Three simple steps to elevate your cooking experience with CookMate
            AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto relative stagger-children">
          <div className="hidden md:block absolute top-6 left-[20%] right-[20%] border-t-2 border-dashed border-primary-200 dark:border-primary-800" />

          {steps.map((step) => (
            <div
              key={step.num}
              className="flex flex-col items-center text-center relative z-10"
            >
              <div className="bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 font-bold text-2xl w-14 h-14 flex items-center justify-center rounded-full">
                {step.num}
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-100 mt-5">
                {step.title}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}