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
      },
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Name</label>

            <input
              {...register("name")}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 outline-none focus:border-violet-500 dark:border-zinc-700 dark:bg-zinc-950"
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>

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
