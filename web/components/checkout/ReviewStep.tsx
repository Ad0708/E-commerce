"use client";

import { useCreateOrder } from "@/hooks/order/useOrder";
import { getMarketingData } from "@/lib/utils/marketing";
import { Address } from "@/types/address";
import { PaymentMethod } from "@/types/order";
import CartReview from "./CartReview";
import OrderSummary from "./OrderSummary";

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
    <div className="grid items-start gap-4 lg:grid-cols-12">
      {/* Left Column: Address, Payment, Cart */}
      <div className="flex flex-col gap-4 lg:col-span-7 xl:col-span-8">
        
        {/* Top Row: Address and Payment */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Address */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/50">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">Shipping Address</h2>
            </div>
            {address ? (
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p className="font-medium text-gray-900 dark:text-white">{address.fullName}</p>
                <p>{address.phone}</p>
                <p>
                  {address.address1}
                  {address.address2 ? `, ${address.address2}` : ""}
                </p>
                <p>
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <p>{address.country}</p>
              </div>
            ) : (
              <p className="text-sm text-red-500">No address selected.</p>
            )}
          </div>

          {/* Payment */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-zinc-800/80 dark:bg-zinc-900/50">
            <h2 className="mb-3 text-base font-semibold">Payment Method</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="capitalize">{paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Products */}
        <CartReview />
      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:col-span-5 xl:col-span-4">
        <OrderSummary
          onPlaceOrder={() => {
            handleSubmit();
          }}
          loading={isPending}
        />
      </div>
    </div>
  );
}
