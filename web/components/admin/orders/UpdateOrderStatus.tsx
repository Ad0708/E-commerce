"use client";

import { useState } from "react";
import { useUpdateOrderStatus } from "@/hooks/adminorders/useAdminOrders";
import { Order, OrderStatusType } from "@/types/order";
import { AlertCircle, Loader2, X } from "lucide-react";

interface UpdateOrderStatusProps {
  order: Order | null;
  onClose: () => void;
}

const AVAILABLE_STATUSES: OrderStatusType[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

export default function UpdateOrderStatus({
  order,
  onClose,
}: UpdateOrderStatusProps) {
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusType | "">(
    order?.status || "",
  );
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!order) return null;

  const isTerminalState =
    order.status === "Delivered" || order.status === "Cancelled";

  const handleApplyClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStatus || selectedStatus === order.status) return;
    setShowConfirmation(true);
  };

  const confirmStatusMutation = () => {
    if (!selectedStatus) return;
    updateStatus(
      { orderId: order._id, status: selectedStatus },
      {
        onSuccess: () => {
          setShowConfirmation(false);
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Modify Status Reference
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-6">
          {isTerminalState ? (
            <div className="flex gap-3 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/60 dark:border-amber-950/40 text-amber-800 dark:text-amber-400 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>
                This tracking configuration is marked as{" "}
                <span className="font-bold">{order.status}</span>. Orders in
                terminal state configurations are locked from state mutation
                updates.
              </p>
            </div>
          ) : !showConfirmation ? (
            <form onSubmit={handleApplyClick} className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Order Number:{" "}
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">
                    #{order.orderNumber}
                  </span>
                </p>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Select Target Operational Stage
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as OrderStatusType)
                  }
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 transition appearance-none cursor-pointer"
                >
                  {AVAILABLE_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status} {status === order.status ? "(Current)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold border rounded-xl text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 transition"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  disabled={selectedStatus === order.status || !selectedStatus}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-sm disabled:opacity-40"
                >
                  Apply Phase Shift
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex gap-3 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-950/40 text-blue-800 dark:text-blue-400 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Confirm Phase Pipeline Update</p>
                  <p className="text-xs text-blue-600/90 dark:text-blue-400/80 mt-1">
                    Are you certain you want to shift the lifecycle of order #
                    {order.orderNumber} from{" "}
                    <span className="font-bold underline">{order.status}</span>{" "}
                    to{" "}
                    <span className="font-bold underline">
                      {selectedStatus}
                    </span>
                    ?
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 text-xs font-semibold border rounded-xl text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={confirmStatusMutation}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-sm disabled:opacity-50"
                >
                  {isPending && <Loader2 size={13} className="animate-spin" />}
                  Confirm Execution
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
