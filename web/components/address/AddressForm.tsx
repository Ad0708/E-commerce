"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  addressSchema,
  AddressFormValues,
} from "@/lib/validators/address.schema";

import { useCreateAddress, useUpdateAddress } from "@/hooks/address/useAddress";
import { useEffect } from "react";
import { Address } from "@/types/address";

interface AddressFormProps {
  address?: Address | null;
  onClose: () => void;
}
export default function AddressForm({ address, onClose }: AddressFormProps) {
  const { mutateAsync: createAddress, isPending } = useCreateAddress();
  const { mutateAsync: updateAddress } = useUpdateAddress();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
    },
  });

  useEffect(() => {
    if (address) {
      reset(address);
    } else {
      reset({
        fullName: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
      });
    }
  }, [address, reset]);

  const onSubmit = async (data: AddressFormValues) => {
    try {
      if (address) {
        await updateAddress({
          addressId: address._id,
          payload: data,
        });
      } else {
        await createAddress(data);
      }

      reset();

      onClose();
    } catch (error) {
      console.error(error);
    }
  };
  // const onSubmit = async (data: AddressFormValues) => {
  //   try {
  //     await createAddress(data);

  //     reset();
  //   } catch (error) {
  //     console.error("Failed to create address", error);
  //   }
  // };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Personal Details */}

      <div>
        <h3 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
          Personal Details
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">Full Name</label>

            <input
              {...register("fullName")}
              placeholder="John Doe"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
            />

            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone Number
            </label>

            <input
              {...register("phone")}
              placeholder="9876543210"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Address Details */}

      <div>
        <h3 className="mb-5 text-lg font-semibold text-gray-900 dark:text-white">
          Address Details
        </h3>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Address Line 1
            </label>

            <input
              {...register("address1")}
              placeholder="House No, Street Name"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
            />

            {errors.address1 && (
              <p className="mt-1 text-sm text-red-500">
                {errors.address1.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Address Line 2
            </label>

            <input
              {...register("address2")}
              placeholder="Apartment, Landmark (Optional)"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
            />

            {errors.address2 && (
              <p className="mt-1 text-sm text-red-500">
                {errors.address2.message}
              </p>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">City</label>

              <input
                {...register("city")}
                placeholder="Mumbai"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
              />

              {errors.city && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.city.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">State</label>

              <input
                {...register("state")}
                placeholder="Maharashtra"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
              />

              {errors.state && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.state.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Country</label>

              <input
                {...register("country")}
                placeholder="India"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
              />

              {errors.country && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.country.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Pincode</label>

              <input
                {...register("pincode")}
                placeholder="400001"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-600 dark:border-zinc-700 dark:bg-zinc-900"
              />

              {errors.pincode && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.pincode.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-gray-200 pt-6 dark:border-zinc-700">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Saving..."
            : address
              ? "Update Address"
              : "Save Address"}
        </button>
      </div>
    </form>
  );
}
