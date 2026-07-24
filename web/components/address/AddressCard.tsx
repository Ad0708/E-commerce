// "use client";

// import {
//   CheckCircle2,
//   MapPin,
//   Phone,
//   User,
//   Pencil,
//   Trash2,
//   Star,
// } from "lucide-react";

// import clsx from "clsx";

// import { Address } from "@/types/address";
// import { useDeleteAddress, useSetDefaultAddress } from "@/hooks/address/useAddress";

// interface AddressCardProps {
//   address: Address;
//   selected: boolean;
//   onSelect: () => void;
//   onEdit?: (address: Address) => void;
// }

// export default function AddressCard({
//   address,
//   selected,
//   onSelect,
//   onEdit,
// }: AddressCardProps) {
//   const { mutate: deleteAddress, isPending: deleting } = useDeleteAddress();

//   const { mutate: setDefault, isPending: settingDefault } =
//     useSetDefaultAddress();

//   const handleDelete = (e: React.MouseEvent) => {
//     e.stopPropagation();

//     if (!window.confirm("Are you sure you want to delete this address?")) {
//       return;
//     }

//     deleteAddress(address._id);
//   };

//   const handleSetDefault = (e: React.MouseEvent) => {
//     e.stopPropagation();

//     setDefault(address._id);
//   };

//   return (
//     <div
//       onClick={onSelect}
//       className={clsx(
//         "group cursor-pointer rounded-2xl border p-5 transition-all duration-300",
//         selected
//           ? "border-blue-600 bg-blue-50 shadow-md dark:border-blue-500 dark:bg-blue-950/30"
//           : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-900",
//       )}
//     >
//       {/* Header */}

//       <div className="mb-4 flex items-start justify-between">
//         <div className="flex items-center gap-3">
//           <div
//             className={clsx(
//               "flex h-10 w-10 items-center justify-center rounded-full",
//               selected
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-300",
//             )}
//           >
//             <User size={18} />
//           </div>

//           <div>
//             <h3 className="font-semibold text-gray-900 dark:text-white">
//               {address.fullName}
//             </h3>

//             <p className="text-xs text-gray-500">Shipping Address</p>
//           </div>
//         </div>

//         {selected && <CheckCircle2 size={24} className="text-blue-600" />}
//       </div>

//       {/* Phone */}

//       <div className="mb-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
//         <Phone size={16} />
//         {address.phone}
//       </div>

//       {/* Address */}

//       <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
//         <MapPin size={16} className="mt-0.5 shrink-0" />

//         <div>
//           <p>{address.address1}</p>

//           {address.address2 && <p>{address.address2}</p>}

//           <p>
//             {address.city}, {address.state}
//           </p>

//           <p>
//             {address.country} - {address.pincode}
//           </p>
//         </div>
//       </div>

//       {/* Footer */}

//       <div className="mt-6 flex flex-wrap gap-2">
//         {/* <button
//           type="button"
//           onClick={(e) => {
//             e.stopPropagation();
//             onSelect();
//           }}
//           className={clsx(
//             "rounded-lg px-4 py-2 text-sm font-medium transition",
//             selected
//               ? "bg-blue-600 text-white"
//               : "border border-gray-300 hover:bg-gray-100 dark:border-zinc-600 dark:hover:bg-zinc-800",
//           )}
//         >
//           {selected ? "Selected" : "Deliver Here"}
//         </button> */}

//         <button
//           type="button"
//           onClick={handleSetDefault}
//           disabled={settingDefault}
//           className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm transition hover:bg-yellow-50"
//         >
//           <Star size={15} />
//           Default
//         </button>

//         {onEdit && (
//           <button
//             type="button"
//             onClick={(e) => {
//               e.stopPropagation();
//               onEdit(address);
//             }}
//             className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm transition hover:bg-gray-100"
//           >
//             <Pencil size={15} />
//             Edit
//           </button>
//         )}

//         <button
//           type="button"
//           onClick={handleDelete}
//           disabled={deleting}
//           className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
//         >
//           <Trash2 size={15} />
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import {
  CheckCircle2,
  MapPin,
  Phone,
  User,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";

import clsx from "clsx";

import { Address } from "@/types/address";
import { useDeleteAddress, useSetDefaultAddress } from "@/hooks/address/useAddress";

interface AddressCardProps {
  key?: string;
  address: Address & { isDefault?: boolean }; // Added optional isDefault condition safely
  selected?: boolean;
  onSelect?: () => void;
  onEdit?: (address: Address) => void;
}

export default function AddressCard({
  address,
  selected,
  onSelect,
  onEdit,
}: AddressCardProps) {
  const { mutate: deleteAddress, isPending: deleting } = useDeleteAddress();
  const { mutate: setDefault, isPending: settingDefault } = useSetDefaultAddress();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }
    deleteAddress(address._id);
  };

  const handleSetDefault = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDefault(address._id);
  };

  return (
    <div
      onClick={onSelect}
      className={clsx(
        "group relative cursor-pointer rounded-2xl border p-5 transition-all duration-300 ease-out",
        selected
          ? "border-blue-600 bg-gradient-to-br from-blue-50/60 to-white shadow-md ring-1 ring-blue-600 dark:border-blue-500 dark:from-blue-950/20 dark:to-zinc-900"
          : "border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700",
      )}
    >
      {/* Top Badges / Indicators */}
      <div className="absolute right-4 top-4 flex items-center gap-2">
        {address.isDefault && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20">
            <Star size={12} className="fill-amber-400 text-amber-500 dark:fill-amber-400" />
            Default
          </span>
        )}
        {selected && (
          <CheckCircle2 size={20} className="text-blue-600 dark:text-blue-500 animate-in fade-in zoom-in-75 duration-200" />
        )}
      </div>

      {/* Header */}
      <div className="mb-4 flex items-start justify-between pr-20">
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300",
              selected
                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
            )}
          >
            <User size={18} />
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {address.fullName}
            </h3>
            <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
              Shipping Address
            </p>
          </div>
        </div>
      </div>

      {/* Contact & Address Details */}
      <div className="space-y-2.5 pl-1">
        <div className="flex items-center gap-2.5 text-sm text-zinc-600 dark:text-zinc-300 font-medium">
          <Phone size={15} className="text-zinc-400 dark:text-zinc-500" />
          {address.phone}
        </div>

        <div className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <MapPin size={15} className="mt-1 shrink-0 text-zinc-400 dark:text-zinc-500" />
          <div>
            <p className="font-normal text-zinc-800 dark:text-zinc-200">{address.address1}</p>
            {address.address2 && <p className="text-zinc-500 dark:text-zinc-400">{address.address2}</p>}
            <p className="text-zinc-500 dark:text-zinc-400">
              {address.city}, {address.state}
            </p>
            <p className="text-xs font-semibold tracking-wide text-zinc-400 dark:text-zinc-500 mt-0.5">
              {address.country.toUpperCase()} — {address.pincode}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/60">
        <div className="flex items-center gap-1">
          {/* Condition: Only show "Set Default" action if it is NOT currently the default address */}
          {!address.isDefault && (
            <button
              type="button"
              onClick={handleSetDefault}
              disabled={settingDefault}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <Star size={13} />
              Set Default
            </button>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(address);
              }}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <Pencil size={13} />
              Edit
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  );
}