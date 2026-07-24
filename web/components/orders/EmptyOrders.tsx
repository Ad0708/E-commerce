import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function EmptyOrders() {
  return (
    <div className="text-center py-16 px-4 max-w-md mx-auto border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/30">
      <div className="inline-flex p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 mb-4">
        <ShoppingBag size={32} />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
        No orders found
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 mb-6">
        Looks like you haven't placed any orders yet. Start exploring our shop today!
      </p>
      <Link
        href="/"
        className="inline-flex justify-center items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition shadow-sm shadow-blue-600/10"
      >
        Continue Shopping
      </Link>
    </div>
  );
}