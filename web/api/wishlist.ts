import api from "@/lib/axios/axios";

export const getWishlist = async () => {
  const { data } = await api.get("/wishlist");
  return data.wishlist;
};

export const addToWishlist = async (productId: string) => {
  const { data } = await api.post(`/wishlist/${productId}`);
  return data;
};

export const removeFromWishlist = async (productId: string) => {
  const { data } = await api.delete(`/wishlist/${productId}`);
  return data;
};

export const checkWishlist = async (productId: string) => {
  const { data } = await api.get(`/wishlist/check/${productId}`);
  return data;
};