export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  stock: number;
  category: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
  summary: CartSummary;
  appliedCoupon?: AppliedCoupon | null;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
  savings: number;
  couponDiscount: number;
  deliveryCharge: number;
}

export interface AppliedCoupon {
  couponId?: string;
  code: string;
  coupon_discount: number;
}