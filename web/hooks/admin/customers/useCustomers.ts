"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  blockCustomer,
  getCustomerById,
  getCustomers,
  GetCustomersParams,
  unblockCustomer,
  updateCustomer,
  UpdateCustomerPayload,
} from "@/api/admin/customer";

export const useCustomers = (params: GetCustomersParams) => {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => getCustomers(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useCustomer = (customerId: string) => {
  return useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomerById(customerId),
    enabled: !!customerId,
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCustomerPayload) =>
      updateCustomer(payload),

    onSuccess: (data, variables) => {
      toast.success(data.message || "Customer updated successfully.");

      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["customer", variables.customerId],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update customer."
      );
    },
  });
};

export const useBlockCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId: string) =>
      blockCustomer(customerId),

    onSuccess: (data) => {
      toast.success(data.message || "Customer blocked.");

      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["customer"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to block customer."
      );
    },
  });
};

export const useUnblockCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId: string) =>
      unblockCustomer(customerId),

    onSuccess: (data) => {
      toast.success(data.message || "Customer unblocked.");

      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["customer"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to unblock customer."
      );
    },
  });
};