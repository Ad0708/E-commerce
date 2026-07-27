interface CustomerStatusBadgeProps {
  isBlocked: boolean;
}

export function CustomerStatusBadge({ isBlocked }: CustomerStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        isBlocked
          ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50"
          : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isBlocked ? "bg-red-500" : "bg-emerald-500"}`}
      />
      {isBlocked ? "Blocked" : "Active"}
    </span>
  );
}
