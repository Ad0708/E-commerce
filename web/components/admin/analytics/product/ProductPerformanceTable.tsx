import { ProductAnalytics as IProductAnalytics } from "@/types/analytics/products";
import Image from "next/image";

export interface TableProductItem extends Omit<IProductAnalytics, "status"> {
  status: "draft" | "active" | "out_of_stock" | "deleted" | string;
}

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export function ProductPerformanceTable({
  listing,
}: {
  listing: TableProductItem[];
}) {
  return (
    <div className="relative overflow-x-auto max-h-105 overflow-y-auto">
      <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
        <thead className="sticky top-0 z-10 bg-slate-50 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th scope="col" className="px-6 py-3">
              Product
            </th>
            <th scope="col" className="px-6 py-3">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Units Sold
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Orders
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Revenue
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Stock Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {listing.map((product) => (
            <tr
              key={product._id}
              className="bg-white transition-colors hover:bg-slate-50/70 dark:bg-slate-900 dark:hover:bg-slate-800/50"
            >
              {/* Product */}
              <td className="whitespace-nowrap px-6 py-2 font-medium text-slate-900 dark:text-slate-100">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <span className="max-w-40 truncate text-sm font-semibold">
                    {product.name}
                  </span>
                </div>
              </td>

              {/* Category */}
              <td className="whitespace-nowrap px-6 py-2">
                <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {product.category}
                </span>
              </td>

              {/* Units Sold */}
              <td className="whitespace-nowrap px-6 py-2 text-right font-medium text-slate-900 dark:text-slate-100">
                {product.unitsSold.toLocaleString("en-IN")}
              </td>

              {/* Orders */}
              <td className="whitespace-nowrap px-6 py-2 text-right">
                {product.orders.toLocaleString("en-IN")}
              </td>

              {/* Revenue */}
              <td className="whitespace-nowrap px-6 py-2 text-right font-semibold text-slate-900 dark:text-slate-50">
                {formatINR(product.revenue)}
              </td>

              {/* Stock */}
              <td className="whitespace-nowrap px-6 py-2 text-center">
                <StockBadge stock={product.stock} status={product.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StockBadge({ stock, status }: { stock: number; status: string }) {
  if (stock === 0 || status === "out_of_stock") {
    return (
      <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
        Out of stock
      </span>
    );
  }
  if (stock <= 15) {
    return (
      <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
        {stock} Low Stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
      {stock} In Stock
    </span>
  );
}

export function TableSkeletonHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2">
          <div className="h-4 w-36 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-56 rounded bg-slate-100 dark:bg-slate-800/60" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-8 w-full rounded bg-slate-100 dark:bg-slate-800/50" />
        <div className="h-12 w-full rounded bg-slate-50 dark:bg-slate-800/20" />
      </div>
    </div>
  );
}
