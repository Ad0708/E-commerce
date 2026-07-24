"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/auth.store";
import { useProfile, useUpdateProfile } from "@/hooks/profile/useProfile";
import { useAddresses } from "@/hooks/address/useAddress";
import AddressCard from "@/components/address/AddressCard";
import AddressForm from "@/components/address/AddressForm";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Pencil,
  MapPin,
  Plus,
  Loader2,
  X,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { Address } from "@/types/address";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ProfileDates {
  createdAt: string;
  updatedAt: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────
const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
});

type UpdateProfileForm = z.infer<typeof updateProfileSchema>;

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 animate-pulse dark:bg-slate-900 dark:border-slate-800/60">
      <div className="h-5 w-40 bg-gray-200 rounded mb-6 dark:bg-slate-800" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 dark:bg-slate-800" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded dark:bg-slate-800" />
            <div className="h-4 w-48 bg-gray-200 rounded dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 dark:bg-slate-800 dark:text-slate-400">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5 dark:text-slate-400/80">
          {label}
        </p>
        <p className="text-sm text-gray-800 font-medium truncate dark:text-slate-200">
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

// ─── Edit Profile Modal ───────────────────────────────────────────────────────

function EditProfileModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const user = useAuthStore((state) => state.user);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: user?.name ?? "" },
  });

  useEffect(() => {
    if (isOpen && user?.name) reset({ name: user.name });
  }, [isOpen, user?.name, reset]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  const handleClose = () => {
    reset({ name: user?.name ?? "" });
    onClose();
  };

  const onSubmit = (values: UpdateProfileForm) => {
    updateProfile(values, {
      onSuccess: () => {
        reset({ name: values.name });
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm dark:bg-slate-950/60"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden dark:bg-slate-900 dark:border-slate-800 transform transition-all animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Pencil size={15} className="text-violet-500" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">
              Edit Profile
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
          >
            <X size={15} />
          </button>
        </div>

        {/* Modal body */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold select-none shrink-0">
              {user?.name
                ? user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-slate-100">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 truncate dark:text-slate-400">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Name field */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 dark:text-slate-300">
              Full Name
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Enter your name"
              autoFocus
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 dark:focus:ring-violet-500/20 ${
                errors.name
                  ? "border-red-400 bg-red-50 text-red-900 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-200"
                  : "border-gray-200 bg-white text-gray-900 hover:border-gray-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-700"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email — read only */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5 dark:text-slate-300">
              Email Address
              <span className="ml-2 text-gray-400 normal-case font-normal dark:text-slate-400">
                (cannot be changed)
              </span>
            </label>
            <input
              type="email"
              value={user?.email ?? ""}
              readOnly
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400 cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors disabled:opacity-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !isDirty}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors w-full sm:w-auto"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Personal Information Card ────────────────────────────────────────────────
function PersonalInfoCard({
  dates,
  datesLoading,
}: {
  dates: ProfileDates | null;
  datesLoading: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading || !user) return <CardSkeleton rows={4} />;

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800/80">
        <h2 className="text-base font-semibold text-gray-900 mb-5 dark:text-slate-100">
          Personal Information
        </h2>

        {/* Avatar row with Edit button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-lg sm:text-xl font-semibold select-none shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-900 text-base sm:text-lg leading-tight truncate dark:text-slate-100">
                {user.name}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full mt-1.5 dark:bg-violet-950/60 dark:text-violet-300">
                <Shield size={10} />
                {roleLabel}
              </span>
            </div>
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 text-sm font-medium transition-colors shrink-0 w-full sm:w-auto dark:border-violet-900/40 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-950/60"
          >
            <Pencil size={13} />
            Edit Profile
          </button>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow
            icon={<User size={15} />}
            label="Full Name"
            value={user.name}
          />
          <InfoRow
            icon={<Mail size={15} />}
            label="Email Address"
            value={user.email}
          />
          <InfoRow
            icon={<Calendar size={15} />}
            label="Member Since"
            value={
              datesLoading
                ? "Loading…"
                : dates?.createdAt
                  ? format(new Date(dates.createdAt), "MMMM d, yyyy")
                  : "—"
            }
          />
          <InfoRow
            icon={<Calendar size={15} />}
            label="Last Updated"
            value={
              datesLoading
                ? "Loading…"
                : dates?.updatedAt
                  ? format(new Date(dates.updatedAt), "MMMM d, yyyy")
                  : "—"
            }
          />
        </div>
      </div>

      <EditProfileModal isOpen={editOpen} onClose={() => setEditOpen(false)} />
    </>
  );
}

// ─── Addresses Card ───────────────────────────────────────────────────────────
function AddressesCard() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const { data: addresses, isLoading } = useAddresses();

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setEditingAddress(null);
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800/80">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2 min-w-0">
          <MapPin
            size={15}
            className="text-gray-400 shrink-0 dark:text-slate-400"
          />
          <h2 className="text-base font-semibold text-gray-900 truncate dark:text-zinc-100">
            Saved Addresses
          </h2>
          {addresses && addresses.length > 0 && (
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0 dark:bg-slate-800 dark:text-slate-400">
              {addresses.length}
            </span>
          )}
        </div>

        {!showAddForm && (
          <button
            onClick={handleAddAddress}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 text-sm font-medium transition-colors shrink-0 dark:border-violet-900/40 dark:bg-violet-950/40 dark:text-violet-300 dark:hover:bg-violet-950/60"
          >
            <Plus size={14} />
            <span className="hidden xs:inline">Add Address</span>
            <span className="xs:hidden">Add</span>
          </button>
        )}
      </div>

      {/* Add/Edit Address Form container */}
      {showAddForm && (
        <div className="mb-5 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/40">
          <AddressForm address={editingAddress} onClose={handleCloseForm} />
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800/60 flex justify-end">
            <button
              onClick={handleCloseForm}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-500 transition-colors border border-gray-200 rounded-xl hover:bg-gray-100 hover:text-gray-700 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!addresses || addresses.length === 0) && !showAddForm && (
        <div className="flex flex-col items-center justify-center py-10 text-center px-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 dark:bg-slate-800">
            <MapPin size={20} className="text-gray-400 dark:text-slate-500" />
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1 dark:text-slate-300">
            No addresses saved yet
          </p>
          <p className="text-xs text-gray-400 dark:text-slate-400 max-w-xs">
            Add an address to speed up checkout.
          </p>
        </div>
      )}

      {/* Address grid */}
      {!isLoading && addresses && addresses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              selected={false}
              onSelect={() => {}}
              onEdit={handleEditAddress}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [dates, setDates] = useState<ProfileDates | null>(null);
  const [datesLoading, setDatesLoading] = useState(true);
  const { data: profile } = useProfile();

  useEffect(() => {
    if (profile) {
      setDates({ createdAt: profile.createdAt, updatedAt: profile.updatedAt });
      setDatesLoading(false);
    }
  }, [profile]);

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 sm:py-10 px-4 transition-colors duration-200 dark:bg-slate-950">
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
        </div>
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight dark:text-slate-100">
            Your Profile
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 dark:text-slate-400">
            Manage your personal information and saved addresses.
          </p>
        </div>

        <PersonalInfoCard dates={dates} datesLoading={datesLoading} />
        <AddressesCard />
      </div>
    </div>
  );
}
