export default function RecipeCardSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="w-full aspect-video bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
      <div className="p-4 flex flex-col flex-grow space-y-3">
        <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        <div className="h-5 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        <div className="flex-grow space-y-2">
          <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
          <div className="h-3 w-2/3 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        </div>
        <div className="h-3 w-12 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        <div className="h-9 w-full bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}