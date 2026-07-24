"use client";

import { categories } from "@/constants/categories";
import { useProductsByIds } from "@/hooks/product/useProductsByIds";
import {
  couponSchema,
  type CouponFormValues,
} from "@/lib/validators/coupon.schema"; // adjust path
import type { Product } from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FieldError, FieldLabel, inputClass, selectClass } from "./FormField";
import { ProductSelectorModal } from "./ProductSelectorModal";
import { SelectedProducts } from "./SelectedProducts";

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {description}
          </p>
        )}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  type = "button",
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    primary:
      "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white focus-visible:ring-blue-500",
    ghost:
      "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:ring-gray-400",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── Props ────────────────────────────────────────────────────────────────────

export type CouponFormProps = {
  defaultValues?: Partial<CouponFormValues>;
  onSubmit: (data: CouponFormValues) => void;
  loading?: boolean;
  isEdit?: boolean;
  onCancel?: () => void;
};

// ─── Predefined categories (replace with your own API/enum if needed) ─────────

const CATEGORY_OPTIONS = categories.map((category) => category.value);

// ─── Main Component ───────────────────────────────────────────────────────────

export function CouponForm({
  defaultValues,
  onSubmit,
  loading = false,
  isEdit = false,
  onCancel,
}: CouponFormProps) {
  // ── Modal state ─────────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);

  // ── Form ────────────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      description: "",
      type: "percentage",
      value: 0,
      minimumOrderAmount: undefined,
      maximumDiscount: undefined,
      usageLimit: undefined,
      appliesTo: "all",
      products: defaultValues?.products ?? [],
      categories: defaultValues?.categories ?? [],
      startDate: "",
      expiryDate: "",
      status: "active",
      ...defaultValues,
    },
  });

  // console.log(errors);
  const discountType = watch("type");
  const value = watch("value");

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setValue("value", value, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [discountType, setValue]);
  const appliesTo = watch("appliesTo");
  const selectedProductIds = watch("products") ?? [];
  const selectedCategories = watch("categories") ?? [];

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);
  // ── Handlers ────────────────────────────────────────────────────────────────

  const { data: products = [] } = useProductsByIds(selectedProductIds);

  const handleProductSave = (products: Product[]) => {
    setValue(
      "products",
      products.map((p) => p._id),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const handleRemoveProduct = (productId: string) => {
    setValue(
      "products",
      selectedProductIds.filter((id) => id !== productId),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const toggleCategory = (category: string) => {
    const current = selectedCategories ?? [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    setValue("categories", updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // ── Today's date for min constraint ─────────────────────────────────────────
  const todayStr = new Date().toISOString().split("T")[0];

  // ── Submit ──────────────────────────────────────────────────────────────────
  const onFormSubmit = handleSubmit(onSubmit);

  return (
    <>
      <div className="">
        <form onSubmit={onFormSubmit} noValidate>
          <div className="space-y-5 ">
            {/* ── 1. Coupon Details ─────────────────────────────────────────── */}
            <FormSection
              title="Coupon Details"
              description="Set the coupon code, type, and a short description."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Coupon Code */}
                <div>
                  <FieldLabel htmlFor="code" required>
                    Coupon Code
                  </FieldLabel>
                  <input
                    id="code"
                    type="text"
                    placeholder="e.g. SUMMER20"
                    autoComplete="off"
                    {...register("code", {
                      setValueAs: (v: string) => v.toUpperCase().trim(),
                    })}
                    className={inputClass(!!errors.code)}
                  />
                  <FieldError message={errors.code?.message} />
                </div>

                {/* Discount Type */}
                <div>
                  <FieldLabel htmlFor="type" required>
                    Discount Type
                  </FieldLabel>
                  <div className="relative">
                    <select
                      id="type"
                      {...register("type")}
                      className={selectClass(!!errors.type)}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <FieldError message={errors.type?.message} />
                </div>
              </div>

              {/* Description – full width */}
              <div className="mt-4">
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Optional: describe what this coupon is for…"
                  {...register("description")}
                  className={`${inputClass(!!errors.description)} resize-none`}
                />
                <FieldError message={errors.description?.message} />
              </div>
            </FormSection>

            {/* ── 2. Discount Details ───────────────────────────────────────── */}
            <FormSection
              title="Discount Details"
              description="Configure the discount value, usage limits, and order thresholds."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Discount Value */}
                <div>
                  <FieldLabel htmlFor="value" required>
                    Discount Value{" "}
                    <span className="font-normal text-gray-400">
                      {discountType === "percentage" ? "(%)" : "()"}
                    </span>
                  </FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 select-none">
                      {discountType === "percentage" ? "%" : "₹"}
                    </span>
                    <input
                      id="value"
                      type="number"
                      min={0}
                      max={discountType === "percentage" ? 100 : undefined}
                      step={discountType === "percentage" ? 1 : 0.01}
                      placeholder={
                        discountType === "percentage" ? "e.g. 20" : "e.g. 15.00"
                      }
                      {...register("value", {
                        setValueAs: (v) => (v === "" ? undefined : Number(v)),
                      })}
                      className={`${inputClass(!!errors.value)} pl-8`}
                    />
                  </div>
                  <FieldError message={errors.value?.message} />
                </div>

                {/* Usage Limit */}
                <div>
                  <FieldLabel htmlFor="usageLimit">Usage Limit</FieldLabel>
                  <input
                    id="usageLimit"
                    type="number"
                    min={1}
                    step={1}
                    placeholder="e.g. 100 (leave blank for unlimited)"
                    {...register("usageLimit", { valueAsNumber: true })}
                    className={inputClass(!!errors.usageLimit)}
                  />
                  <FieldError message={errors.usageLimit?.message} />
                </div>

                {/* Minimum Order Amount */}
                <div>
                  <FieldLabel htmlFor="minimumOrderAmount">
                    Minimum Order Amount
                  </FieldLabel>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 select-none">
                      ₹
                    </span>
                    <input
                      id="minimumOrderAmount"
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="e.g. 50.00"
                      {...register("minimumOrderAmount", {
                        valueAsNumber: true,
                      })}
                      className={`${inputClass(!!errors.minimumOrderAmount)} pl-8`}
                    />
                  </div>
                  <FieldError message={errors.minimumOrderAmount?.message} />
                </div>

                {/* Maximum Discount – only for percentage */}
                {discountType === "percentage" ? (
                  <div>
                    <FieldLabel htmlFor="maximumDiscount">
                      Maximum Discount Cap
                    </FieldLabel>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 select-none">
                        ₹
                      </span>
                      <input
                        id="maximumDiscount"
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="e.g. 100.00"
                        {...register("maximumDiscount", {
                          setValueAs: (v) => (v === "" ? undefined : Number(v)),
                        })}
                        className={`${inputClass(!!errors.maximumDiscount)} pl-8`}
                      />
                    </div>
                    <FieldError message={errors.maximumDiscount?.message} />
                  </div>
                ) : (
                  /* Placeholder to maintain grid alignment */
                  <div aria-hidden="true" />
                )}
              </div>
            </FormSection>

            {/* ── 3. Applicability ─────────────────────────────────────────── */}
            <FormSection
              title="Applicability"
              description="Choose which products or categories this coupon applies to."
            >
              {/* Applies To – radio group styled as cards */}
              {/* Applies To – radio group styled as cards */}
              <div>
                <FieldLabel required>Applies To</FieldLabel>
                <Controller
                  name="appliesTo"
                  control={control}
                  render={({ field }) => (
                    // FIX: Stack on mobile (grid-cols-1), expand to 3 columns on tablet/desktop (sm:grid-cols-3)
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {(
                        [
                          { value: "all", label: "All Products", icon: "🛒" },
                          {
                            value: "products",
                            label: "Selected Products",
                            icon: "📦",
                          },
                          {
                            value: "categories",
                            label: "Categories",
                            icon: "🏷️",
                          },
                        ] as const
                      ).map((opt) => (
                        <label
                          key={opt.value}
                          className={`
              flex flex-row sm:flex-col items-center gap-3 sm:gap-1.5 p-3 rounded-xl border cursor-pointer
              transition-all duration-150 text-left sm:text-center select-none min-w-0 w-full
              ${
                field.value === opt.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
              }
            `}
                        >
                          <input
                            type="radio"
                            className="sr-only"
                            value={opt.value}
                            checked={field.value === opt.value}
                            onChange={() => {
                              field.onChange(opt.value);
                              // clear the other fields
                              if (opt.value !== "products") {
                                setValue("products", []);
                              }
                              if (opt.value !== "categories") {
                                setValue("categories", []);
                              }
                            }}
                          />
                          <span className="text-xl shrink-0">{opt.icon}</span>
                          <span
                            className={`text-xs font-medium leading-tight truncate ${
                              field.value === opt.value
                                ? "text-blue-700 dark:text-blue-300"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {opt.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                />
                <FieldError message={errors.appliesTo?.message} />
              </div>

              {/* Selected Products panel */}
              {appliesTo === "products" && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-950/60 transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {selectedProductIds.length > 0
                      ? `${selectedProductIds.length} product${selectedProductIds.length !== 1 ? "s" : ""} selected — Edit`
                      : "Select Products"}
                  </button>

                  {/* Chips */}
                  <SelectedProducts
                    products={products}
                    onRemove={handleRemoveProduct}
                  />

                  <FieldError
                    message={
                      (errors.products as { message?: string } | undefined)
                        ?.message
                    }
                  />
                </div>
              )}

              {/* Categories panel */}
              {appliesTo === "categories" && (
                <div className="mt-4">
                  <FieldLabel required>Select Categories</FieldLabel>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORY_OPTIONS.map((cat) => {
                      const active = selectedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`
                          px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-all duration-150
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                          ${
                            active
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
                          }
                        `}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                  <FieldError
                    message={
                      (errors.categories as { message?: string } | undefined)
                        ?.message
                    }
                  />
                </div>
              )}
            </FormSection>

            {/* ── 4. Validity ──────────────────────────────────────────────── */}
            <FormSection
              title="Validity"
              description="Set the active date range and current status of the coupon."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <FieldLabel htmlFor="startDate" required>
                    Start Date
                  </FieldLabel>
                  <input
                    id="startDate"
                    type="date"
                    min={todayStr}
                    {...register("startDate")}
                    className={inputClass(!!errors.startDate)}
                  />
                  <FieldError message={errors.startDate?.message} />
                </div>

                {/* Expiry Date */}
                <div>
                  <FieldLabel htmlFor="expiryDate" required>
                    Expiry Date
                  </FieldLabel>
                  <input
                    id="expiryDate"
                    type="date"
                    min={watch("startDate") || todayStr}
                    {...register("expiryDate")}
                    className={inputClass(!!errors.expiryDate)}
                  />
                  <FieldError message={errors.expiryDate?.message} />
                </div>

                {/* Status */}
                <div>
                  <FieldLabel htmlFor="status" required>
                    Status
                  </FieldLabel>
                  <div className="relative">
                    <select
                      id="status"
                      {...register("status")}
                      className={selectClass(!!errors.status)}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <FieldError message={errors.status?.message} />

                  {/* Status hint */}
                  <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                    {watch("status") === "scheduled"
                      ? "Coupon will activate automatically on the start date."
                      : watch("status") === "inactive"
                        ? "Coupon is disabled and cannot be redeemed."
                        : "Coupon is live and can be redeemed immediately."}
                  </p>
                </div>
              </div>
            </FormSection>

            {/* ── 5. Footer ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-end gap-3 pt-1 pb-6">
              {onCancel && (
                <Button variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                loading={loading || isSubmitting}
                disabled={loading || isSubmitting}
              >
                {isEdit ? "Update Coupon" : "Create Coupon"}
              </Button>
            </div>
          </div>
        </form>

        {/* ── Product Selection Modal ──────────────────────────────────────── */}
        <ProductSelectorModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleProductSave}
          initialSelected={products}
        />
      </div>
    </>
  );
}
