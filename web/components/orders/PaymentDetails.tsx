import clsx from "clsx";
import { CreditCard, ShieldCheck } from "lucide-react";
import { PaymentDetailsType } from "@/types/order";

interface PaymentDetailsProps {
  payment: PaymentDetailsType;
}

export default function PaymentDetails({ payment }: PaymentDetailsProps) {
  const getStatusClasses = (status: PaymentDetailsType["status"]) => {
    switch (status) {
      case "Paid":
        return "bg-green-50 text-green-700 ring-green-600/10 dark:bg-green-500/10 dark:text-green-400";
      case "Pending":
        return "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400";
      case "Failed":
        return "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-500/10 dark:text-red-400";
      case "Refunded":
        return "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-400";
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4">
      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
        Payment Details
      </h4>

      <div className="space-y-3.5 pl-0.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <CreditCard size={15} /> Method
          </span>
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 tracking-wide">
            {payment?.method}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <ShieldCheck size={15} /> Status
          </span>
          <span
            className={clsx(
              "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset",
              getStatusClasses(payment.status)
            )}
          >
            {payment.status}
          </span>
        </div>

        {payment.transactionId && (
          <div className="pt-2 border-t border-zinc-50 dark:border-zinc-800/40">
            <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Transaction ID
            </p>
            <p className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 truncate mt-0.5 select-all">
              {payment.transactionId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}