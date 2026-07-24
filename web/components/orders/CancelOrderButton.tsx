"use client";

import { useCancelOrder } from "@/hooks/order/useOrder";
import { OrderStatusType } from "@/types/order";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface CancelOrderButtonProps {
  orderId: string;
  status: OrderStatusType;
}

export default function CancelOrderButton({ orderId, status }: CancelOrderButtonProps) {
  const queryClient = useQueryClient();
  const { mutate: cancelOrder, isPending } = useCancelOrder();

  const allowedStatuses: OrderStatusType[] = ["Pending", "Confirmed", "Processing"];
  if (!allowedStatuses.includes(status)) return null;

  const handleCancel = () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    cancelOrder(orderId, {
      onSuccess: () => {
        toast.success("Order cancelled successfully");
        // Ensure single order detail tracking cache is invalidated on real-time mutation
        queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to cancel order"
        );
      },
    });
  };

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleCancel}
      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 border border-red-200 hover:border-red-300 bg-red-50/30 hover:bg-red-50 rounded-xl transition duration-200 disabled:opacity-50 disabled:pointer-events-none dark:text-red-400 dark:border-red-950/40 dark:bg-red-950/10 dark:hover:bg-red-950/20"
    >
      {isPending ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <Trash2 size={15} />
      )}
      Cancel Order
    </button>
  );
}