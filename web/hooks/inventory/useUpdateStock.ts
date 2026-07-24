import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateStockPayload, UpdateStockResponse } from "@/types/inventory";
import api from "@/lib/axios/axios";

const updateStock = async ({
  productId,
  stock,
}: UpdateStockPayload): Promise<UpdateStockResponse> => {
  const { data } = await api.patch<UpdateStockResponse>(
    `/inventory/${productId}/stock`,
    { stock }
  );
  return data;
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStock,

    // Optimistic update — immediately reflect the new stock in the UI
    onMutate: async ({ productId, stock }) => {
      await queryClient.cancelQueries({ queryKey: ["inventory"] });

      const previousData = queryClient.getQueriesData({ queryKey: ["inventory"] });

      queryClient.setQueriesData(
        { queryKey: ["inventory"] },
        (old: any) => {
          if (!old?.products) return old;
          return {
            ...old,
            products: old.products.map((p: any) =>
              p._id === productId ? { ...p, stock } : p
            ),
          };
        }
      );

      return { previousData };
    },

    onError: (_err, _vars, context) => {
      // Roll back on failure
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      // Always re-sync with server after mutation
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      // Also invalidate products list if you have one
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};