import { MapPin, Phone, User } from "lucide-react";
import { ShippingAddressType } from "@/types/order";

interface ShippingAddressProps {
  address: ShippingAddressType;
}

export default function ShippingAddress({ address }: ShippingAddressProps) {
  return (
    <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-4">
      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
        Shipping Address
      </h4>

      <div className="space-y-3 pl-0.5">
        <div className="flex items-center gap-2.5 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
          <User size={15} className="text-zinc-400 dark:text-zinc-500" />
          {address.fullName}
        </div>

        <div className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-300">
          <Phone size={15} className="text-zinc-400 dark:text-zinc-500" />
          {address.phone}
        </div>

        <div className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <MapPin size={15} className="mt-1 shrink-0 text-zinc-400 dark:text-zinc-500" />
          <div>
            <p className="text-zinc-800 dark:text-zinc-200">{address.address1}</p>
            {address.address2 && <p className="text-zinc-500 dark:text-zinc-400">{address.address2}</p>}
            <p className="text-zinc-500 dark:text-zinc-400">
              {address.city}, {address.state}
            </p>
            <p className="text-xs font-semibold tracking-wide text-zinc-400 dark:text-zinc-500 mt-1 uppercase">
              {address.country} — {address.pincode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}