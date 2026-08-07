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
        <h2 className="text-3xl font-extrabold text-foreground font-heading">
          Shipping Address
        </h2>

        <p className="mt-2 text-base font-medium text-secondary">
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
            className="flex items-center gap-2 rounded-xl border border-dashed border-[var(--accent-start)] px-5 py-3 text-sm font-bold uppercase tracking-widest text-[var(--accent-start)] transition hover:bg-[var(--accent-start)]/10"
          >
            <Plus size={18} />

            {showForm ? "Hide Address Form" : "Add New Address"}
          </button>
        </>
      )}

      {/* Address Form */}

      {showForm && (
        <div className="rounded-3xl border border-[var(--glass-border)] bg-secondary/5 p-6 md:p-8">
          <div className="mb-6 flex items-center gap-2">
            <MapPin className="text-[var(--accent-start)]" size={24} />

            <h3 className="text-xl font-extrabold font-heading text-foreground">Add New Address</h3>
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
