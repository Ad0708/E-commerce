// api/cartApi.ts
import api from "@/lib/axios/axios";
import { Cart, CartItem } from "@/types/cart";

export type AddToCartPayload = Omit<CartItem, "quantity"> & { quantity?: number };
export type UpdateQuantityPayload = { productId: string; quantity: number };

// GET /api/cart — fetch the current user's cart
export async function getCart(): Promise<Cart> {
  const { data } = await api.get<Cart>("/cart");
  return data;
}

// POST /api/cart — add a product (or increment if already in cart)
export async function addToCart(payload: AddToCartPayload): Promise<Cart> {
  const { data } = await api.post<Cart>("/cart", payload);
  return data;
}

// PATCH /api/cart/:productId — update quantity of one item
export async function updateCartItem(
  productId: string,
  quantity: number
): Promise<Cart> {
  const { data } = await api.patch<Cart>(`/cart/${productId}`, {
    quantity,
  });
  return data;
}

// DELETE /api/cart/:productId — remove one item
export async function removeCartItem(productId: string): Promise<Cart> {
  const { data } = await api.delete<Cart>(`/cart/${productId}`);
  return data;
}

// DELETE /api/cart — wipe the entire cart
export async function clearCart(): Promise<void> {
  await api.delete("/cart");
}