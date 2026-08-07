import { create } from "zustand";
import { AppliedCoupon, Cart, CartItem, CartSummary } from "@/types/cart";

interface CartState {
  cart: Cart | null;
  items: CartItem[];
  appliedCoupon?: AppliedCoupon | null;

  summary: CartSummary;

  isOpen: boolean;
  loading: boolean;

  setCart: (cart: Cart) => void;
  setItems: (items: CartItem[]) => void;
  setLoading: (loading: boolean) => void;


  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // getSummary: () => CartSummary;
  getItemCount: () => number;
  isInCart: (productId: string) => boolean;
  getItem: (productId: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  items: [],
  appliedCoupon: null,
  summary: {
    subtotal: 0,
    discount: 0,
    couponDiscount: 0,
    total: 0,
    itemCount: 0,
    savings: 0,
    deliveryCharge: 0
  },

  isOpen: false,
  loading: false,

  setCart: (cart) =>
    set({
      cart,
      items: cart.items ?? [],
      summary: cart.summary,
      appliedCoupon: cart.appliedCoupon ?? null
    }),

  setItems: (items) => set({ items }),

  setLoading: (loading) => set({ loading }),

  addItem: (newItem) =>
    set((state) => ({
      items: [...state.items, newItem],
    })),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
      // coupon can become invalid after cart change
      appliedCoupon: null,
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
      appliedCoupon: null,
    })),

  clearCart: () =>
    set({
      cart: null,
      items: [],
      appliedCoupon: null,
    }),

  openCart: () => set({ isOpen: true }),

  closeCart: () => set({ isOpen: false }),

  toggleCart: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),


  // getSummary: () => {
  //   const { cart } = get();

  //   return (
  //     cart?.summary ?? {
  //       subtotal: 0,
  //       discount: 0,
  //       couponDiscount: 0,
  //       total: 0,
  //       itemCount: 0,
  //       savings: 0,
  //     }
  //   );
  // },
  getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  isInCart: (productId) =>
    get().items.some((item) => item.productId === productId),

  getItem: (productId) =>
    get().items.find((item) => item.productId === productId),
}));

