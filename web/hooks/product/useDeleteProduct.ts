import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@/api/product";
import toast from "react-hot-toast";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(data.message);
    },
  });
};
