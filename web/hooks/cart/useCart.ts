// hooks/cart/useCart.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useCartStore } from "@/store/cart.store";
import { Cart } from "@/types/cart";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  AddToCartPayload,
} from "@/api/cart";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const CART_KEY = ["cart"];

export function useCart() {
  const queryClient = useQueryClient();

  const addItem = useCartStore((s) => s.addItem);
  const setItems = useCartStore((s) => s.setItems);
  const updateQuantityStore = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCartStore = useCartStore((s) => s.clearCart);
  const openCart = useCartStore((s) => s.openCart);
  // ── Query ────────────────────────────────────────────────────────────────────
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");
  const cartQuery = useQuery({
    queryKey: CART_KEY,
    queryFn: getCart,
    staleTime: 1000 * 60 * 2,
    enabled: !isAdminRoute,
  });

  useEffect(() => {
    if (!cartQuery.data) return;

    useCartStore.getState().setCart(cartQuery.data);
  }, [cartQuery.data]);

  // ── Add to cart ──────────────────────────────────────────────────────────────

  const addMutation = useMutation({
    mutationFn: (payload: AddToCartPayload) => addToCart(payload),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: CART_KEY });
      const previous = queryClient.getQueryData<Cart>(CART_KEY);
      addItem({ ...payload, quantity: payload.quantity ?? 1 });
      return { previous };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
      queryClient.setQueryData(CART_KEY, data);
      setItems(data.items);
      openCart();
      toast.success("Added to cart");
    },
    onError: (err: Error, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(CART_KEY, ctx.previous);
      setItems(ctx?.previous?.items ?? []);
      toast.error(err.message);
    },
  });

  // ── Update quantity ──────────────────────────────────────────────────────────

  const updateMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => updateCartItem(productId, quantity),
    onMutate: async ({ productId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_KEY });
      const previous = queryClient.getQueryData<Cart>(CART_KEY);
      updateQuantityStore(productId, quantity);
      return { previous };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
      queryClient.setQueryData(CART_KEY, data);
      setItems(data.items);
    },
    onError: (err: Error, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(CART_KEY, ctx.previous);
      setItems(ctx?.previous?.items ?? []);
      toast.error(err.message);
    },
  });

  // ── Remove item ──────────────────────────────────────────────────────────────

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeCartItem(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: CART_KEY });
      const previous = queryClient.getQueryData<Cart>(CART_KEY);
      removeItem(productId);
      return { previous };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(CART_KEY, data);
      queryClient.invalidateQueries({ queryKey: CART_KEY });
      setItems(data.items);
      toast.success("Removed from cart");
    },
    onError: (err: Error, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(CART_KEY, ctx.previous);
      setItems(ctx?.previous?.items ?? []);
      toast.error(err.message);
    },
  });

  // ── Clear cart ───────────────────────────────────────────────────────────────

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: CART_KEY });
      const previous = queryClient.getQueryData<Cart>(CART_KEY);
      clearCart();
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_KEY });
      queryClient.setQueryData(CART_KEY, { items: [] });
      toast.success("Cart cleared");
    },
    onError: (err: Error, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(CART_KEY, ctx.previous);
      setItems(ctx?.previous?.items ?? []);
      toast.error(err.message);
    },
  });

  // ── Expose everything ────────────────────────────────────────────────────────

  return {
    // query state
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    error: cartQuery.error,

    // mutations
    addToCart: addMutation.mutate,
    updateQuantity: updateMutation.mutate,
    removeFromCart: removeMutation.mutate,
    clearCart: clearMutation.mutate,

    // pending states per action
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isRemoving: removeMutation.isPending,
    isClearing: clearMutation.isPending,
  };
}
