// src/app/checkout/components/PlaceOrderButton.tsx
// Validates the entire checkout, posts the order to the backend, and on success
// clears the cart and redirects to /checkout/success?orderId=...

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCheckoutStore, formatINR } from "@/lib/checkout/store";
import { toast } from "@/hooks/use-toast";
import { Loader2, ShoppingBag } from "lucide-react";

export function PlaceOrderButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    cartItems,
    selectedAddressId,
    selectedDeliveryId,
    selectedPayment,
    coupon,
    computeBreakup,
    setCart,
  } = useCheckoutStore();

  const breakup = computeBreakup();

  const handlePlaceOrder = async () => {
    // 1. client-side validation
    if (!selectedAddressId) {
      toast({ title: "Please select a shipping address", variant: "destructive" });
      return;
    }
    if (!selectedDeliveryId) {
      toast({ title: "Please select a delivery method", variant: "destructive" });
      return;
    }
    if (!selectedPayment) {
      toast({ title: "Please select a payment method", variant: "destructive" });
      return;
    }
    if (cartItems.length === 0) {
      toast({ title: "Your cart is empty", variant: "destructive" });
      return;
    }

    // 2. stock validation (client side; the backend MUST re-validate)
    const outOfStock = cartItems.find((it) => it.quantity > it.stock);
    if (outOfStock) {
      toast({
        title: "Stock issue",
        description: `${outOfStock.name}: only ${outOfStock.stock} left`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // 3. POST order to your Node/Express/MongoDB backend.
      //    Replace the URL + body with your real API contract.
      const res = await fetch("/api/checkout/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((it) => ({
            productId: it.productId,
            name: it.name,
            price: it.price,
            quantity: it.quantity,
            variant: it.variant,
          })),
          addressId: selectedAddressId,
          deliveryMethodId: selectedDeliveryId,
          paymentMethod: selectedPayment,
          coupon: coupon?.code ?? null,
          breakup,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Order failed" }));
        throw new Error(err.message ?? "Order failed");
      }

      const data = (await res.json()) as {
        orderId: string;
        paymentStatus: "PAID" | "PENDING" | "COD";
        estimatedDelivery: string;
      };

      // 4. clear cart after success
      setCart([]);

      // 5. redirect to success page
      const params = new URLSearchParams({
        orderId: data.orderId,
        paymentStatus: data.paymentStatus,
        eta: data.estimatedDelivery,
        total: String(breakup.total),
      });
      router.push(`/checkout/success?${params.toString()}`);
    } catch (e) {
      toast({
        title: "Could not place order",
        description: e instanceof Error ? e.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Button
        size="lg"
        className="w-full text-base h-12"
        onClick={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Placing Order...
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Place Order · {formatINR(breakup.total)}
          </>
        )}
      </Button>
      <p className="text-xs text-center text-muted-foreground">
        By placing this order, you agree to our Terms &amp; Conditions and Privacy Policy.
      </p>
    </div>
  );
}
