export default function OrderSkeleton() {
  return (
    <div className="space-y-4 w-full max-w-5xl mx-auto">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 bg-white dark:bg-zinc-900 animate-pulse"
        >
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
            </div>
            <div className="h-7 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
              <div className="h-14 w-14 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
              <div className="space-y-2 ml-2 hidden sm:block">
                <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
              </div>
            </div>
            <div className="h-8 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}