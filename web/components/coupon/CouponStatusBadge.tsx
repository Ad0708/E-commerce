import React from "react";

interface StatusBadgeProps {
  status: "active" | "inactive" | "scheduled";
  expiryDate: string;
  isUpdating?: boolean;
  onClick?: () => void;
}

export const CouponStatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  expiryDate,
  isUpdating = false,
  onClick,
}) => {
  const isExpired = new Date(expiryDate) < new Date();

  let badgeStyles =
    "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";
  let displayStatus = status;

  if (isExpired) {
    badgeStyles =
      "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-900";
    displayStatus = "expired" as any;
  } else if (status === "active") {
    badgeStyles =
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900";
  } else if (status === "scheduled") {
    badgeStyles =
      "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-900";
  }

  return (
    <button
      onClick={(e) => {
        if (isExpired || !onClick || isUpdating) return;
        e.stopPropagation();
        onClick();
      }}
      disabled={isExpired || isUpdating}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all select-none ${badgeStyles} ${
        onClick && !isExpired
          ? "cursor-pointer hover:opacity-80 active:scale-95"
          : "cursor-default"
      }`}
    >
      {isUpdating && (
        <svg
          className="animate-spin h-3 w-3 current-color text-inherit"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className="capitalize">{displayStatus}</span>
    </button>
  );
};
