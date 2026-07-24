"use client";

import { SummaryCard } from "@/components/common/SummaryCard";
import { Users, UserCheck, UserX, UserPlus } from "lucide-react";

interface CustomerStatsProps {
  total: number;
  active: number;
  blocked: number;
  newCustomers: number;
}

const stats = (
  total: number,
  active: number,
  blocked: number,
  newCustomers: number,
) => [
  {
    title: "Total Customers",
    value: total,
    color: "gray" as const,
    icon: Users,
    iconBg: "bg-violet-100 dark:bg-violet-900/30",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    title: "Active Customers",
    value: active,
    color: "green" as const,
    icon: UserCheck,
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    title: "Blocked Customers",
    value: blocked,
    color: "red" as const,
    icon: UserX,
    iconBg: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    title: "New This Month",
    value: newCustomers,
    color: "amber" as const,
    icon: UserPlus,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
];

export default function CustomerStats({
  total,
  active,
  blocked,
  newCustomers,
}: CustomerStatsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats(total, active, blocked, newCustomers).map((stat) => {
        const Icon = stat.icon;

        return (
          <SummaryCard
            key={stat.title}
            label={stat.title}
            value={stat.value}
            color={stat.color}
            icon={<Icon className={`h-6 w-6 ${stat.iconColor}`} />}
            iconBg={stat.iconBg}
          />
        );
      })}
    </div>
  );
}
