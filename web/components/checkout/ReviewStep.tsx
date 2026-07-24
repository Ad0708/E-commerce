"use client";

import { Address } from "@/types/address";
import CartReview from "./CartReview";
import OrderSummary from "./OrderSummary";
import { useCreateOrder } from "@/hooks/order/useOrder";
import { PaymentMethod } from "@/types/order";
import { getMarketingData } from "@/lib/utils/marketing";

interface ReviewStepProps {
  address: Address | null;
  paymentMethod: PaymentMethod;
}

export default function ReviewStep({
  address,
  paymentMethod,
}: ReviewStepProps) {
  const { mutate: placeOrder, isPending } = useCreateOrder();

  const marketing = getMarketingData();

  const handleSubmit = () => {
    placeOrder({
      addressId: address?._id as string,
      paymentMethod,
      marketing: marketing
        ? {
            source: marketing.source,
            medium: marketing.medium,
            campaign: marketing.campaign,
            referrer: marketing.referrer,
          }
        : undefined,
    });
  };

  return (
    <div className="space-y-8">
      {/* Address */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>

        {address ? (
          <div className="space-y-2">
            <p className="font-semibold">{address.fullName}</p>

            <p>{address.phone}</p>

            <p>{address.address1}</p>

            {address.address2 && <p>{address.address2}</p>}

            <p>
              {address.city}, {address.state}
            </p>

            <p>
              {address.country} - {address.pincode}
            </p>
          </div>
        ) : (
          <p className="text-red-500">No address selected.</p>
        )}
      </div>

      {/* Payment */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>

        <p className="capitalize">{paymentMethod}</p>
      </div>

      {/* Products */}

      <CartReview />

      {/* Summary */}

      <OrderSummary
        onPlaceOrder={() => {
          handleSubmit();
        }}
        loading={isPending}
      />
    </div>
  );
}
