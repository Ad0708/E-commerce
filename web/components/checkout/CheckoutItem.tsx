"use client";

import type { CartItem } from "@/types/cart";
import Image from "next/image";

export function CheckoutItem({ item }: { item: CartItem }) {
  const lineTotal = item.price * item.quantity;
  const lowStock = item.stock <= 5;

  return (
    <div className="flex gap-3 py-3">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted p-2">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="80px"
          className="object-contain"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <h4 className="font-medium text-sm leading-tight line-clamp-2">
            {item.name}
          </h4>
          <span className="font-semibold text-sm whitespace-nowrap">
            <p className="font-semibold">
              ₹{lineTotal.toLocaleString("en-IN")}
            </p>
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs text-muted-foreground">
            Qty: {item.quantity}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            ₹{item.price.toLocaleString("en-IN")} each
          </span>
          {lowStock && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              COD
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
