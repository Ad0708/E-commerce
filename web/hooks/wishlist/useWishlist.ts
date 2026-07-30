import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlist,
} from "@/api/wishlist";
import toast from "react-hot-toast";

import { useAuthStore } from "@/store/auth.store";

export const useWishlist = (productId?: string) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  // Wishlist data
  const wishlistQuery = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: !!user,
  });

  // Check if product exists in wishlist
  const checkWishlistQuery = useQuery({
    queryKey: ["wishlist", productId],
    queryFn: () => checkWishlist(productId!),
    enabled: !!productId && !!user,
  });

  // Add to wishlist
  const addWishlist = useMutation({
    mutationFn: addToWishlist,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });

      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  // Remove from wishlist
  const removeWishlist = useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });

      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  return {
    // Wishlist list
    wishlist: wishlistQuery.data,
    wishlistLoading: wishlistQuery.isLoading,
    wishlistError: wishlistQuery.error,

    // Check product
    isWishlisted: checkWishlistQuery.data,
    checkLoading: checkWishlistQuery.isLoading,

    // Mutations
    addToWishlist: addWishlist.mutate,
    addToWishlistAsync: addWishlist.mutateAsync,
    isAdding: addWishlist.isPending,

    removeFromWishlist: removeWishlist.mutate,
    removeFromWishlistAsync: removeWishlist.mutateAsync,
    isRemoving: removeWishlist.isPending,
  };
};
