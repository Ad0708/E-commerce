"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminOrders,
//   getAdminOrderById,
  updateOrderStatus,
  AdminOrderFilters,
} from "@/api/adminorders";
import { OrderStatusType } from "@/types/order";
import toast from "react-hot-toast";

export const useAdminOrders = (filters: AdminOrderFilters) => {
  return useQuery({
    queryKey: ["admin-orders", filters],
    queryFn: () => getAdminOrders(filters),
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: OrderStatusType;
    }) => updateOrderStatus(orderId, status),

    onSuccess: (response, variables) => {
      toast.success(response.message || "Order status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-order", variables.orderId] });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update order status"
      );
    },
  });
};