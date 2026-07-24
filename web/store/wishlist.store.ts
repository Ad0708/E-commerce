import { create } from "zustand";
import { Wishlist } from "@/types/wishlist";

interface WishlistState {
  wishlist: Wishlist[];

  setWishlist: (wishlist: Wishlist[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  wishlist: [],
  loading: false,

  setWishlist: (wishlist) =>
    set({
      wishlist,
    }),
  setLoading: (loading) =>
    set({
      loading,
    }),

  clearWishlist: () =>
    set({
      wishlist: [],
      loading: false,
    }),
}));
