function PageSkeleton() {
  return (
    <div className="space-y-5 animate-pulse max-w-7xl mx-auto">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
        >
          <div className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-56 bg-gray-100 dark:bg-gray-800 rounded mt-2" />
          </div>
          <div className="px-6 py-5 grid grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PageSkeleton;