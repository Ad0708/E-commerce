export interface CreateOrderPayload {
  addressId: string;
  paymentMethod: PaymentMethod;
  marketing?: MarketingPayload;
}
export interface MarketingPayload {
  source: string;
  medium: string;
  campaign: string;
  referrer: string;
}

export type PaymentMethod = "COD" | "STRIPE" | "RAZORPAY";
export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  category: string;
  price: number;
  discountPrice?: number | null;
  quantity: number;
}

export interface ShippingAddressType {
  fullName: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface PaymentDetailsType {
  gateway: "COD" | "RAZORPAY" | "STRIPE";
  method: "COD" | "RAZORPAY" | "STRIPE";
  status: "Pending" | "Paid" | "Failed" | "Refunded";
  transactionId?: string;
}

export interface OrderSummaryType {
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
  couponDiscount: number;
  savings: number;
  deliveryCharge: number;
}
export type OrderStatusType =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Out For Delivery"
  | "Delivered"
  | "Cancelled";

export type InvoiceType = {
  invoiceNumber: string;
  issuedAt: string;
};

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  invoice: InvoiceType;
  shippingAddress: ShippingAddressType;
  payment: PaymentDetailsType;
  summary: OrderSummaryType;
  status: OrderStatusType;
  createdAt: string;
  updatedAt: string;
}
