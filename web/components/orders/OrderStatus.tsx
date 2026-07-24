import clsx from "clsx";
import { Check, X } from "lucide-react";
import { OrderStatusType } from "@/types/order";

interface OrderStatusProps {
  status: OrderStatusType;
}

const STEPS: OrderStatusType[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out For Delivery",
  "Delivered",
];

export default function OrderStatus({ status }: OrderStatusProps) {
  if (status === "Cancelled") {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-5 dark:border-red-950/20 dark:bg-red-950/10 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-600 text-white shadow-sm shadow-red-600/20">
          <X size={16} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-red-900 dark:text-red-400">Order Cancelled</h4>
          <p className="text-xs text-red-600 dark:text-red-500/80 mt-0.5">
            This order has been cancelled and cannot be processed further.
          </p>
        </div>
      </div>
    );
  }

  const currentStepIndex = STEPS.indexOf(status);

  return (
    <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm">
      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight mb-6">
        Order Status Timeline
      </h4>
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
        {/* Progress Line */}
        <div className="absolute left-[17px] md:left-0 top-0 md:top-4 h-full md:h-[2px] w-[2px] md:w-full bg-zinc-100 dark:bg-zinc-800 -z-10" />

        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div key={step} className="flex md:flex-col items-center gap-4 md:gap-2 flex-1 relative z-10 w-full md:w-auto">
              <div
                className={clsx(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 text-xs font-semibold border",
                  isCompleted
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10"
                    : "bg-white border-zinc-200 text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-600",
                  isCurrent && "ring-4 ring-blue-50 dark:ring-blue-950/40 border-blue-600"
                )}
              >
                {isCompleted && !isCurrent ? <Check size={14} strokeWidth={3} /> : idx + 1}
              </div>
              <div className="text-left md:text-center">
                <p
                  className={clsx(
                    "text-xs font-semibold tracking-tight transition-colors duration-200",
                    isCurrent
                      ? "text-blue-600 dark:text-blue-500 font-bold"
                      : isCompleted
                      ? "text-zinc-800 dark:text-zinc-200"
                      : "text-zinc-400 dark:text-zinc-500"
                  )}
                >
                  {step}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}