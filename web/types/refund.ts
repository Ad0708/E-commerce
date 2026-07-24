export interface RefundOrder {
  orderNumber: string;
}

export interface RefundUser {
  name: string;
  email: string;
}

export interface Refund {
  _id: string;
  orderId: RefundOrder;
  userId: RefundUser;
  amount: number;
  refundMethod: string;
  status: "REQUESTED" | "APPROVED" | "REJECTED" | string;
}