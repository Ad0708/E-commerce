"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSchema,
  ProductFormValues,
} from "@/lib/validators/product.schema";
import { categories } from "@/constants/categories";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import FormHeader from "@/components/ui/FormHeader";
import FormSection from "@/components/ui/FormSection";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
  initialValues?: Partial<Product>;
  mode: "create" | "edit";
  onSubmit: (data: ProductFormValues) => void;
  loading?: boolean;
}

export default function ProductForm({
  initialValues,
  mode,
  onSubmit,
  loading,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      brand: "",
      description: "",
      price: 0,
      discountPrice: 0,
      stock: 0,
      sku: "",
      status: "draft",
      featured: false,
      images: [],
      ...initialValues,
    },
  });
  // console.log("errors", errors);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const [existingImages, setExistingImages] = useState<string[]>([]);

  console.log("initialValues", initialValues);
  const router = useRouter();
  useEffect(() => {
    if (!initialValues?.images) return;

    setValue("images", initialValues.images); // RHF
    setExistingImages(initialValues.images); // UI
  }, [initialValues]);

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const submitHandler = (data: ProductFormValues) => {
    console.log("FORM SUBMITTED");

    const newImages = selectedImages || [];
    console.log("New Images:", newImages);
    console.log("Existing Images:", existingImages);
    console.log("All Images:", data.images);

    onSubmit(data);
  };

  const handleRemove = (index: number) => {
    const current = watch("images") || [];

    const updated = current.filter((_, i) => i !== index);

    setValue("images", updated, {
      shouldValidate: true,
    });
  };
  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-900";
  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="mx-auto flex max-w-7xl flex-col gap-8"
    >
      <FormHeader
        title={mode === "create" ? "Create Product" : "Edit Product"}
        description="Manage your product information, inventory, pricing, and images before publishing it to your store."
      />
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <FormSection
            title="Basic Information"
            description="General information about your product."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Input label="Product Name" error={errors.name?.message}>
                <input
                  {...register("name")}
                  className={inputClass}
                  placeholder="Enter product name"
                />
              </Input>

              <Input label="Category" error={errors.category?.message}>
                <select {...register("category")} className={inputClass}>
                  <option value="">Select category</option>

                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </Input>

              <div className="md:col-span-2">
                <Input label="Brand">
                  <input
                    {...register("brand")}
                    className={inputClass}
                    placeholder="Brand name"
                  />
                </Input>
              </div>
            </div>
          </FormSection>

          {/* PRICING */}
          <FormSection
            title="Pricing"
            description="Configure selling and discounted prices."
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Input label="Price" error={errors.price?.message}>
                <input
                  type="number"
                  {...register("price", {
                    valueAsNumber: true,
                  })}
                  className={inputClass}
                />
              </Input>

              <Input label="Discount Price" error={errors.discountPrice?.message}>
                <input
                  type="number"
                  {...register("discountPrice", {
                    valueAsNumber: true,
                  })}
                  className={inputClass}
                />
              </Input>
            </div>
          </FormSection>

          {/* INVENTORY */}
          <FormSection title="Inventory" description="Manage stock and SKU.">
            <div className="grid gap-6 md:grid-cols-2">
              <Input label="Stock">
                <input
                  type="number"
                  {...register("stock", {
                    valueAsNumber: true,
                  })}
                  className={inputClass}
                />
              </Input>

              <Input label="SKU">
                <input
                  {...register("sku")}
                  className={inputClass}
                  placeholder="Optional"
                />
              </Input>
            </div>
          </FormSection>

          {/* DESCRIPTION */}
          <FormSection
            title="Description"
            description="Describe your product in detail."
          >
            <Input
              label="Product Description"
              error={errors.description?.message}
            >
              <textarea
                {...register("description")}
                className={`${inputClass} min-h-52 resize-none`}
                placeholder="Write a detailed description..."
              />
            </Input>
          </FormSection>
        </div>

        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          {/* SETTINGS */}
          <FormSection
            title="Publishing"
            description="Manage how this product appears in your store."
          >
            <div className="space-y-4">
              <label
                className={`block cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                  watch("status") === "active"
                    ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <input
                  type="radio"
                  value="active"
                  {...register("status")}
                  className="hidden"
                />

                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Active
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Customers can purchase this product.
                    </p>
                  </div>

                  {watch("status") === "active" && (
                    <div className="rounded-full bg-green-600 px-2 py-1 text-xs font-medium text-white">
                      Active
                    </div>
                  )}
                </div>
              </label>

              <label
                className={`block cursor-pointer rounded-2xl border-2 p-4 transition-all ${
                  watch("status") === "draft"
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-950/20"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <input
                  type="radio"
                  value="draft"
                  {...register("status")}
                  className="hidden"
                />

                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      Draft
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Hidden until you publish it.
                    </p>
                  </div>

                  {watch("status") === "draft" && (
                    <div className="rounded-full bg-amber-500 px-2 py-1 text-xs font-medium text-white">
                      Draft
                    </div>
                  )}
                </div>
              </label>

              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      Featured Product
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Display this product on your homepage.
                    </p>
                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      {...register("featured")}
                      className="peer sr-only"
                    />

                    <div className="h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-blue-600 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Product Images"
            description="Upload images that customers will see."
          >
            <Input label="Images" error={errors.images?.message}>
              <label
                htmlFor="product-images"
                className="group flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-blue-500 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-900"
              >
                <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900/30 text-2xl">
                  📷
                </div>

                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                  Upload Product Images
                </h3>

                <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
                  Drag & Drop images here
                  <br />
                  or click to browse
                </p>

                <input
                  id="product-images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);

                    if (!files.length) return;

                    const current = watch("images") || [];

                    setSelectedImages((prev) => [...prev, ...files]);

                    setValue("images", [...current, ...files], {
                      shouldValidate: true,
                    });

                    setPreviewImages((prev) => [
                      ...prev,
                      ...files.map((file) => URL.createObjectURL(file)),
                    ]);
                  }}
                />
              </label>

              {(existingImages.length > 0 || previewImages.length > 0) && (
                <div className="mt-8">
                  <h4 className="mb-4 font-semibold text-slate-900 dark:text-white">
                    Uploaded Images
                  </h4>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {/* Existing Images */}
                    {existingImages.map((img, index) => (
                      <div
                        key={`existing-${index}`}
                        className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"
                      >
                        <img
                          src={img}
                          alt=""
                          className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            handleRemove(index);
                            removeExistingImage(index);
                          }}
                          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow transition group-hover:opacity-100"
                        >
                          ✕
                        </button>

                        <span className="absolute bottom-3 left-3 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
                          Existing
                        </span>
                      </div>
                    ))}

                    {/* New Images */}
                    {previewImages.map((img, index) => (
                      <div
                        key={`new-${index}`}
                        className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"
                      >
                        <img
                          src={img}
                          alt=""
                          className="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"
                        />

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImages((prev) =>
                              prev.filter((_, i) => i !== index),
                            );

                            setPreviewImages((prev) =>
                              prev.filter((_, i) => i !== index),
                            );

                            const current = watch("images") || [];

                            const updated = current.filter(
                              (_, i) => i !== existingImages.length + index,
                            );

                            setValue("images", updated, {
                              shouldValidate: true,
                            });
                          }}
                          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow transition group-hover:opacity-100"
                        >
                          ✕
                        </button>

                        <span className="absolute bottom-3 left-3 rounded-full bg-blue-600 px-2 py-1 text-xs text-white">
                          New
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Input>
          </FormSection>

          {/* SUBMIT */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end dark:border-slate-800">
            <Button
              type="button"
              // variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                  ? "Create Product"
                  : "Update Product"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

  /* reusable input wrapper */
  function Input({
    label,
    error,
    children,
  }: {
    label: string;
    error?: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">{label}</label>

        {children}

        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
