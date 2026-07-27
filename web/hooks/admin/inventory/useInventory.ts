import { fetchInventory, updateStock } from "@/api/admin/inventory";
import { UseInventoryParams } from "@/types/inventory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useInventory = (params: UseInventoryParams = {}) => {
  return useQuery({
    queryKey: ["inventory", params],
    queryFn: () => fetchInventory(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStock,
    onMutate: async ({ productId, stock }) => {
      await queryClient.cancelQueries({ queryKey: ["inventory"] });

      const previousData = queryClient.getQueriesData({
        queryKey: ["inventory"],
      });

      queryClient.setQueriesData({ queryKey: ["inventory"] }, (old: any) => {
        if (!old?.products) return old;
        return {
          ...old,
          products: old.products.map((p: any) =>
            p._id === productId ? { ...p, stock } : p,
          ),
        };
      });

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

    onSettled: (data) => {
      toast.success(data?.message || "Stock updated successfully.");
      // Always re-sync with server after mutation
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      // Also invalidate products list if you have one
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
