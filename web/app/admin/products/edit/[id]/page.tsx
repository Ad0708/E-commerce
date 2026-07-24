"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductsForm from "@/components/admin/products/ProductsForm";
import { useProduct } from "@/hooks/product/useProduct";
import { useUpdateProduct } from "@/hooks/product/useUpdateProduct";
import { ProductFormValues } from "@/types/product";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: product, isLoading } = useProduct(id as string);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  useEffect(() => {
    if (!product) return;
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-500">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex h-96 items-center justify-center text-red-500">
        Product not found
      </div>
    );
  }

  const handleSubmit = (data: ProductFormValues) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("stock", String(data.stock));
    formData.append("brand", data.brand || "");
    formData.append("sku", data.sku || "");
    formData.append("discountPrice", String(data.discountPrice || ""));
    formData.append("featured", String(data.featured));
    formData.append("status", data.status);

    const urls: string[] = [];
    const files: File[] = [];

    // 🔥 SPLIT MIXED ARRAY
    data.images.forEach((item: any) => {
      if (typeof item === "string") {
        urls.push(item);
      } else {
        files.push(item);
      }
    });

    // send URLs
    formData.append("images", JSON.stringify(urls));

    // send files
    files.forEach((file) => {
      formData.append("images", file);
    });

    updateProduct(
      { id: id as string, data: formData },
      {
        onSuccess: () => {
          router.push("/admin/products");
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <ProductsForm
        mode="edit"
        initialValues={product}
        onSubmit={handleSubmit}
        loading={isPending}
      />
    </div>
  );
}
