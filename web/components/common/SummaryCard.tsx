import { ReactNode } from "react";

interface SummaryCardProps {
  label: string;
  value: number;
  color: "gray" | "green" | "amber" | "red" ;
  icon?: ReactNode;
  iconBg?: string;
}

export function SummaryCard({
  label,
  value,
  color,
  icon,
  iconBg = "bg-gray-100 dark:bg-gray-800",
}: SummaryCardProps) {
  const colors = {
    gray: "text-gray-900 dark:text-white",
    green: "text-green-600 dark:text-green-400",
    amber: "text-amber-600 dark:text-amber-400",
    red: "text-red-600 dark:text-red-400",
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm transition hover:shadow-md dark:border dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>

          <h3
            className={`mt-2 text-2xl font-bold tracking-tight ${colors[color]}`}
          >
            {value.toLocaleString("en-IN")}
          </h3>
        </div>

        {icon && (
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
