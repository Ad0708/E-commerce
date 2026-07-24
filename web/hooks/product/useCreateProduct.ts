"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createProductApi } from "@/api/product";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProductApi,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(data.message);
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create product");
    },
  });
};
