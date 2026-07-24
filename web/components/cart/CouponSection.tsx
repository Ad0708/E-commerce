"use client";

import { useInfiniteCoupons } from "@/hooks/coupon/useCoupon";

export default function CouponSection() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCoupons({
      limit: 10,
      status: "active",
    });

  const coupons = data?.pages.flatMap((page) => page.coupons) ?? [];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Available Coupons</h3>

      {coupons.map((coupon) => (
        <div
          key={coupon._id}
          className="
          border rounded-xl p-4
          flex justify-between items-center
          "
        >
          <div>
            <p className="font-bold">{coupon.code}</p>

            <p className="text-sm text-gray-500">
              {coupon.type === "percentage"
                ? `${coupon.value}% OFF`
                : `₹${coupon.value} OFF`}
            </p>
          </div>

          <button
            className="
            px-4 py-2 rounded-lg
            bg-black text-white
            "
          >
            Apply
          </button>
        </div>
      ))}

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="text-sm"
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
