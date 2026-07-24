// // components/admin/customers/CustomerEditModal.tsx
// 'use client';

// import React, { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { X } from 'lucide-react';

// const editCustomerSchema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Invalid email address'),
// });

// type EditCustomerInput = z.infer<typeof editCustomerSchema>;

// interface CustomerEditModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   customer: { id: string; name: string; email: string } | null;
//   onSave: (id: string, data: EditCustomerInput) => Promise<void>;
// }

// export function CustomerEditModal({ isOpen, onClose, customer, onSave }: CustomerEditModalProps) {
//   const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EditCustomerInput>({
//     resolver: zodResolver(editCustomerSchema)
//   });

//   useEffect(() => {
//     if (customer) {
//       reset({ name: customer.name, email: customer.email });
//     }
//   }, [customer, reset]);

//   if (!isOpen || !customer) return null;

//   const onSubmit = async (data: EditCustomerInput) => {
//     try {
//       await onSave(customer.id, data);
//       onClose();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//       <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
//         <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
//           <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100">Edit Customer</h3>
//           <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300">
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
//           <div>
//             <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Full Name</label>
//             <input
//               type="text"
//               {...register('name')}
//               className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//             />
//             {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
//           </div>

//           <div>
//             <label className="block text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Email Address</label>
//             <input
//               type="email"
//               {...register('email')}
//               className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
//             />
//             {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
//           </div>

//           <div className="flex items-center justify-end gap-3 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl transition-all"
//             >
//               {isSubmitting ? 'Saving...' : 'Save Changes'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Customer } from "@/api/admin/customer";
import { useUpdateCustomer } from "@/hooks/admin/customers/useCustomers";

const schema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Invalid email"),
});

type FormValues = z.infer<typeof schema>;

interface CustomerEditModalProps {
  open: boolean;
  customer: Customer | null;
  onClose: () => void;
}

export default function CustomerEditModal({
  open,
  customer,
  onClose,
}: CustomerEditModalProps) {
  const { mutate, isPending } = useUpdateCustomer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        email: customer.email,
      });
    }
  }, [customer, reset]);

  const onSubmit = (values: FormValues) => {
    if (!customer) return;

    mutate(
      {
        customerId: customer._id,
        ...values,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Edit Customer
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 p-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Name
            </label>

            <input
              {...register("name")}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 outline-none focus:border-violet-500 dark:border-zinc-700 dark:bg-zinc-950"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              {...register("email")}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 outline-none focus:border-violet-500 dark:border-zinc-700 dark:bg-zinc-950"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>

            <button
              disabled={isPending}
              type="submit"
              className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}