import Link from "next/link";
import Image from "next/image";
import { CUISINE_CATEGORIES } from "@/constants";

export default function CuisineCategories() {
  return (
    <section className="py-20 bg-neutral-50 dark:bg-neutral-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-100 text-center mb-4">
          Explore World Cuisines
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-center mb-12 max-w-xl mx-auto">
          Discover authentic flavors from every corner of the globe.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
          {CUISINE_CATEGORIES.map((cuisine) => (
            <Link
              key={cuisine.name}
              href={`/explore?cuisine=${cuisine.name}`}
              className="relative h-40 rounded-2xl overflow-hidden group cursor-pointer"
            >
              <Image
                src={cuisine.image}
                alt={cuisine.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300" />
              <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                {cuisine.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}