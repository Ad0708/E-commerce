"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateProductApi } from "@/api/product";
import { Product } from "@/types/product"; // Adjust import path if needed

export interface UpdateProductPayload {
  id: string;
  data: FormData | Partial<Product> | Record<string, any>;
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateProductPayload) =>
      updateProductApi({ id, data }),

    onSuccess: () => {
      toast.success("Product updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update product");
    },
  });
};
// "use client";

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import toast from "react-hot-toast";
// import { updateProductApi } from "@/api/product";

// export const useUpdateProduct = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: updateProductApi,

//     onSuccess: () => {
//       toast.success("Product updated successfully");

//       queryClient.invalidateQueries({
//         queryKey: ["products"],
//       });
//     },

//     onError: (error: any) => {
//       toast.error(error?.response?.data?.message || "Failed to update product");
//     },
//   });
// };
