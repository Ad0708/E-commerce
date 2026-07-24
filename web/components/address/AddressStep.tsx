"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Plus } from "lucide-react";

import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";

import { Address } from "@/types/address";
import { useAddresses } from "@/hooks/address/useAddress";

interface AddressStepProps {
  selectedAddress: Address | null;
  setSelectedAddress: React.Dispatch<React.SetStateAction<Address | null>>;
}

export default function AddressStep({
  selectedAddress,
  setSelectedAddress,
}: AddressStepProps) {
  const [showForm, setShowForm] = useState(false);

  const { data: addresses = [], isLoading, isError } = useAddresses();

  // Auto select first address
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    if (addresses.length > 0) {
      const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

      setSelectedAddress(defaultAddress);
      initialized.current = true;
    }
  }, [addresses, setSelectedAddress]);

  // Show form automatically if no addresses
  useEffect(() => {
    if (addresses.length === 0) {
      setShowForm(true);
    }else {
      setShowForm(false);
    }
  }, [addresses]);

  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  if (isLoading) {
    return <div className="py-16 text-center">Loading addresses...</div>;
  }

  if (isError) {
    return (
      <div className="py-16 text-center text-red-500">
        Failed to load addresses.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Shipping Address
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Choose an existing address or add a new one.
        </p>
      </div>

      {/* Saved Addresses */}

      {addresses.length > 0 && (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                selected={selectedAddress?._id === address._id}
                onSelect={() =>
                  setSelectedAddress((prev) =>
                    prev?._id === address._id ? null : address,
                  )
                }
                onEdit={(address) => {
                  setEditingAddress(address);
                  setShowForm(true);
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => {setEditingAddress(null); setShowForm((prev) => !prev)}}
            className="flex items-center gap-2 rounded-xl border border-dashed border-blue-500 px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-950"
          >
            <Plus size={18} />

            {showForm ? "Hide Address Form" : "Add New Address"}
          </button>
        </>
      )}

      {/* Address Form */}

      {showForm && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-zinc-700 dark:bg-zinc-800">
          <div className="mb-6 flex items-center gap-2">
            <MapPin className="text-blue-600" size={22} />

            <h3 className="text-lg font-semibold">Add New Address</h3>
          </div>

          <AddressForm
            address={editingAddress}
            onClose={() => {
              setShowForm(false);
              setEditingAddress(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
