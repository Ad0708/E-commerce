import React from "react";
import { Coupon } from "@/types/coupon";
import { SummaryCard } from "../common/SummaryCard";

interface StatsProps {
  coupons: Coupon[] | undefined;
}

export const CouponStatsRow: React.FC<StatsProps> = ({ coupons = [] }) => {
  const now = new Date();

  const total = coupons.length;
  const active = coupons.filter(
    (c) => c.status === "active" && new Date(c.expiryDate) >= now,
  ).length;
  const expired = coupons.filter((c) => new Date(c.expiryDate) < now).length;
  const totalUsage = coupons.reduce(
    (acc, curr) => acc + (curr.usedCount || 0),
    0,
  );

  const stats = [
    { name: "Total Coupons", value: total },
    { name: "Active Coupons", value: active },
    { name: "Expired Coupons", value: expired },
    { name: "Total Usage Count", value: totalUsage },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <SummaryCard
          key={stat.name}
          label={stat.name}
          value={stat.value}
          color="gray"
        />
      ))}
    </div>
  );
};
