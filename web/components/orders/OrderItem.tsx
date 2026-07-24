import Image from "next/image";
import { OrderItem as OrderItemType } from "@/types/order";

interface OrderItemProps {
  item: OrderItemType;
}

export default function OrderItem({ item }: OrderItemProps) {
  const activePrice = item.discountPrice ?? item.price;
  const hasDiscount = !!item.discountPrice;

  return (
    <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 border-b last:border-0 border-zinc-100 dark:border-zinc-800/60">
      <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="64px"
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {item.name}
        </h4>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium uppercase tracking-wider">
          {item.category}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Qty:{" "}
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {item.quantity}
          </span>
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          ₹{(activePrice * item.quantity).toFixed(2)}
        </p>
        {hasDiscount && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 line-through mt-0.5">
            ₹{(item.price * item.quantity).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  );
}
