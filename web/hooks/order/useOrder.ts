"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "@/api/order";
import { CreateOrderPayload } from "@/types/order";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const useCreateOrder = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateOrderPayload) => createOrder(data),

    onSuccess: (response, variables) => {
      toast.success("Order created successfully");

      const orderId = response.order._id;

      switch (variables.paymentMethod) {
        case "STRIPE":
          router.push(`/checkout/payment/stripe/${orderId}`);
          return;

        case "RAZORPAY":
          router.push(`/checkout/payment/razorpay/${orderId}`);
          return;

        case "COD":
        default:
          router.replace(`/orders/${orderId}`);
          return;
      }
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create order");
    },
  });
};

export const useMyOrders = () => {
  return useQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
  });
};

export const useOrderDetails = (orderId: string) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-orders"],
      });
    },
  });
};
