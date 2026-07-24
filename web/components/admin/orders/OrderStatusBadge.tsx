import clsx from "clsx";
import { OrderStatusType } from "@/types/order";

interface OrderStatusBadgeProps {
  status: OrderStatusType;
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusStyle = (currentStatus: OrderStatusType) => {
    switch (currentStatus) {
      case "Delivered":
        return "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400";
      case "Cancelled":
        return "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400";
      case "Pending":
        return "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400";
      case "Confirmed":
        return "bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/10 dark:text-indigo-400";
      case "Processing":
        return "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400";
      case "Shipped":
        return "bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-500/10 dark:text-purple-400";
      case "Out For Delivery":
        return "bg-cyan-50 text-cyan-700 ring-cyan-600/20 dark:bg-cyan-500/10 dark:text-cyan-400";
      default:
        return "bg-zinc-50 text-zinc-700 ring-zinc-600/20 dark:bg-zinc-500/10 dark:text-zinc-400";
    }
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        getStatusStyle(status)
      )}
    >
      {status}
    </span>
  );
}